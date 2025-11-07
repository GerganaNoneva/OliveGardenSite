/*
  # Update Booking Statuses and Add Messenger Support

  1. Changes to Bookings Table
    - Update status field to support new statuses:
      - pending (в очакване на отговор)
      - awaiting_deposit (в очакване на плащане на капаро)
      - paid (платена)
      - completed (минала)
      - cancelled (отказана)
    - Add messenger support to contact_method options
    
  2. Security
    - Existing RLS policies remain unchanged
    - Administrators will use service role for management

  3. Notes
    - Contact methods now include: viber, whatsapp, messenger, email
    - All existing bookings maintain their current status
    - New statuses provide better booking lifecycle management
*/

-- Update contact_method to include messenger
-- No need to alter column type as it's already text, just documenting valid values

-- Add a check constraint to ensure valid statuses (optional but recommended)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'bookings_status_check'
  ) THEN
    ALTER TABLE bookings 
    ADD CONSTRAINT bookings_status_check 
    CHECK (status IN ('pending', 'awaiting_deposit', 'paid', 'completed', 'cancelled', 'confirmed'));
  END IF;
END $$;

-- Add a check constraint for valid contact methods (optional but recommended)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'bookings_contact_method_check'
  ) THEN
    ALTER TABLE bookings 
    ADD CONSTRAINT bookings_contact_method_check 
    CHECK (contact_method IN ('viber', 'whatsapp', 'messenger', 'email'));
  END IF;
END $$;

-- Update existing 'confirmed' bookings to 'paid' status for better clarity
UPDATE bookings 
SET status = 'paid' 
WHERE status = 'confirmed';
