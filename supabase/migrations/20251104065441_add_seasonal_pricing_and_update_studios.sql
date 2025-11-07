/*
  # Add Seasonal Pricing and Update Studios

  1. Changes to Studios Table
    - Add `base_price` column (base price for calculation)
    - Add `low_season_discount` column (20 EUR discount)
    - Add `high_season_markup` column (20 EUR markup)
    - Update existing studios with new capacity configurations:
      - 5 large studios: 2 bedrooms, 2 bathrooms, 4 adults + 1 child capacity
      - 3 small studios: 1 bedroom, 1 bathroom, 2-3 adults capacity
      - 2 family studios: 3 bedrooms, 2 bathrooms, 6 adults + 2 children capacity

  2. Seasonal Pricing Rules
    - Low Season 1: May 1 - June 15 (base price - 20 EUR)
    - High Season: June 16 - August 15 (base price + 20 EUR)
    - Low Season 2: August 16 - September 30 (base price - 20 EUR)
    - Regular Season: Rest of the year (base price)

  3. Notes
    - The price_per_night column will represent the base price
    - Frontend will calculate actual price based on selected dates
*/

-- Add new columns for seasonal pricing (if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'studios' AND column_name = 'low_season_discount'
  ) THEN
    ALTER TABLE studios ADD COLUMN low_season_discount numeric DEFAULT 20;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'studios' AND column_name = 'high_season_markup'
  ) THEN
    ALTER TABLE studios ADD COLUMN high_season_markup numeric DEFAULT 20;
  END IF;
END $$;

-- Clear existing data
DELETE FROM bookings;
DELETE FROM studios;

-- Insert 5 Large Studios (2 bedrooms, 2 bathrooms, 4 adults + 1 child)
INSERT INTO studios (name, description, price_per_night, capacity, bedrooms, bathrooms, beds, amenities, main_image, low_season_discount, high_season_markup) VALUES
('Морски бриз Делукс', 'Просторен апартамент с две спални и изглед към морето. Включва модерна кухня, две бани и голяма тераса с директен изглед към плажа. Идеален за семейства.', 100, 5, 2, 2, 3, '["Машина за кафе", "Печка", "Хладилник", "Климатик", "WiFi", "Тераса", "Изглед към морето", "Перална"]'::jsonb, 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=800', 20, 20),
('Слънчев залез', 'Модерен апартамент с две спални и два санитарни възела. Разполага с барбекю в градината и напълно оборудвана кухня.', 95, 5, 2, 2, 3, '["Барбекю", "Градина", "Машина за кафе", "Печка", "Фурна", "WiFi", "Климатик", "Паркинг"]'::jsonb, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 20, 20),
('Лазурен бряг Плюс', 'Семеен апартамент на 50м от плажа с две спални, две бани и голяма тераса с изглед към морето. Напълно оборудван.', 105, 5, 2, 2, 3, '["Тераса", "Изглед към морето", "Климатик", "Машина за кафе", "WiFi", "Печка", "Перална"]'::jsonb, 'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800', 20, 20),
('Бяла перла', 'Луксозен апартамент с две спални и модерни удобства. Включва частен двор с барбекю и паркинг.', 98, 5, 2, 2, 3, '["Двор", "Барбекю", "Машина за кафе", "Печка", "WiFi", "Климатик", "Паркинг", "Фурна"]'::jsonb, 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800', 20, 20),
('Планинска панорама', 'Просторен апартамент с изглед към планината и морето. Две спални, две бани, тиха локация с барбекю.', 92, 5, 2, 2, 3, '["Тераса", "Барбекю", "Машина за кафе", "Печка", "WiFi", "Паркинг", "Климатик", "Изглед към планината"]'::jsonb, 'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&w=800', 20, 20),

-- Insert 3 Small Studios (1 bedroom, 1 bathroom, 2-3 adults)
('Уютно гнездо', 'Малко уютно студио с една спалня, идеално за двойки. Включва всички необходими удобства.', 60, 2, 1, 1, 1, '["Машина за кафе", "Климатик", "WiFi", "Хладилник", "Микровълнова"]'::jsonb, 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800', 20, 20),
('Тихото убежище', 'Малко студио заобиколено от зеленина. Перфектно за романтична почивка.', 55, 2, 1, 1, 1, '["Градина", "Машина за кафе", "Климатик", "WiFi"]'::jsonb, 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=800', 20, 20),
('Къщата на рибаря', 'Автентично студио до пристанището с морска атмосфера. Една спалня и модерни удобства.', 65, 3, 1, 1, 1, '["Изглед към пристанището", "Машина за кафе", "Климатик", "WiFi", "Тераса"]'::jsonb, 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800', 20, 20),

-- Insert 2 Family Studios (3 bedrooms, 2 bathrooms, 6 adults + 2 children)
('Вила Олива', 'Луксозна семейна вила с три спални и две бани. Включва басейн, барбекю и напълно оборудвана кухня. Идеална за големи семейства.', 150, 8, 3, 2, 5, '["Басейн", "Барбекю", "Машина за кафе", "Печка", "Фурна", "Перална", "WiFi", "Паркинг", "Климатик", "Градина"]'::jsonb, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 20, 20),
('Семейно гнездо', 'Просторен семеен апартамент с три спални и две бани. Разполага с голяма тераса, барбекю и всички удобства за перфектна семейна почивка.', 140, 8, 3, 2, 5, '["Перална", "Барбекю", "Машина за кафе", "Печка", "Фурна", "WiFi", "Паркинг", "Климатик", "Тераса", "Градина"]'::jsonb, 'https://images.pexels.com/photos/2227832/pexels-photo-2227832.jpeg?auto=compress&cs=tinysrgb&w=800', 20, 20);
