/*
  # Create Studios and Bookings System

  1. New Tables
    - `studios`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the studio
      - `description` (text) - Full description
      - `price_per_night` (numeric) - Price per night
      - `capacity` (integer) - Max number of people
      - `bedrooms` (integer) - Number of bedrooms
      - `bathrooms` (integer) - Number of bathrooms
      - `beds` (integer) - Number of beds
      - `amenities` (jsonb) - Coffee machine, stove, BBQ, etc.
      - `images` (jsonb) - Array of image URLs
      - `main_image` (text) - Main thumbnail image
      - `created_at` (timestamptz)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `studio_id` (uuid, foreign key)
      - `check_in` (date) - Check-in date
      - `check_out` (date) - Check-out date
      - `adults` (integer) - Number of adults
      - `children` (integer) - Number of children
      - `total_price` (numeric) - Total booking price
      - `guest_name` (text) - Guest name
      - `guest_email` (text) - Guest email
      - `guest_phone` (text) - Guest phone
      - `status` (text) - booking status
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Allow public read access to studios
    - Allow public insert for bookings (for demo purposes)
*/

-- Create studios table
CREATE TABLE IF NOT EXISTS studios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price_per_night numeric NOT NULL,
  capacity integer NOT NULL DEFAULT 2,
  bedrooms integer NOT NULL DEFAULT 1,
  bathrooms integer NOT NULL DEFAULT 1,
  beds integer NOT NULL DEFAULT 1,
  amenities jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  main_image text,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id uuid REFERENCES studios(id) ON DELETE CASCADE,
  check_in date NOT NULL,
  check_out date NOT NULL,
  adults integer NOT NULL DEFAULT 1,
  children integer NOT NULL DEFAULT 0,
  total_price numeric NOT NULL,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Studios policies (public read)
CREATE POLICY "Anyone can view studios"
  ON studios FOR SELECT
  TO anon, authenticated
  USING (true);

-- Bookings policies (public can create, view their bookings)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view all bookings"
  ON bookings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert sample studios data
INSERT INTO studios (name, description, price_per_night, capacity, bedrooms, bathrooms, beds, amenities, main_image) VALUES
('Морски бриз', 'Просторно студио с изглед към морето. Включва модерна кухня, удобна баня и тераса с директен изглед към плажа.', 80, 4, 2, 1, 2, '["Машина за кафе", "Печка", "Хладилник", "Климатик", "WiFi", "Тераса"]'::jsonb, 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Слънчев рай', 'Уютно студио за двама с модерно обзавеждане и барбекю в градината.', 65, 2, 1, 1, 1, '["Барбекю", "Градина", "Машина за кафе", "Микровълнова", "WiFi"]'::jsonb, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Вила Олива', 'Луксозна вила с басейн, 3 спални и напълно оборудвана кухня.', 150, 6, 3, 2, 4, '["Басейн", "Барбекю", "Машина за кафе", "Печка", "Фурна", "Перална", "WiFi", "Паркинг"]'::jsonb, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Лазурен бряг', 'Семейно студио на 50м от плажа с голяма тераса и изглед към морето.', 90, 5, 2, 1, 3, '["Тераса", "Изглед към морето", "Климатик", "Машина за кафе", "WiFi"]'::jsonb, 'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Белият дом', 'Традиционна гръцка къща с модерни удобства и частен двор.', 75, 3, 1, 1, 2, '["Двор", "Барбекю", "Машина за кафе", "Печка", "WiFi", "Климатик"]'::jsonb, 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Къщата на рибаря', 'Автентично студио до пристанището с морска атмосфера.', 70, 3, 1, 1, 2, '["Изглед към пристанището", "Машина за кафе", "Климатик", "WiFi"]'::jsonb, 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Планинска панорама', 'Студио с изглед към планината и морето, тиха локация.', 85, 4, 2, 1, 2, '["Тераса", "Барбекю", "Машина за кафе", "Печка", "WiFi", "Паркинг"]'::jsonb, 'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Бухта на мечтите', 'Луксозен апартамент с джакузи и приватен достъп до плажа.', 180, 4, 2, 2, 2, '["Джакузи", "Приватен плаж", "Барбекю", "Машина за кафе", "Фурна", "Перална", "WiFi"]'::jsonb, 'https://images.pexels.com/photos/2227832/pexels-photo-2227832.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Тихото убежище', 'Малко уютно студио идеално за двойки, заобиколено от зеленина.', 60, 2, 1, 1, 1, '["Градина", "Машина за кафе", "Климатик", "WiFi"]'::jsonb, 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Семейно гнездо', 'Просторен апартамент с 3 спални, идеален за големи семейства.', 120, 7, 3, 2, 4, '["Перална", "Барбекю", "Машина за кафе", "Печка", "Фурна", "WiFi", "Паркинг", "Климатик"]'::jsonb, 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800');
