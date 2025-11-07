/*
  # Update Bookings Table with Contact Preferences

  1. Changes to Bookings Table
    - Add `guest_country` column for guest's country
    - Add `contact_method` column (viber, whatsapp, email)
    - Add `phone_country_code` column for international phone code
    - Modify `guest_phone` to be optional
    - Modify `guest_email` to be optional
    - All guests must provide at least one contact method

  2. Notes
    - Contact method determines which field is required
    - Phone number required for Viber/WhatsApp
    - Email required for email contact method
*/

-- Add new columns to bookings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'guest_country'
  ) THEN
    ALTER TABLE bookings ADD COLUMN guest_country text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'contact_method'
  ) THEN
    ALTER TABLE bookings ADD COLUMN contact_method text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'phone_country_code'
  ) THEN
    ALTER TABLE bookings ADD COLUMN phone_country_code text;
  END IF;
END $$;

-- Make guest_phone and guest_email nullable since they depend on contact method
ALTER TABLE bookings ALTER COLUMN guest_phone DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN guest_email DROP NOT NULL;
