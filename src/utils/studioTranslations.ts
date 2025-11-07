import { Studio } from '../types';
import { Language } from '../contexts/LanguageContext';

export function getStudioName(studio: Studio, language: Language): string {
  switch (language) {
    case 'en':
      return studio.name_en || studio.name;
    case 'ru':
      return studio.name_ru || studio.name;
    case 'sr':
      return studio.name_sr || studio.name;
    case 'el':
      return studio.name_el || studio.name;
    case 'ro':
      return studio.name_ro || studio.name;
    default:
      return studio.name;
  }
}

export function getStudioDescription(studio: Studio, language: Language): string {
  switch (language) {
    case 'en':
      return studio.description_en || studio.description;
    case 'ru':
      return studio.description_ru || studio.description;
    case 'sr':
      return studio.description_sr || studio.description;
    case 'el':
      return studio.description_el || studio.description;
    case 'ro':
      return studio.description_ro || studio.description;
    default:
      return studio.description;
  }
}
