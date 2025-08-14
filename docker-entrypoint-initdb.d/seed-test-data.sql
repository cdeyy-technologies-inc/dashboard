-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create and seed users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

INSERT INTO users (id, name, email, password) VALUES
  ('410544b2-4001-4271-9855-fec4b6a6442a', 'User', 'user@nextmail.com', '$2b$10$Xl0yhvzLIaJCDdKBS0Lld.ksK7c2Zytg/ZKFdtIYYQUv8rUfvCR4W') -- password is '123456'
ON CONFLICT (id) DO NOTHING;

-- Create and seed customers table  
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) NOT NULL
);

INSERT INTO customers (id, name, email, image_url) VALUES
  ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 'Evil Rabbit', 'evil@rabbit.com', '/customers/evil-rabbit.png'),
  ('3958dc9e-712f-4377-85e9-fec4b6a6442a', 'Delba de Oliveira', 'delba@oliveira.com', '/customers/delba-de-oliveira.png'),
  ('3958dc9e-742f-4377-85e9-fec4b6a6442a', 'Lee Robinson', 'lee@robinson.com', '/customers/lee-robinson.png'),
  ('76d65c26-f784-44a2-ac19-586678f7c2f2', 'Michael Novotny', 'michael@novotny.com', '/customers/michael-novotny.png'),
  ('CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 'Amy Burns', 'amy@burns.com', '/customers/amy-burns.png'),
  ('13D07535-C59E-4157-A011-F8D2EF4E0CBB', 'Balazs Orban', 'balazs@orban.com', '/customers/balazs-orban.png')
ON CONFLICT (id) DO NOTHING;

-- Create and seed invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  amount INT NOT NULL,
  status VARCHAR(255) NOT NULL,
  date DATE NOT NULL
);

INSERT INTO invoices (customer_id, amount, status, date) VALUES
  ((SELECT id FROM customers WHERE email = 'evil@rabbit.com'), 15795, 'pending', '2022-12-06'),
  ((SELECT id FROM customers WHERE email = 'delba@oliveira.com'), 20348, 'pending', '2022-11-14'),
  ((SELECT id FROM customers WHERE email = 'amy@burns.com'), 3040, 'paid', '2022-10-29'),
  ((SELECT id FROM customers WHERE email = 'michael@novotny.com'), 44800, 'paid', '2023-09-10'),
  ((SELECT id FROM customers WHERE email = 'balazs@orban.com'), 34577, 'pending', '2023-08-05'),
  ((SELECT id FROM customers WHERE email = 'lee@robinson.com'), 54246, 'pending', '2023-07-16'),
  ((SELECT id FROM customers WHERE email = 'evil@rabbit.com'), 666, 'pending', '2023-06-27'),
  ((SELECT id FROM customers WHERE email = 'michael@novotny.com'), 32545, 'paid', '2023-06-09'),
  ((SELECT id FROM customers WHERE email = 'amy@burns.com'), 1250, 'paid', '2023-06-17'),
  ((SELECT id FROM customers WHERE email = 'balazs@orban.com'), 8546, 'paid', '2023-06-07'),
  ((SELECT id FROM customers WHERE email = 'delba@oliveira.com'), 500, 'paid', '2023-08-19'),
  ((SELECT id FROM customers WHERE email = 'balazs@orban.com'), 8945, 'paid', '2023-06-03'),
  ((SELECT id FROM customers WHERE email = 'lee@robinson.com'), 1000, 'paid', '2022-06-05')
ON CONFLICT (id) DO NOTHING;

-- Create and seed revenue table
CREATE TABLE IF NOT EXISTS revenue (
  month VARCHAR(4) NOT NULL UNIQUE,
  revenue INT NOT NULL
);

INSERT INTO revenue (month, revenue) VALUES
  ('Jan', 2000),
  ('Feb', 1800),
  ('Mar', 2200),
  ('Apr', 2500),
  ('May', 2300),
  ('Jun', 3200),
  ('Jul', 3500),
  ('Aug', 3700),
  ('Sep', 2500),
  ('Oct', 2800),
  ('Nov', 3000),
  ('Dec', 4800)
ON CONFLICT (month) DO NOTHING;
