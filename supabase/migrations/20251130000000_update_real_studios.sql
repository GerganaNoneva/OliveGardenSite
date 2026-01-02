-- Update studios with real data from olivegardenholiday.com
-- Clear existing data
DELETE FROM bookings;
DELETE FROM studios;

-- Insert Апартамент №1
INSERT INTO studios (name, description, price_per_night, capacity, bedrooms, bathrooms, beds, amenities, images, main_image, low_season_discount, high_season_markup) VALUES
('Апартамент №1', 'Напълно оборудван апартамент на две нива с модерна кухня, спираловидно стълбище и три спални. Разполага с две бани, всекидневна с разтегателен диван и капацитет до 8 човека.', 150, 8, 3, 2, 4, '["Климатик", "WiFi", "Кухня", "Пералня", "Съдомиялна", "Барбекю", "Паркинг", "Тераса", "Кафе машина", "Хладилник", "Фурна", "Котлон"]'::jsonb, '["/images/apartment1/main.JPG", "/images/apartment1/spiral-kitchen.JPG", "/images/apartment1/bedroom1.JPG", "/images/apartment1/bedroom2.JPG", "/images/apartment1/bedroom3.JPG", "/images/apartment1/bathroom.JPG"]'::jsonb, '/images/apartment1/main.JPG', 0, 50),

-- Insert Студио №2
('Студио №2', 'Уютно напълно обзаведено студио с 2 двойни спални и разтеглателен диван, който спокойно побира до 6 човека.', 100, 6, 2, 1, 3, '["Градина", "Печка", "Кафе машина", "Перална", "Съдомиялна", "Паркинг", "Барбекю", "Котлон", "Електрическа кана", "Сушилня", "WiFi"]'::jsonb, '["/images/studio2/main.jpg"]'::jsonb, '/images/studio2/main.jpg', 0, 20),

-- Insert Студио №3
('Студио №3', 'Уютно напълно обзаведено студио с 2 двойни спални, който спокойно побира до 4 човека.', 100, 4, 2, 1, 2, '["Градина", "Печка", "Кафе машина", "Перална", "Паркинг", "Барбекю", "Котлон", "Електрическа кана", "WiFi"]'::jsonb, '["/images/studio3/main.jpg"]'::jsonb, '/images/studio3/main.jpg', 0, 20),

-- Insert Апартамент №4
('Апартамент №4', 'Напълно оборудван апартамент с 2 стаи с двойни легла и още едно двойна спалня. Също така има и разтеглателен диван и побира до 8 човека.', 150, 8, 3, 2, 4, '["Градина", "Печка", "Кафе машина", "Перална", "Паркинг", "Барбекю", "Котлон", "Електрическа кана", "WiFi"]'::jsonb, '["/images/apartment4/main.jpg"]'::jsonb, '/images/apartment4/main.jpg', 0, 50),

-- Insert Студио №5
('Студио №5', 'Уютно студио с 2 двойни спални без кухня, който спокойно побира до 4 човека.', 80, 4, 2, 1, 2, '["Градина", "Тостер", "Кафе машина", "WiFi", "Барбекю", "Хладилник", "Електрическа кана", "Паркинг"]'::jsonb, '["/images/studio5/main.jpg"]'::jsonb, '/images/studio5/main.jpg', 0, 20),

-- Insert Студио №6
('Студио №6', 'Тройна стая с баня без кухня, който спокойно побира до 3 човека.', 60, 3, 1, 1, 2, '["Градина", "Тостер", "Кафе машина", "WiFi", "Барбекю", "Хладилник", "Електрическа кана", "Паркинг"]'::jsonb, '["/images/studio6/main.jpg"]'::jsonb, '/images/studio6/main.jpg', 0, 10),

-- Insert Olive Garden Guesthouse (цялата къща)
('Olive Garden Guesthouse', 'Уютна къща с 2 напълно обзаведени апартамента тип мезонет с 2 спални и разтеглателен диван, както и 3 двойни стаи с бани, които побира до 12 човека.', 450, 18, 7, 5, 9, '["Барбекю", "WiFi", "Котлон", "Електрическа кана", "Тераси", "Паркинг", "Печка", "Кафе машина", "Перално помещение", "Сешоар"]'::jsonb, '["/images/guesthouse/main.jpg"]'::jsonb, '/images/guesthouse/main.jpg', 0, 50);
