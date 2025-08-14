# KTM Rentals - Setup Guide

## 🚀 Quick Start

### 1. Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Database Setup

Run the following SQL migrations in your Supabase project:

#### Migration 1: User Logins Table
```sql
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_logins_user_id ON public.user_logins(user_id);
CREATE INDEX IF NOT EXISTS idx_user_logins_email ON public.user_logins(email);

-- Enable RLS
ALTER TABLE public.user_logins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own login records" ON public.user_logins
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own login records" ON public.user_logins
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own login records" ON public.user_logins
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_user_logins_updated_at 
    BEFORE UPDATE ON public.user_logins 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

#### Migration 2: Rooms and Bookings Tables
```sql
-- Create rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for rooms
CREATE INDEX IF NOT EXISTS idx_rooms_location ON public.rooms(location);
CREATE INDEX IF NOT EXISTS idx_rooms_price ON public.rooms(price);
CREATE INDEX IF NOT EXISTS idx_rooms_available ON public.rooms(available);
CREATE INDEX IF NOT EXISTS idx_rooms_owner_id ON public.rooms(owner_id);
CREATE INDEX IF NOT EXISTS idx_rooms_created_at ON public.rooms(created_at);

-- Enable RLS for rooms
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Create policies for rooms
CREATE POLICY "Anyone can view available rooms" ON public.rooms
    FOR SELECT USING (available = true);

CREATE POLICY "Users can view their own rooms" ON public.rooms
    FOR SELECT USING (auth.uid()::text = owner_id);

CREATE POLICY "Users can insert their own rooms" ON public.rooms
    FOR INSERT WITH CHECK (auth.uid()::text = owner_id);

CREATE POLICY "Users can update their own rooms" ON public.rooms
    FOR UPDATE USING (auth.uid()::text = owner_id);

CREATE POLICY "Users can delete their own rooms" ON public.rooms
    FOR DELETE USING (auth.uid()::text = owner_id);

-- Create trigger for rooms
CREATE TRIGGER update_rooms_updated_at 
    BEFORE UPDATE ON public.rooms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    total_amount DECIMAL(10,2) NOT NULL,
    message TEXT,
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

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Room owners can view bookings for their rooms" ON public.bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.rooms 
            WHERE rooms.id = bookings.room_id 
            AND rooms.owner_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can create their own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Room owners can update bookings for their rooms" ON public.bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.rooms 
            WHERE rooms.id = bookings.room_id 
            AND rooms.owner_id = auth.uid()::text
        )
    );

-- Create trigger for bookings
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON public.bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

## 🔧 Configuration

### Clerk Authentication Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your publishable key
4. Add it to your `.env` file

### Supabase Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings > API
4. Copy your project URL and anon key
5. Add them to your `.env` file

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navigation.tsx  # Main navigation
│   ├── Footer.tsx      # Footer component
│   └── ...
├── pages/              # Page components
│   ├── Index.tsx       # Home page
│   ├── Rooms.tsx       # Rooms listing
│   ├── Admin.tsx       # Admin dashboard
│   └── ...
├── services/           # API services
│   ├── roomService.ts  # Room operations
│   └── userService.ts  # User operations
├── hooks/              # Custom React hooks
│   ├── useClerkAuth.tsx # Clerk authentication
│   └── useUserLogin.ts  # User login tracking
├── integrations/       # Third-party integrations
│   └── supabase/       # Supabase client and types
└── ...
```

## 🚀 Features Implemented

### ✅ Authentication
- Clerk authentication integration
- User login tracking in database
- Protected routes
- Admin role support

### ✅ Room Management
- Real-time room listing from database
- Room search and filtering
- Room details with image carousel
- Price visibility toggle for logged-in users

### ✅ Admin Dashboard
- Room CRUD operations
- Room availability toggle
- User-specific room management
- Real-time updates

### ✅ User Experience
- Responsive design
- Loading states
- Error handling
- Toast notifications
- Modern UI with shadcn/ui

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- User-specific data access policies
- Environment variable protection
- Input validation and sanitization

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎨 Customization

### Colors
The app uses a custom color palette defined in `tailwind.config.ts`:
- Brand Lavender: `#B9A7C9`
- Brand Light Blue: `#82B3D7`
- Brand Light Gray: `#E3E3E3`

### Styling
- Tailwind CSS for styling
- shadcn/ui for component library
- Custom CSS variables for theming

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## 🔧 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env` file is in the root directory
   - Restart the development server
   - Check variable names start with `VITE_`

2. **Database Connection Issues**
   - Verify Supabase URL and key
   - Check RLS policies
   - Ensure tables are created

3. **Authentication Issues**
   - Verify Clerk publishable key
   - Check Clerk application settings
   - Ensure redirect URLs are configured

### Support

For issues or questions:
- Check the console for error messages
- Verify all environment variables are set
- Ensure database migrations are applied
- Check network connectivity

## 📈 Next Steps

### Planned Features
- [ ] Booking system implementation
- [ ] Payment integration
- [ ] Image upload functionality
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] User reviews and ratings
- [ ] Mobile app development

### Performance Optimizations
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Caching strategies
- [ ] Database query optimization

---

**Happy coding! 🎉**
