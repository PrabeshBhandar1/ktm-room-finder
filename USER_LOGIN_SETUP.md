# User Login Storage System

This document explains how the user login information storage system works in the KTM Room Finder application.

## Overview

The system automatically stores user login information in Supabase when users authenticate through Clerk. This includes:

- **Username**: User's username or full name
- **Email**: User's email address
- **Phone Number**: User's phone number (if available)
- **Logged In Date**: Timestamp of when the user logged in

## Database Schema

### `user_logins` Table

```sql
CREATE TABLE public.user_logins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    username TEXT,
    email TEXT NOT NULL,
    phone_number TEXT,
    logged_in_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes

- `idx_user_logins_user_id`: For faster lookups by user ID
- `idx_user_logins_email`: For faster lookups by email

### Row Level Security (RLS)

The table has RLS enabled with the following policies:

- Users can view their own login records
- Users can insert their own login records
- Users can update their own login records

## Implementation Details

### 1. UserService (`src/services/userService.ts`)

This service handles all database operations:

- `storeUserLogin()`: Stores user login information
- `getUserLoginHistory()`: Retrieves user's login history
- `hasLoginToday()`: Checks if user already logged in today

### 2. useUserLogin Hook (`src/hooks/useUserLogin.ts`)

A custom React hook that:

- Automatically stores login information when user authenticates
- Prevents duplicate entries for the same day
- Provides login history functionality

### 3. Navigation Component (`src/components/Navigation.tsx`)

Integrates the login storage system:

- Uses the `useUserLogin` hook
- Automatically triggers when user authenticates
- Maintains clean separation of concerns

## Features

### Automatic Storage

- Login information is automatically stored when users authenticate
- Only stores one login record per day per user
- Handles errors gracefully with console logging

### Data Validation

- Validates user data before storage
- Handles missing or null values appropriately
- Ensures required fields are present

### Performance

- Uses efficient database queries
- Implements proper indexing
- Prevents unnecessary duplicate entries

## Usage

### Basic Usage

The system works automatically - no manual intervention required. When a user signs in through Clerk, their login information is automatically stored.

### Manual Storage

```typescript
import { UserService } from '@/services/userService';

const userData = {
  user_id: 'user_123',
  username: 'john_doe',
  email: 'john@example.com',
  phone_number: '+1234567890'
};

const { success, error } = await UserService.storeUserLogin(userData);
```

### Retrieving Login History

```typescript
import { useUserLogin } from '@/hooks/useUserLogin';

const { getUserLoginHistory } = useUserLogin();
const { data, error } = await getUserLoginHistory();
```

## Error Handling

The system includes comprehensive error handling:

- Database connection errors
- Validation errors
- Duplicate entry prevention
- Network errors

All errors are logged to the console for debugging purposes.

## Security

- Row Level Security (RLS) ensures users can only access their own data
- User IDs are validated before storage
- Sensitive information is handled securely
- No sensitive data is exposed in client-side code

## Migration

To set up the database table, run the migration:

```bash
# Apply the migration
supabase db push
```

This will create the `user_logins` table with all necessary indexes and security policies.

## Monitoring

You can monitor user login activity through:

1. **Supabase Dashboard**: View the `user_logins` table
2. **Console Logs**: Check browser console for storage confirmations
3. **Database Queries**: Run queries to analyze login patterns

## Future Enhancements

Potential improvements:

- Login analytics dashboard
- Email notifications for suspicious activity
- Integration with user management system
- Advanced reporting features
