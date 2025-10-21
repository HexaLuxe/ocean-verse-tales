-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create poems table
CREATE TABLE public.poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  lines TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS on poems
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  poem_id UUID REFERENCES public.poems(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, poem_id)
);

-- Enable RLS on favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poem_id UUID REFERENCES public.poems(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "User roles are viewable by everyone"
  ON public.user_roles FOR SELECT
  USING (true);

-- RLS Policies for poems
CREATE POLICY "Poems are viewable by everyone"
  ON public.poems FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert poems"
  ON public.poems FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update poems"
  ON public.poems FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete poems"
  ON public.poems FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial poems data
INSERT INTO public.poems (title, author, excerpt, lines) VALUES
('The Sea', 'Pablo Neruda', 'I need the sea because it teaches me...', ARRAY[
  'I need the sea because it teaches me.',
  'I don''t know if I learn music or awareness,',
  'if it''s a single wave or its vast existence,',
  'or only its harsh voice or its shining',
  'suggestion of fishes and ships.'
]),
('Sea Fever', 'John Masefield', 'I must go down to the seas again...', ARRAY[
  'I must go down to the seas again,',
  'to the lonely sea and the sky,',
  'And all I ask is a tall ship',
  'and a star to steer her by.'
]),
('The Ocean', 'Nathaniel Hawthorne', 'The ocean has its silent caves...', ARRAY[
  'The ocean has its silent caves,',
  'Deep, quiet, and alone;',
  'Though there be fury on the waves,',
  'Beneath them there is none.'
]),
('Dover Beach', 'Matthew Arnold', 'The sea is calm tonight...', ARRAY[
  'The sea is calm tonight.',
  'The tide is full, the moon lies fair',
  'Upon the straits; on the French coast the light',
  'Gleams and is gone; the cliffs of England stand,',
  'Glimmering and vast, out in the tranquil bay.'
]),
('By the Sea', 'Emily Dickinson', 'I started early, took my dog...', ARRAY[
  'I started early, took my dog,',
  'And visited the sea;',
  'The mermaids in the basement',
  'Came out to look at me.'
]),
('The Tide Rises, The Tide Falls', 'Henry Wadsworth Longfellow', 'The tide rises, the tide falls...', ARRAY[
  'The tide rises, the tide falls,',
  'The twilight darkens, the curlew calls;',
  'Along the sea-sands damp and brown',
  'The traveller hastens toward the town,',
  'And the tide rises, the tide falls.'
]),
('Sea-Wash', 'Carl Sandburg', 'The sea-wash never ends...', ARRAY[
  'The sea-wash never ends.',
  'The sea-wash repeats, repeats.',
  'Only old songs? Is that all the sea knows?',
  'Only the old strong songs?',
  'Is that all?'
]),
('Cargoes', 'John Masefield', 'Quinquireme of Nineveh from distant Ophir...', ARRAY[
  'Quinquireme of Nineveh from distant Ophir,',
  'Rowing home to haven in sunny Palestine,',
  'With a cargo of ivory,',
  'And apes and peacocks,',
  'Sandalwood, cedarwood, and sweet white wine.'
]),
('The World Below the Brine', 'Walt Whitman', 'The world below the brine...', ARRAY[
  'The world below the brine,',
  'Forests at the bottom of the sea, the branches and leaves,',
  'Sea-lettuce, vast lichens, strange flowers and seeds,',
  'The thick tangle, openings, and pink turf,',
  'Different colors, pale gray and green, purple, white, and gold.'
]),
('Maggie and Milly and Molly and May', 'E.E. Cummings', 'Maggie and milly and molly and may...', ARRAY[
  'maggie and milly and molly and may',
  'went down to the beach (to play one day)',
  'and maggie discovered a shell that sang',
  'so sweetly she couldn''t remember her troubles, and',
  'milly befriended a stranded star'
])