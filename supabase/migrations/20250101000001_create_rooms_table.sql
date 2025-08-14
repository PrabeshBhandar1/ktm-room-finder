-- Create rooms table to store room/property information
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    bedrooms INTEGER NOT NULL DEFAULT 1,
    bathrooms INTEGER NOT NULL DEFAULT 1,
    amenities TEXT[], -- Array of amenities like ['WiFi', 'Parking', 'Garden']
    images TEXT[], -- Array of image URLs
    available BOOLEAN NOT NULL DEFAULT true,
    owner_id TEXT NOT NULL, -- References the user who owns/listed the property
    contact_phone TEXT,
    contact_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rooms_location ON public.rooms(location);
CREATE INDEX IF NOT EXISTS idx_rooms_price ON public.rooms(price);
CREATE INDEX IF NOT EXISTS idx_rooms_available ON public.rooms(available);
CREATE INDEX IF NOT EXISTS idx_rooms_owner_id ON public.rooms(owner_id);
CREATE INDEX IF NOT EXISTS idx_rooms_created_at ON public.rooms(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Create policies for rooms table
-- Users can view all available rooms
CREATE POLICY "Anyone can view available rooms" ON public.rooms
    FOR SELECT USING (available = true);

-- Users can view their own rooms (even if not available)
CREATE POLICY "Users can view their own rooms" ON public.rooms
    FOR SELECT USING (auth.uid()::text = owner_id);

-- Users can insert their own rooms
CREATE POLICY "Users can insert their own rooms" ON public.rooms
    FOR INSERT WITH CHECK (auth.uid()::text = owner_id);

-- Users can update their own rooms
CREATE POLICY "Users can update their own rooms" ON public.rooms
    FOR UPDATE USING (auth.uid()::text = owner_id);

-- Users can delete their own rooms
CREATE POLICY "Users can delete their own rooms" ON public.rooms
    FOR DELETE USING (auth.uid()::text = owner_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_rooms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_rooms_updated_at 
    BEFORE UPDATE ON public.rooms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_rooms_updated_at();

-- Create bookings table to track room bookings
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- The user who booked the room
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    total_amount DECIMAL(10,2) NOT NULL,
    message TEXT, -- Optional message from user
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(start_date, end_date);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policies for bookings
-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (auth.uid()::text = user_id);

-- Room owners can view bookings for their rooms
CREATE POLICY "Room owners can view bookings for their rooms" ON public.bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.rooms 
            WHERE rooms.id = bookings.room_id 
            AND rooms.owner_id = auth.uid()::text
        )
    );

-- Users can create their own bookings
CREATE POLICY "Users can create their own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can update their own bookings
CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Room owners can update bookings for their rooms
CREATE POLICY "Room owners can update bookings for their rooms" ON public.bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.rooms 
            WHERE rooms.id = bookings.room_id 
            AND rooms.owner_id = auth.uid()::text
        )
    );

-- Create trigger for bookings updated_at
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON public.bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
