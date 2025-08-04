-- Find user by email and add admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'bprabesh38@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;