-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS revenue;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;

-- Drop extensions
DROP EXTENSION IF EXISTS "uuid-ossp";
