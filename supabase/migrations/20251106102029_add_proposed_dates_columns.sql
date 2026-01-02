/*
  # Добавяне на колони за предложени дати

  1. Промени
    - Добавя `proposed_check_in` колона за предложена дата на настаняване
    - Добавя `proposed_check_out` колона за предложена дата на напускане  
    - Добавя `proposed_studio_id` колона за предложено студио
    
  2. Обяснение
    - Тези колони се използват когато администраторът предложи алтернативни дати или студио
    - Когато резервацията се потвърди, предложените дати стават основни дати
*/

-- Добавяме колони за предложени дати (ако не съществуват)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'proposed_check_in'
  ) THEN
    ALTER TABLE bookings ADD COLUMN proposed_check_in date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'proposed_check_out'
  ) THEN
    ALTER TABLE bookings ADD COLUMN proposed_check_out date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'proposed_studio_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN proposed_studio_id uuid REFERENCES studios(id);
  END IF;
END $$;
