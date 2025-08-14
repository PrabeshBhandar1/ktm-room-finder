import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useClerkAuth';
import { UserService } from '@/services/userService';

export const useUserLogin = () => {
  const { user } = useAuth();
  const [isStoring, setIsStoring] = useState(false);
  const [lastStored, setLastStored] = useState<Date | null>(null);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    const storeUserLogin = async () => {
      if (!user || isStoring || hasProcessedRef.current) return;

      console.log('🔍 useUserLogin: User detected:', {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      });

      setIsStoring(true);
      hasProcessedRef.current = true;
      
      try {
        // Check if user already has a login record for today
        console.log('🔍 Checking if user already logged in today...');
        const { hasLogin, error: checkError } = await UserService.hasLoginToday(user.id);
        
        if (checkError) {
          console.error('❌ Error checking today\'s login:', checkError);
          return;
        }

        console.log('🔍 Has login today:', hasLogin);

        // Only store login if user hasn't logged in today
        if (!hasLogin) {
          const userData = {
            user_id: user.id,
            username: user.username || `${user.firstName} ${user.lastName}`.trim() || null,
            email: user.emailAddresses[0]?.emailAddress || '',
            phone_number: user.phoneNumbers[0]?.phoneNumber || null,
          };

          console.log('🔍 Storing user login data:', userData);

          const { success, error } = await UserService.storeUserLogin(userData);
          
          if (success) {
            console.log('✅ User login information stored successfully');
            setLastStored(new Date());
          } else {
            console.error('❌ Failed to store user login:', error);
          }
        } else {
          console.log('ℹ️ User already logged in today, skipping storage');
        }
      } catch (error) {
        console.error('❌ Error in storeUserLogin:', error);
      } finally {
        setIsStoring(false);
      }
    };

    storeUserLogin();
  }, [user]); // Removed isStoring from dependencies

  // Reset the ref when user changes
  useEffect(() => {
    hasProcessedRef.current = false;
  }, [user?.id]);

  const getUserLoginHistory = async () => {
    if (!user) return { data: null, error: 'No user found' };
    
    return await UserService.getUserLoginHistory(user.id);
  };

  return {
    isStoring,
    lastStored,
    getUserLoginHistory,
  };
};
