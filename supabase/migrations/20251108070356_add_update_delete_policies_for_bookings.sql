/*
  # Add UPDATE and DELETE policies for bookings table

  1. Changes
    - Add UPDATE policy to allow anyone to update bookings
    - Add DELETE policy to allow anyone to delete bookings
    - These policies are needed for the admin panel to manage booking statuses

  2. Security Notes
    - In production, these should be restricted to authenticated admin users only
    - For now, we allow updates from anon users (using the anon key) for simplicity
    - The admin panel uses the anon key to perform operations
*/

-- Allow anyone to update bookings
CREATE POLICY "Anyone can update bookings"
  ON bookings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete bookings
CREATE POLICY "Anyone can delete bookings"
  ON bookings FOR DELETE
  TO anon, authenticated
  USING (true);
