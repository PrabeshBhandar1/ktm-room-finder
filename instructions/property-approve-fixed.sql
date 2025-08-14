-- Create toverify table
CREATE TABLE IF NOT EXISTS public.toverify (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    bedrooms INTEGER NOT NULL DEFAULT 1,
    bathrooms INTEGER NOT NULL DEFAULT 1,
    amenities TEXT[],
    images TEXT[],
    available BOOLEAN NOT NULL DEFAULT true,
    owner_id TEXT NOT NULL,
    contact_phone TEXT,
    contact_email TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for toverify
CREATE INDEX IF NOT EXISTS idx_toverify_status ON public.toverify(status);
CREATE INDEX IF NOT EXISTS idx_toverify_owner_id ON public.toverify(owner_id);

-- Enable RLS
ALTER TABLE public.toverify ENABLE ROW LEVEL SECURITY;

-- Function to get user ID from JWT claims (for Clerk)
CREATE OR REPLACE FUNCTION get_user_id_from_jwt()
RETURNS TEXT AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::json->>'sub')::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin from JWT claims
CREATE OR REPLACE FUNCTION is_admin_from_jwt()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::json->>'metadata'->>'role')::TEXT = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User can insert their own property
CREATE POLICY "Users can insert their own toverify"
ON public.toverify
FOR INSERT
WITH CHECK (get_user_id_from_jwt() = owner_id);

-- Users can view their own listings
CREATE POLICY "Users can view their own toverify"
ON public.toverify
FOR SELECT
USING (get_user_id_from_jwt() = owner_id);

-- Admin can view all toverify
CREATE POLICY "Admin can view all toverify"
ON public.toverify
FOR SELECT
USING (is_admin_from_jwt());

-- Only admin can update status
CREATE POLICY "Admin can update status"
ON public.toverify
FOR UPDATE
USING (is_admin_from_jwt());

-- Function to move approved properties to rooms table
CREATE OR REPLACE FUNCTION move_approved_to_rooms()
RETURNS TRIGGER AS $$
BEGIN
    -- Only act when status changes to 'approved'
    IF NEW.status = 'approved' AND OLD.status IS DISTINCT FROM 'approved' THEN
        INSERT INTO public.rooms (
            id, title, description, location, price, bedrooms, bathrooms, amenities, images, available,
            owner_id, contact_phone, contact_email, created_at, updated_at
        )
        VALUES (
            NEW.id, NEW.title, NEW.description, NEW.location, NEW.price, NEW.bedrooms, NEW.bathrooms,
            NEW.amenities, NEW.images, NEW.available, NEW.owner_id, NEW.contact_phone, NEW.contact_email,
            NEW.created_at, NEW.updated_at
        );

        -- Optional: Delete from toverify after moving
        DELETE FROM public.toverify WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for status update
CREATE TRIGGER trg_move_approved
AFTER UPDATE OF status ON public.toverify
FOR EACH ROW
EXECUTE FUNCTION move_approved_to_rooms();
