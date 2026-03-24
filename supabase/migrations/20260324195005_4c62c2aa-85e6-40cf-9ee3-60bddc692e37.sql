-- Create contacts table
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  status TEXT NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'prospect', 'customer', 'inactive')),
  last_contact TIMESTAMPTZ,
  notes TEXT,
  tags TEXT[],
  website TEXT,
  platform TEXT,
  category TEXT,
  installs_reviews TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow all access for now (no auth yet)
CREATE POLICY "Allow all read access" ON public.contacts FOR SELECT USING (true);
CREATE POLICY "Allow all insert access" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access" ON public.contacts FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access" ON public.contacts FOR DELETE USING (true);