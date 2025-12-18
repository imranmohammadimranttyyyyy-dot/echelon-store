-- Add user_id column to products table for user-submitted products
ALTER TABLE public.products 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add status column for moderation (admin products are auto-approved)
ALTER TABLE public.products 
ADD COLUMN status text NOT NULL DEFAULT 'approved' 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Create index for faster queries
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_status ON public.products(status);

-- Update RLS policy for users to manage their own products
CREATE POLICY "Users can create their own products" 
ON public.products 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
ON public.products 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND status != 'approved');

CREATE POLICY "Users can delete their own products" 
ON public.products 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Update the active products policy to only show approved products
DROP POLICY IF EXISTS "Active products are viewable by everyone" ON public.products;
CREATE POLICY "Approved active products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (is_active = true AND status = 'approved');