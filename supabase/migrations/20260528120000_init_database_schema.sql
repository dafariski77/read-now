-- 1. Create custom ENUM types in public schema
CREATE TYPE public.reading_status AS ENUM ('WISHLIST', 'READING', 'COMPLETED');
CREATE TYPE public.unlock_condition_type AS ENUM ('TOTAL_BOOKS_READ', 'GENRE_BOOKS_READ');

-- 2. Create public.genres table
CREATE TABLE public.genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 3. Create public.user_preferences table (composite key for onboarding favorites)
CREATE TABLE public.user_preferences (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    genre_id INT REFERENCES public.genres(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, genre_id)
);

-- 4. Create public.books table (caching metadata queried from open APIs)
CREATE TABLE public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_api_id VARCHAR(100) UNIQUE, -- Google Books API ID
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    total_pages INT NOT NULL,
    cover_image_url TEXT,
    primary_genre_id INT REFERENCES public.genres(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create public.user_books table (linking user libraries, status, and goals)
CREATE TABLE public.user_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    status public.reading_status DEFAULT 'WISHLIST',
    current_page INT DEFAULT 0,
    target_end_date DATE,
    target_daily_pages INT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, book_id)
);

-- 6. Create public.reading_logs table (historical progress tracking)
CREATE TABLE public.reading_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_book_id UUID REFERENCES public.user_books(id) ON DELETE CASCADE,
    pages_read_today INT NOT NULL,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create public.characters table (companion directory)
CREATE TABLE public.characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    illustration_url TEXT NOT NULL,
    condition_type public.unlock_condition_type NOT NULL,
    condition_value INT NOT NULL, -- required amount
    condition_genre_id INT REFERENCES public.genres(id) ON DELETE SET NULL,
    is_default BOOLEAN DEFAULT FALSE
);

-- 8. Create public.user_characters table (claimed character unlocks collection)
CREATE TABLE public.user_characters (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, character_id)
);

-- 9. Alter public.profiles table to reference active companion character
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS active_character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL;

-- 10. Enable Row Level Security (RLS) on all newly created tables
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_characters ENABLE ROW LEVEL SECURITY;

-- 11. Define strict Row-Level Security (RLS) Policies

-- public.genres: Viewable by anyone
CREATE POLICY "Genres are viewable by everyone" ON public.genres FOR SELECT USING (true);

-- public.characters: Viewable by everyone
CREATE POLICY "Characters are viewable by everyone" ON public.characters FOR SELECT USING (true);

-- public.books: Viewable by anyone, can be created by authenticated users
CREATE POLICY "Books are viewable by everyone" ON public.books FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert books" ON public.books FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- public.user_preferences: Owners can view/edit their preferred genres
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences 
USING (auth.uid() = user_id);

-- public.user_books: Owners can fully manage their reading queue and stats
CREATE POLICY "Users can manage their own book list" ON public.user_books 
USING (auth.uid() = user_id);

-- public.user_characters: Owners can fully manage their unlocked companions
CREATE POLICY "Users can manage their own character collection" ON public.user_characters 
USING (auth.uid() = user_id);

-- public.reading_logs: Owners of the corresponding user_book can edit/read logs
CREATE POLICY "Users can manage logs for their own books" ON public.reading_logs 
USING (
    EXISTS (
        SELECT 1 FROM public.user_books 
        WHERE user_books.id = reading_logs.user_book_id 
          AND user_books.user_id = auth.uid()
    )
);

-- 12. Create PL/pgSQL function to evaluate automated unlocks on completed book status
CREATE OR REPLACE FUNCTION public.check_character_unlocks()
RETURNS TRIGGER AS $$
DECLARE
    v_total_completed INT;
    v_genre_completed INT;
    v_char RECORD;
BEGIN
    -- Evaluate unlocks ONLY if a user_book record transitions to COMPLETED status
    IF (TG_OP = 'UPDATE' AND OLD.status <> 'COMPLETED' AND NEW.status = 'COMPLETED') 
       OR (TG_OP = 'INSERT' AND NEW.status = 'COMPLETED') THEN
        
        -- A. Compute total completed books for this user
        SELECT COUNT(*) INTO v_total_completed
        FROM public.user_books
        WHERE user_id = NEW.user_id AND status = 'COMPLETED';
        
        -- B. Iterate through locked characters to check if conditions are newly satisfied
        FOR v_char IN 
            SELECT c.id, c.name, c.condition_type, c.condition_value, c.condition_genre_id
            FROM public.characters c
            WHERE NOT EXISTS (
                SELECT 1 FROM public.user_characters uc 
                WHERE uc.user_id = NEW.user_id AND uc.character_id = c.id
            )
        LOOP
            -- Check condition based on type: TOTAL_BOOKS_READ
            IF v_char.condition_type = 'TOTAL_BOOKS_READ' THEN
                IF v_total_completed >= v_char.condition_value THEN
                    INSERT INTO public.user_characters (user_id, character_id)
                    VALUES (NEW.user_id, v_char.id)
                    ON CONFLICT DO NOTHING;
                END IF;
                
            -- Check condition based on type: GENRE_BOOKS_READ
            ELSIF v_char.condition_type = 'GENRE_BOOKS_READ' THEN
                SELECT COUNT(*) INTO v_genre_completed
                FROM public.user_books ub
                JOIN public.books b ON ub.book_id = b.id
                WHERE ub.user_id = NEW.user_id 
                  AND ub.status = 'COMPLETED' 
                  AND b.primary_genre_id = v_char.condition_genre_id;
                  
                IF v_genre_completed >= v_char.condition_value THEN
                    INSERT INTO public.user_characters (user_id, character_id)
                    VALUES (NEW.user_id, v_char.id)
                    ON CONFLICT DO NOTHING;
                END IF;
            END IF;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for public.user_books update
CREATE OR REPLACE TRIGGER on_user_book_updated_achievement
AFTER INSERT OR UPDATE ON public.user_books
FOR EACH ROW EXECUTE FUNCTION public.check_character_unlocks();

-- 13. Create PL/pgSQL function to automatically unlock starter companion on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_character()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Unlock Bookish Bloop (the default starter companion)
    INSERT INTO public.user_characters (user_id, character_id)
    VALUES (NEW.id, 'c1000000-0000-0000-0000-000000000001'::uuid)
    ON CONFLICT DO NOTHING;
    
    -- 2. Set active_character_id to Bookish Bloop
    UPDATE public.profiles 
    SET active_character_id = 'c1000000-0000-0000-0000-000000000001'::uuid
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for public.profiles AFTER INSERT
CREATE OR REPLACE TRIGGER on_profile_created_unlock_default_companion
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_character();

-- 14. Seed Master Genres
INSERT INTO public.genres (id, name) VALUES
(1, 'Fiction'),
(2, 'Sci-Fi & Fantasy'),
(3, 'Philosophy'),
(4, 'Non-Fiction'),
(5, 'Romance'),
(6, 'Biography'),
(7, 'Poetry'),
(8, 'Self-Help'),
(9, 'Mystery & Thriller')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Reset SERIAL sequence on genres to match seeded entries
SELECT setval('public.genres_id_seq', 9, true);

-- 15. Seed 6 MVP Companion Characters
INSERT INTO public.characters (id, name, description, illustration_url, condition_type, condition_value, condition_genre_id, is_default) VALUES
('c1000000-0000-0000-0000-000000000001', 'Bookish Bloop', 'A cute starter buddy who loves to keep you company. Always unlocked!', 'bookish_bloop', 'TOTAL_BOOKS_READ', 0, NULL, TRUE),
('c1000000-0000-0000-0000-000000000002', 'Specs Specter', 'This floating phantom unlocked after completing 10 books.', 'specs_specter', 'TOTAL_BOOKS_READ', 10, NULL, FALSE),
('c1000000-0000-0000-0000-000000000003', 'Pages', 'An elegant companion that locks on your head. Unlocked after completing 25 books.', 'pages', 'TOTAL_BOOKS_READ', 25, NULL, FALSE),
('c1000000-0000-0000-0000-000000000004', 'Stacker', 'A towering collection of books. Unlocked after completing 50 books.', 'stacker', 'TOTAL_BOOKS_READ', 50, NULL, FALSE),
('c1000000-0000-0000-0000-000000000005', 'Romance Reader', 'A heart-loving buddy who keeps you dreaming. Unlocked after completing 10 Romance books.', 'romance_reader', 'GENRE_BOOKS_READ', 10, 5, FALSE),
('c1000000-0000-0000-0000-000000000006', 'Dreamer', 'A serene cloud floating through the reading landscape. Unlocked after completing 100 books.', 'dreamer', 'TOTAL_BOOKS_READ', 100, NULL, FALSE)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    illustration_url = EXCLUDED.illustration_url,
    condition_type = EXCLUDED.condition_type,
    condition_value = EXCLUDED.condition_value,
    condition_genre_id = EXCLUDED.condition_genre_id,
    is_default = EXCLUDED.is_default;

-- 16. Grant Achievements & active companions to existing users
INSERT INTO public.user_characters (user_id, character_id)
SELECT id, 'c1000000-0000-0000-0000-000000000001'::uuid FROM public.profiles
ON CONFLICT DO NOTHING;

UPDATE public.profiles 
SET active_character_id = 'c1000000-0000-0000-0000-000000000001'::uuid
WHERE active_character_id IS NULL;
