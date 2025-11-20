import { Studio } from '../types';

export const calculateSeasonalPrice = (studio: Studio, date: Date): number => {
  const month = date.getMonth() + 1;

  // Висок сезон: юли и август
  if (month === 7 || month === 8) {
    return studio.price_per_night + studio.high_season_markup;
  }

  // Силен сезон: 1 май - 30 юни, 1 септ - 30 септ
  if (
    (month === 5) ||
    (month === 6) ||
    (month === 9)
  ) {
    return studio.price_per_night - studio.low_season_discount;
  }

  return studio.price_per_night;
};

export const calculateTotalPrice = (
  studio: Studio,
  checkIn: Date,
  checkOut: Date
): number => {
  let total = 0;
  const currentDate = new Date(checkIn);

  while (currentDate < checkOut) {
    total += calculateSeasonalPrice(studio, currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return total;
};

export const getSeasonName = (date: Date): string => {
  const month = date.getMonth() + 1;

  // Висок сезон: юли и август
  if (month === 7 || month === 8) {
    return 'Висок сезон (юли - август)';
  }

  // Силен сезон: 1 май - 30 юни, 1 септ - 30 септ
  if (month === 5 || month === 6 || month === 9) {
    return 'Силен сезон (май - юни, септември)';
  }

  return 'Обикновен сезон';
};
