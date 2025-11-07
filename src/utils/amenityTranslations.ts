import { Language } from '../contexts/LanguageContext';

const amenityTranslations: Record<string, Record<Language, string>> = {
  'Машина за кафе': {
    bg: 'Машина за кафе',
    en: 'Coffee machine',
    ru: 'Кофемашина',
    sr: 'Апарат за кафу',
    el: 'Μηχανή καφέ',
    ro: 'Mașină de cafea'
  },
  'Печка': {
    bg: 'Печка',
    en: 'Stove',
    ru: 'Плита',
    sr: 'Шпорет',
    el: 'Κουζίνα',
    ro: 'Aragaz'
  },
  'Хладилник': {
    bg: 'Хладилник',
    en: 'Refrigerator',
    ru: 'Холодильник',
    sr: 'Фрижидер',
    el: 'Ψυγείο',
    ro: 'Frigider'
  },
  'Климатик': {
    bg: 'Климатик',
    en: 'Air conditioning',
    ru: 'Кондиционер',
    sr: 'Клима уређај',
    el: 'Κλιματισμός',
    ro: 'Aer condiționat'
  },
  'WiFi': {
    bg: 'WiFi',
    en: 'WiFi',
    ru: 'WiFi',
    sr: 'WiFi',
    el: 'WiFi',
    ro: 'WiFi'
  },
  'Тераса': {
    bg: 'Тераса',
    en: 'Terrace',
    ru: 'Терраса',
    sr: 'Тераса',
    el: 'Βεράντα',
    ro: 'Terasă'
  },
  'Изглед към морето': {
    bg: 'Изглед към морето',
    en: 'Sea view',
    ru: 'Вид на море',
    sr: 'Поглед на море',
    el: 'Θέα στη θάλασσα',
    ro: 'Vedere la mare'
  },
  'Перална': {
    bg: 'Перална',
    en: 'Washing machine',
    ru: 'Стиральная машина',
    sr: 'Машина за прање веша',
    el: 'Πλυντήριο',
    ro: 'Mașină de spălat'
  },
  'Барбекю': {
    bg: 'Барбекю',
    en: 'BBQ',
    ru: 'Барбекю',
    sr: 'Роштиљ',
    el: 'Μπάρμπεκιου',
    ro: 'Grătar'
  },
  'Градина': {
    bg: 'Градина',
    en: 'Garden',
    ru: 'Сад',
    sr: 'Башта',
    el: 'Κήπος',
    ro: 'Grădină'
  },
  'Паркинг': {
    bg: 'Паркинг',
    en: 'Parking',
    ru: 'Парковка',
    sr: 'Паркинг',
    el: 'Χώρος στάθμευσης',
    ro: 'Parcare'
  },
  'Телевизор': {
    bg: 'Телевизор',
    en: 'TV',
    ru: 'Телевизор',
    sr: 'Телевизор',
    el: 'Τηλεόραση',
    ro: 'Televizor'
  },
  'Микровълнова': {
    bg: 'Микровълнова',
    en: 'Microwave',
    ru: 'Микроволновая печь',
    sr: 'Микроталасна',
    el: 'Φούρνος μικροκυμάτων',
    ro: 'Cuptor cu microunde'
  },
  'Тостер': {
    bg: 'Тостер',
    en: 'Toaster',
    ru: 'Тостер',
    sr: 'Тостер',
    el: 'Τοστιέρα',
    ro: 'Prăjitor de pâine'
  },
  'Сешоар': {
    bg: 'Сешоар',
    en: 'Hair dryer',
    ru: 'Фен',
    sr: 'Фен',
    el: 'Σεσουάρ',
    ro: 'Uscător de păr'
  },
  'Ютия': {
    bg: 'Ютия',
    en: 'Iron',
    ru: 'Утюг',
    sr: 'Пегла',
    el: 'Σίδερο',
    ro: 'Fier de călcat'
  },
  'Камина': {
    bg: 'Камина',
    en: 'Fireplace',
    ru: 'Камин',
    sr: 'Камин',
    el: 'Τζάκι',
    ro: 'Șemineu'
  },
  'Басейн': {
    bg: 'Басейн',
    en: 'Pool',
    ru: 'Бассейн',
    sr: 'Базен',
    el: 'Πισίνα',
    ro: 'Piscină'
  },
  'Детска площадка': {
    bg: 'Детска площадка',
    en: 'Playground',
    ru: 'Детская площадка',
    sr: 'Дечије игралиште',
    el: 'Παιδική χαρά',
    ro: 'Loc de joacă pentru copii'
  },
  'Балкон': {
    bg: 'Балкон',
    en: 'Balcony',
    ru: 'Балкон',
    sr: 'Балкон',
    el: 'Μπαλκόνι',
    ro: 'Balcon'
  },
  'Изглед към планината': {
    bg: 'Изглед към планината',
    en: 'Mountain view',
    ru: 'Вид на горы',
    sr: 'Поглед на планине',
    el: 'Θέα στο βουνό',
    ro: 'Vedere la munte'
  }
};

export function translateAmenity(amenity: string, language: Language): string {
  return amenityTranslations[amenity]?.[language] || amenity;
}
