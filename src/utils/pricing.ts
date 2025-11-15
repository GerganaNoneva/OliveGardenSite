import { Studio } from '../types';

export const calculateSeasonalPrice = (studio: Studio, date: Date): number => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Нисък сезон: 1 май - 15 юни, 10 септ - 30 септ
  if (
    (month === 5 && day >= 1) ||
    (month === 6 && day <= 15) ||
    (month === 9 && day >= 10 && day <= 30)
  ) {
    return studio.price_per_night - studio.low_season_discount;
  }

  // Висок сезон: 16 юни - 31 август
  if (
    (month === 6 && day >= 16) ||
    (month === 7) ||
    (month === 8)
  ) {
    return studio.price_per_night + studio.high_season_markup;
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
  const day = date.getDate();

  // Нисък сезон: 1 май - 15 юни, 10 септ - 30 септ
  if (
    (month === 5 && day >= 1) ||
    (month === 6 && day <= 15) ||
    (month === 9 && day >= 10 && day <= 30)
  ) {
    return 'Нисък сезон (1 май - 15 юни, 10 септ - 30 септ)';
  }

  // Висок сезон: 16 юни - 31 август
  if (
    (month === 6 && day >= 16) ||
    (month === 7) ||
    (month === 8)
  ) {
    return 'Висок сезон (16 юни - 31 август)';
  }

  return 'Обикновен сезон';
};
