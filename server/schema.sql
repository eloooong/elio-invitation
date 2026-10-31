CREATE TABLE IF NOT EXISTS invitation (
  id integer PRIMARY KEY CHECK (id = 1),
  config jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS replies (
  id uuid PRIMARY KEY,
  guest_id uuid UNIQUE,
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 60),
  going boolean NOT NULL,
  adults integer NOT NULL CHECK (adults BETWEEN 0 AND 8),
  kids integer NOT NULL CHECK (kids BETWEEN 0 AND 8),
  diet text NOT NULL DEFAULT '' CHECK (length(diet) <= 140),
  note text NOT NULL DEFAULT '' CHECK (length(note) <= 280),
  manual boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS login_attempts (
  bucket text PRIMARY KEY,
  attempts integer NOT NULL DEFAULT 1,
  expires_at timestamptz NOT NULL
);
