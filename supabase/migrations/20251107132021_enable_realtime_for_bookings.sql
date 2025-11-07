/*
  # Enable Realtime for bookings table

  1. Changes
    - Enable Realtime broadcasts for the bookings table
    - This allows clients to subscribe to INSERT, UPDATE, and DELETE events

  2. Notes
    - This is required for real-time synchronization in the admin panel
    - Without this, the realtime subscription will not receive any events
*/

-- Enable realtime for bookings table
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
