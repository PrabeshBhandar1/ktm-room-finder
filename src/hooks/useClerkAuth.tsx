import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerkAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    // Check if user is admin via metadata
    const adminFromMetadata = user?.publicMetadata?.role === 'admin';
    
    // Temporary admin access for development
    // You can add your email here for admin access
    const tempAdminEmails = [
      'bhadurkto123@gmail.com', // Replace with your actual email
      'admin@ktmrentals.com'
    ];
    
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    const isTempAdmin = userEmail && tempAdminEmails.includes(userEmail);

    console.log('🔍 Admin Check Debug:', {
      userEmail,
      adminFromMetadata,
      isTempAdmin,
      tempAdminEmails,
      finalAdminStatus: adminFromMetadata || isTempAdmin
    });

    setIsAdmin(adminFromMetadata || isTempAdmin);
  }, [user]);

  return {
    user,
    loading: !isLoaded,
    isAdmin,
    signOut
  };
};