import { Studio } from '../types';

export const calculateSeasonalPrice = (studio: Studio, date: Date): number => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 5 && day >= 1) || (month === 6 && day <= 15)) {
    return studio.price_per_night - studio.low_season_discount;
  }

  if (
    (month === 6 && day >= 16) ||
    (month === 7) ||
    (month === 8 && day <= 15)
  ) {
    return studio.price_per_night + studio.high_season_markup;
  }

  if (
    (month === 8 && day >= 16) ||
    (month === 9 && day <= 30)
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
  const day = date.getDate();

  if ((month === 5 && day >= 1) || (month === 6 && day <= 15)) {
    return 'Нисък сезон (1 май - 15 юни)';
  }

  if (
    (month === 6 && day >= 16) ||
    (month === 7) ||
    (month === 8 && day <= 15)
  ) {
    return 'Висок сезон (16 юни - 15 август)';
  }

  if (
    (month === 8 && day >= 16) ||
    (month === 9 && day <= 30)
  ) {
    return 'Нисък сезон (16 август - 30 септември)';
  }

  return 'Обикновен сезон';
};
