import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { Theme } from "@/core/themes";
import { Text, ScreenContainer, Card, Chip } from "@/core/components";
import Svg, { Path } from "react-native-svg";
import useBookSync, { ExternalBook } from "@/features/books/hooks/useBookSync";

interface Book {
  id: string;
  title: string;
  author: string;
  rating: number;
  coverColor: string;
  imageUri?: string;
  reviews?: string;
  genre?: string;
  totalPages: number;
}

const FOR_YOU_BOOKS: Book[] = [
  {
    id: "fy1",
    title: "The Quiet Mind",
    author: "E. L. Davis",
    rating: 4.8,
    coverColor: "#4352a5",
    genre: "Self-Help",
    totalPages: 240,
  },
  {
    id: "fy2",
    title: "Solitude Patterns",
    author: "Marcus Wren",
    rating: 4.5,
    coverColor: "#5c6bc0",
    genre: "Philosophy",
    totalPages: 310,
  },
  {
    id: "fy3",
    title: "Deep Horizons",
    author: "Sarah Lin",
    rating: 4.9,
    coverColor: "#565a5c",
    genre: "Sci-Fi",
    totalPages: 450,
  },
  {
    id: "fy4",
    title: "Whispering Winds",
    author: "Arthur Pendel",
    rating: 4.2,
    coverColor: "#6e7275",
    genre: "Poetry",
    totalPages: 180,
  },
];

const TRENDING_BOOKS: Book[] = [
  {
    id: "tb1",
    title: "Echoes of Tomorrow",
    author: "Julian Thorne",
    rating: 4.9,
    coverColor: "#4858ab",
    reviews: "12k",
    genre: "Fiction",
    totalPages: 380,
  },
  {
    id: "tb2",
    title: "The Ink Drop",
    author: "Lia Vane",
    rating: 4.4,
    coverColor: "#bac3ff",
    genre: "Literature",
    totalPages: 290,
  },
  {
    id: "tb3",
    title: "City of Glass",
    author: "Roman Pierce",
    rating: 4.6,
    coverColor: "#c5c7c8",
    genre: "Mystery",
    totalPages: 340,
  },
];

// Star Icon component inside DiscoverView
const StarIcon = ({ fill = true, size = 14, color = Theme.Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? color : "none"}>
    <Path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function DiscoverView() {
  const [searchQuery, setSearchQuery] = useState("");
  const { addBookToLibrary, loading } = useBookSync();

  const handleAddBook = async (book: Book) => {
    const externalBook: ExternalBook = {
      id: book.id,
      title: book.title,
      author: book.author,
      totalPages: book.totalPages,
      coverImageUrl: `https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=120`,
      genreName: book.genre,
    };

    Alert.alert(
      "Quiet Reader Library",
      `"${book.title}" by ${book.author}\nGenre: ${book.genre || 'Fiction'}\nPages: ${book.totalPages} pages\n\nWould you like to add this book to your digital reading sanctuary?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add to Wishlist",
          onPress: async () => {
            const res = await addBookToLibrary(externalBook, "WISHLIST");
            if (res) {
              Alert.alert("Sanctuary Update", `"${book.title}" has been added to your Wishlist!`);
            } else {
              Alert.alert("Sanctuary Update", "Failed to add book. Please verify your authentication state.");
            }
          },
        },
        {
          text: "Start Reading Now",
          onPress: async () => {
            const res = await addBookToLibrary(externalBook, "READING");
            if (res) {
              Alert.alert("Sanctuary Update", `"${book.title}" is now set as your active reading book!`);
            } else {
              Alert.alert("Sanctuary Update", "Failed to add book. Please verify your authentication state.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer scrollable padding={false} hasBottomTabs style={styles.container}>
      {/* Search Header Area */}
      <View style={styles.headerSection}>
        <Text variant="headline-lg-mobile" color={Theme.Colors.primary} style={styles.title}>
          Discover New Worlds
        </Text>
        <Text variant="body-md" color={Theme.Colors.secondary} style={styles.subtitle}>
          Recommendations based on your interest.
        </Text>

        {/* Custom Rounded Search Bar */}
        <View style={styles.searchBarContainer}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
            <Path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke={Theme.Colors.outline}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <TextInput
            placeholder="Search authors, titles, or genres..."
            placeholderTextColor={Theme.Colors.outline}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Horizontal Recommendation Carousel */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text variant="headline-md" color={Theme.Colors.onSurface} style={styles.sectionTitle}>
            For You
          </Text>
          <Pressable>
            <Text variant="label-sm" color={Theme.Colors.primary}>
              See all
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={152} // coverWidth (130) + spacing (22)
          contentContainerStyle={styles.carouselScroll}
        >
          {FOR_YOU_BOOKS.map((book) => (
            <Pressable key={book.id} style={styles.bookCard} onPress={() => handleAddBook(book)}>
              <View style={[styles.coverContainer, { backgroundColor: book.coverColor }]}>
                {/* Book Spine Detail for Paper feel */}
                <View style={styles.bookSpineShadow} />
                
                {/* Rating Badge Top Right */}
                <View style={styles.ratingBadge}>
                  <StarIcon size={11} />
                  <Text variant="label-sm" style={styles.ratingText}>
                    {book.rating}
                  </Text>
                </View>

                {/* Cover Minimalist Art Placeholder */}
                <View style={styles.coverArtPlaceholder}>
                  <Text variant="label-sm" color="#ffffff" style={styles.coverGenreText}>
                    {book.genre}
                  </Text>
                </View>
              </View>

              <Text variant="label-md" color={Theme.Colors.onSurface} numberOfLines={1} style={styles.bookTitle}>
                {book.title}
              </Text>
              <Text variant="label-sm" color={Theme.Colors.secondary} numberOfLines={1}>
                {book.author}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Trending in Fiction Bento Grid / Stack List */}
      <View style={[styles.sectionContainer, styles.trendingSection]}>
        <Text variant="headline-md" color={Theme.Colors.onSurface} style={[styles.sectionTitle, styles.trendingTitle]}>
          Trending in Fiction
        </Text>

        {/* Large Bento Highlight Card */}
        <Pressable onPress={() => handleAddBook(TRENDING_BOOKS[0])}>
          <Card style={styles.trendingHighlightCard}>
            <View style={[styles.highlightCover, { backgroundColor: TRENDING_BOOKS[0].coverColor }]}>
              <View style={styles.bookSpineShadow} />
              <Text variant="label-sm" color="#ffffff" style={styles.coverGenreText}>
                {TRENDING_BOOKS[0].genre}
              </Text>
            </View>

            <View style={styles.highlightDetails}>
              <View style={styles.badgeRow}>
                <Chip label="#1 Trending" style={styles.trendingBadge} />
              </View>
              <Text variant="headline-md" color={Theme.Colors.onSurface} style={styles.highlightTitle}>
                {TRENDING_BOOKS[0].title}
              </Text>
              <Text variant="label-md" color={Theme.Colors.secondary} style={styles.highlightAuthor}>
                By {TRENDING_BOOKS[0].author}
              </Text>
              <Text variant="label-sm" color={Theme.Colors.onSurfaceVariant} numberOfLines={3} style={styles.highlightDesc}>
                A gripping exploration of memory and time, set against the backdrop of a minimalist utopian city.
              </Text>
              
              <View style={styles.highlightRatingRow}>
                <StarIcon size={14} />
                <Text variant="label-md" color={Theme.Colors.onSurface} style={styles.highlightRatingValue}>
                  {TRENDING_BOOKS[0].rating}
                </Text>
                <Text variant="label-sm" color={Theme.Colors.outline}>
                  ({TRENDING_BOOKS[0].reviews} reviews)
                </Text>
              </View>
            </View>
          </Card>
        </Pressable>

        {/* Stack List smaller items */}
        <View style={styles.trendingStack}>
          {TRENDING_BOOKS.slice(1).map((book) => (
            <Pressable key={book.id} style={styles.trendingStackRow} onPress={() => handleAddBook(book)}>
              <View style={[styles.stackCover, { backgroundColor: book.coverColor }]}>
                <View style={styles.bookSpineShadow} />
              </View>

              <View style={styles.stackDetails}>
                <Text variant="label-md" color={Theme.Colors.onSurface} numberOfLines={1} style={styles.stackTitle}>
                  {book.title}
                </Text>
                <Text variant="label-sm" color={Theme.Colors.secondary}>
                  {book.author}
                </Text>
                <View style={styles.stackRating}>
                  <StarIcon size={12} />
                  <Text variant="label-sm" color={Theme.Colors.onSurface} style={styles.stackRatingValue}>
                    {book.rating}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.Colors.background,
    paddingBottom: 40,
  },
  headerSection: {
    paddingHorizontal: Theme.Spacing.marginMobile,
    paddingTop: Theme.Spacing.md,
    marginBottom: Theme.Spacing.lg,
  },
  title: {
    fontWeight: "700",
    marginBottom: Theme.Spacing.xs,
  },
  subtitle: {
    marginBottom: Theme.Spacing.md,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.Colors.surfaceContainerLow,
    borderRadius: Theme.Roundness.full,
    paddingHorizontal: Theme.Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(198, 197, 211, 0.2)",
  },
  searchIcon: {
    marginRight: Theme.Spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: Theme.Colors.onSurface,
    fontFamily: Theme.Typography["body-md"].fontFamily,
    fontSize: 16,
  },
  sectionContainer: {
    marginBottom: Theme.Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: Theme.Spacing.marginMobile,
    marginBottom: Theme.Spacing.md,
  },
  sectionTitle: {
    fontWeight: "700",
  },
  carouselScroll: {
    paddingLeft: Theme.Spacing.marginMobile,
    paddingRight: Theme.Spacing.marginMobile - 22,
  },
  bookCard: {
    width: 130,
    marginRight: 22,
  },
  coverContainer: {
    width: 130,
    height: 195,
    borderRadius: Theme.Roundness.lg,
    overflow: "hidden",
    marginBottom: Theme.Spacing.xs,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    position: "relative",
  },
  bookSpineShadow: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    zIndex: 10,
  },
  ratingBadge: {
    position: "absolute",
    top: Theme.Spacing.xs,
    right: Theme.Spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: Theme.Roundness.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "600",
    color: Theme.Colors.onSurface,
    marginLeft: 2,
  },
  coverArtPlaceholder: {
    flex: 1,
    justifyContent: "flex-end",
    padding: Theme.Spacing.xs,
  },
  coverGenreText: {
    fontSize: 10,
    fontWeight: "600",
    opacity: 0.9,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Theme.Roundness.DEFAULT,
    alignSelf: "flex-start",
  },
  bookTitle: {
    fontWeight: "600",
    marginBottom: 2,
  },
  trendingSection: {
    paddingHorizontal: Theme.Spacing.marginMobile,
  },
  trendingTitle: {
    marginBottom: Theme.Spacing.md,
  },
  trendingHighlightCard: {
    flexDirection: "row",
    padding: Theme.Spacing.sm,
    backgroundColor: Theme.Colors.surfaceContainerLow,
    borderRadius: Theme.Roundness.lg,
    borderWidth: 1,
    borderColor: "rgba(198, 197, 211, 0.3)",
    marginBottom: Theme.Spacing.md,
  },
  highlightCover: {
    width: 100,
    height: 150,
    borderRadius: Theme.Roundness.DEFAULT,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: "flex-end",
    padding: Theme.Spacing.xs,
  },
  highlightDetails: {
    flex: 1,
    marginLeft: Theme.Spacing.md,
    justifyContent: "center",
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: Theme.Spacing.xs,
  },
  trendingBadge: {
    backgroundColor: "rgba(67, 82, 165, 0.08)",
    borderWidth: 0,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  trendingBadgeText: {
    color: Theme.Colors.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  highlightAuthor: {
    marginBottom: 6,
  },
  highlightDesc: {
    lineHeight: 16,
    marginBottom: Theme.Spacing.xs,
    fontSize: 11,
  },
  highlightRatingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  highlightRatingValue: {
    fontWeight: "700",
    marginHorizontal: 4,
    fontSize: 12,
  },
  trendingStack: {
    gap: Theme.Spacing.sm,
  },
  trendingStackRow: {
    flexDirection: "row",
    backgroundColor: Theme.Colors.surfaceContainerLowest,
    borderRadius: Theme.Roundness.lg,
    padding: Theme.Spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(198, 197, 211, 0.2)",
    alignItems: "center",
  },
  stackCover: {
    width: 48,
    height: 72,
    borderRadius: Theme.Roundness.DEFAULT,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    marginRight: Theme.Spacing.sm,
  },
  stackDetails: {
    flex: 1,
    justifyContent: "center",
  },
  stackTitle: {
    fontWeight: "600",
    marginBottom: 1,
  },
  stackRating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  stackRatingValue: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: "600",
  },
});
