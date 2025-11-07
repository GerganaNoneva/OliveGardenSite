/*
  # Add guest_count and children_count columns to bookings

  1. Changes
    - Add `guest_count` column (nullable integer) - for admin-created bookings
    - Add `children_count` column (nullable integer) - for admin-created bookings
    - These columns allow flexible booking creation without requiring values
    
  2. Notes
    - Existing bookings will have NULL values for these columns
    - Admin can choose to use either adults/children OR guest_count/children_count
    - Both sets of columns can coexist for backward compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'guest_count'
  ) THEN
    ALTER TABLE bookings ADD COLUMN guest_count integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'children_count'
  ) THEN
    ALTER TABLE bookings ADD COLUMN children_count integer DEFAULT 0;
  END IF;
END $$;
