-- Add user_id column to users table
ALTER TABLE public.users 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX idx_users_user_id ON public.users(user_id);

-- Create trigger function to auto-populate user_id from email on insert
CREATE OR REPLACE FUNCTION public.set_user_id_from_auth()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set user_id to the authenticated user's id
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$;

-- Create trigger to automatically set user_id
CREATE TRIGGER set_user_id_before_insert
BEFORE INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.set_user_id_from_auth();

-- Drop old insecure RLS policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;

-- Create new secure RLS policies using user_id
CREATE POLICY "Users can insert their own profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Make user_id NOT NULL after existing data is handled
-- Note: In production, you'd need to backfill existing data first
ALTER TABLE public.users ALTER COLUMN user_id SET NOT NULL;