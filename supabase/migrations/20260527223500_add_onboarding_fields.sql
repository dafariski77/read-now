-- Alter public.profiles table to add companion and reading_goal columns from onboarding
alter table public.profiles 
  add column if not exists companion text default 'fennec',
  add column if not exists reading_goal text default '30 Mins';
