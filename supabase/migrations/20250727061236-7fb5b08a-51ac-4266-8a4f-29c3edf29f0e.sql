-- Create vehicle categories table
CREATE TABLE public.vehicle_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  base_multiplier NUMERIC NOT NULL DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicle types table  
CREATE TABLE public.vehicle_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.vehicle_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_multiplier NUMERIC NOT NULL DEFAULT 1.0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vehicle_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_types ENABLE ROW LEVEL SECURITY;

-- Create policies for vehicle categories
CREATE POLICY "Vehicle categories are publicly readable" 
ON public.vehicle_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Allow vehicle category management" 
ON public.vehicle_categories 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for vehicle types
CREATE POLICY "Vehicle types are publicly readable" 
ON public.vehicle_types 
FOR SELECT 
USING (true);

CREATE POLICY "Allow vehicle type management" 
ON public.vehicle_types 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Insert default vehicle categories
INSERT INTO public.vehicle_categories (name, base_multiplier) VALUES 
('Sedan', 1.0),
('SUV', 1.3);

-- Insert default vehicle types
INSERT INTO public.vehicle_types (category_id, name, description, price_multiplier) 
SELECT 
  vc.id,
  vt.name,
  vt.description,
  vt.price_multiplier
FROM public.vehicle_categories vc
CROSS JOIN (
  VALUES 
    ('Swift Dzire', 'Comfortable sedan for city rides', 1.0),
    ('Toyota Etios', 'Reliable and spacious sedan', 1.1),
    ('Innova Crysta', 'Premium SUV for group travel', 1.0),
    ('Ertiga', 'Compact SUV perfect for families', 0.9)
) AS vt(name, description, price_multiplier)
WHERE (vc.name = 'Sedan' AND vt.name IN ('Swift Dzire', 'Toyota Etios'))
   OR (vc.name = 'SUV' AND vt.name IN ('Innova Crysta', 'Ertiga'));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicle_categories_updated_at
  BEFORE UPDATE ON public.vehicle_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_types_updated_at
  BEFORE UPDATE ON public.vehicle_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();