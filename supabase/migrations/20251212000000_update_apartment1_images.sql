-- Update Apartment 1 with local images
UPDATE studios
SET
  images = '["/images/apartment1/main.JPG", "/images/apartment1/spiral-kitchen.JPG", "/images/apartment1/bedroom1.JPG", "/images/apartment1/bedroom2.JPG", "/images/apartment1/bedroom3.JPG", "/images/apartment1/bathroom.JPG"]'::jsonb,
  main_image = '/images/apartment1/main.JPG'
WHERE name = 'Апартамент №1';
