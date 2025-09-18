-- Create RLS policies for user_settings table
-- Enable RLS on user_settings table (in case it's not already enabled)
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own settings
CREATE POLICY "Users can view their own settings" 
ON public.user_settings 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for users to insert their own settings
CREATE POLICY "Users can insert their own settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own settings
CREATE POLICY "Users can update their own settings" 
ON public.user_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy for users to delete their own settings
CREATE POLICY "Users can delete their own settings" 
ON public.user_settings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create similar policies for other tables
-- Enable RLS on blocked_apps table
ALTER TABLE public.blocked_apps ENABLE ROW LEVEL SECURITY;

-- Create policies for blocked_apps
CREATE POLICY "Users can view their own blocked apps" 
ON public.blocked_apps 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blocked apps" 
ON public.blocked_apps 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blocked apps" 
ON public.blocked_apps 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blocked apps" 
ON public.blocked_apps 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable RLS on exercise_session table
ALTER TABLE public.exercise_session ENABLE ROW LEVEL SECURITY;

-- Create policies for exercise_session
CREATE POLICY "Users can view their own exercise sessions" 
ON public.exercise_session 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise sessions" 
ON public.exercise_session 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise sessions" 
ON public.exercise_session 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise sessions" 
ON public.exercise_session 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = email);

CREATE POLICY "Users can insert their own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid()::text = email);

CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid()::text = email);