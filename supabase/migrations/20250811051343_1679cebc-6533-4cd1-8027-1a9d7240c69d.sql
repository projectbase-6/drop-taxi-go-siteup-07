-- Create queries table for user messages
CREATE TABLE public.queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

-- Create policies for queries
CREATE POLICY "Queries can be inserted by anyone" 
ON public.queries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Queries are viewable by all" 
ON public.queries 
FOR SELECT 
USING (true);

CREATE POLICY "Queries can be updated by anyone" 
ON public.queries 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_queries_updated_at
BEFORE UPDATE ON public.queries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();