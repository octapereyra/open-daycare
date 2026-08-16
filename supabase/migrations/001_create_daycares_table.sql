CREATE TABLE public.daycares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.daycares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daycares_read" ON public.daycares
  FOR SELECT
  USING (true);

CREATE POLICY "daycares_insert" ON public.daycares
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "daycares_update" ON public.daycares
  FOR UPDATE
  USING (false);

CREATE POLICY "daycares_delete" ON public.daycares
  FOR DELETE
  USING (false);

INSERT INTO public.daycares (name, address) VALUES
  ('Guardería Sala Soles', 'Av. Principal 123, Centro'),
  ('Guardería Arcoíris', 'Calle Luna 456, Zona Norte'),
  ('Guardería Semillitas', 'Blvd. del Sol 789, Col. Jardines'),
  ('Guardería Estrellitas', 'Paseo de los Niños 321, Residencial')
ON CONFLICT DO NOTHING;
