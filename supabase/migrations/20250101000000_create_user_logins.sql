-- Create user_logins table to store user authentication information
CREATE TABLE IF NOT EXISTS public.user_logins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    username TEXT,
    email TEXT NOT NULL,
    phone_number TEXT,
    logged_in_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_logins_user_id ON public.user_logins(user_id);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_logins_email ON public.user_logins(email);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_logins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own login records
CREATE POLICY "Users can view their own login records" ON public.user_logins
    FOR SELECT USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own login records
CREATE POLICY "Users can insert their own login records" ON public.user_logins
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own login records
CREATE POLICY "Users can update their own login records" ON public.user_logins
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_logins_updated_at 
    BEFORE UPDATE ON public.user_logins 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
