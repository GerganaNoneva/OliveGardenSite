import { useState } from 'react';
import Hero from '../components/Hero';
import ImageGallery from '../components/ImageGallery';
import ContactSection from '../components/ContactSection';
import HouseSection from '../components/HouseSection';
import LanguageSelector from '../components/LanguageSelector';
import SearchBar from '../components/SearchBar';
import { useLanguage } from '../contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { SearchParams } from '../types';

const mainImages = [
  'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2507007/pexels-photo-2507007.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const house1Images = [
  'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const house2Images = [
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/584399/pexels-photo-584399.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export default function HomePage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    checkIn: null,
    checkOut: null,
    adults: null,
    children: null,
  });

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchParams.checkIn) {
      const year = searchParams.checkIn.getFullYear();
      const month = String(searchParams.checkIn.getMonth() + 1).padStart(2, '0');
      const day = String(searchParams.checkIn.getDate()).padStart(2, '0');
      queryParams.set('checkIn', `${year}-${month}-${day}`);
    }
    if (searchParams.checkOut) {
      const year = searchParams.checkOut.getFullYear();
      const month = String(searchParams.checkOut.getMonth() + 1).padStart(2, '0');
      const day = String(searchParams.checkOut.getDate()).padStart(2, '0');
      queryParams.set('checkOut', `${year}-${month}-${day}`);
    }
    if (searchParams.adults) {
      queryParams.set('adults', searchParams.adults.toString());
    }
    if (searchParams.children) {
      queryParams.set('children', searchParams.children.toString());
    }
    navigate(`/studios?${queryParams.toString()}`);
  };

  const introText = {
    bg: `Добре дошли в Olive Garden – вашият оазис на спокойствие в сърцето на Ситония!
Сред маслинови дървета и нежния полъх на Егейско море ви очакват две уютни къщи, създадени за пълна почивка. Насладете се на утринното кафе на терасата, ароматите на природата, златния пясък и сините вълни, които са само на няколко минути пеша.

Вечерите тук са специални – прохладни, изпълнени със смях, вкус на гръцко вино и дълги разговори под звездите.

Olive Garden е идеалното място за семейства, двойки и приятели, които търсят комфорт, релакс и истинска лятна хармония.`,
    en: `Welcome to our cozy studios in Greece!

We offer 11 comfortable studios located in two houses in a quiet and peaceful place, perfect for your vacation.

Each studio is furnished with everything you need and offers modern amenities. The beach is 7 minutes walk away, and there is a beautiful walking path by the sea nearby.

Enjoy the peace and relaxation, away from the city noise!`,
    ru: `Добро пожаловать в наши уютные студии в Греции!

Мы предлагаем 11 комфортных студий, расположенных в двух домах в тихом и спокойном месте, идеально подходящем для вашего отдыха.

Каждая студия оборудована всем необходимым и предлагает современные удобства. Пляж находится в 7 минутах ходьбы, а рядом есть красивая прогулочная дорожка вдоль моря.

Наслаждайтесь тишиной и расслаблением вдали от городского шума!`,
    sr: `Добродошли у наше удобне студије у Грчкој!

Нудимо 11 удобних студија смештених у две куће на мирном и тихом месту, савршеном за ваш одмор.

Сваки студио је опремљен свим што вам треба и нуди модерне погодности. Плажа је удаљена 7 минута хода, а у близини постоји лепа шетна стаза поред мора.

Уживајте у миру и опуштању, далеко од градске буке!`,
    el: `Καλώς ήρθατε στα άνετα στούντιό μας στην Ελλάδα!

Προσφέρουμε 11 άνετα στούντιο που βρίσκονται σε δύο σπίτια σε ένα ήσυχο και γαλήνιο μέρος, ιδανικό για τις διακοπές σας.

Κάθε στούντιο είναι επιπλωμένο με όλα όσα χρειάζεστε και προσφέρει σύγχρονες ανέσεις. Η παραλία απέχει 7 λεπτά με τα πόδια και υπάρχει ένα όμορφο μονοπάτι για περπάτημα δίπλα στη θάλασσα.

Απολαύστε την ηρεμία και τη χαλάρωση, μακριά από τον θόρυβο της πόλης!`,
    ro: `Bine ați venit la studiourile noastre confortabile din Grecia!

Oferim 11 studiouri confortabile situate în două case într-un loc liniștit și pașnic, perfect pentru vacanța dvs.

Fiecare studio este mobilat cu tot ce aveți nevoie și oferă facilități moderne. Plaja este la 7 minute de mers pe jos, iar în apropiere există o potecă frumoasă pentru plimbare lângă mare.

Bucurați-vă de liniște și relaxare, departe de zgomotul orașului!`,
    mk: `Добредојдовте во Olive Garden – вашата оаза на спокојство во срцето на Ситонија!
Меѓу маслинови дрвја и нежниот здив на Егејско Море ве очекуваат две удобни куќи, создадени за целосна почивка. Уживајте во утринското кафе на терасата, ароматите на природата, златниот песок и сините бранови, кои се само на неколку минути пешка.

Вечерите тука се посебни – прохладни, исполнети со смеа, вкус на грчко вино и долги разговори под ѕвездите.

Olive Garden е идеалното место за семејства, парови и пријатели, кои бараат комфор, релаксација и вистинска летна хармонија.`,
  };

  const house1Text = {
    bg: `🏡 Olive Garden Apartments

Семейно удобство и морско вдъхновение

Olive Garden Apartments предлага 2 просторни апартамента (до 6 души) и 4 комфортни студиа (до 4 души), всяко обзаведено с внимание към детайла и модерни удобства.

Тук ще откриете всичко необходимо за вашия престой – напълно оборудвана кухня, климатик, Wi-Fi, уютни спални и тераси с гледка към градината.

В дворa има детски кът и паркинг, а плажът е само на няколко минути разходка.

Тишина, простор и усещане за дом – това е Olive Garden Apartments.`,
    en: `House 1 has 6 studios, each carefully furnished and equipped with modern amenities. The studios offer comfortable living space, with fully equipped kitchens, cozy bedrooms and balconies overlooking the garden.

The beach is 7 minutes walk away, but the peace and quiet make this place perfect for relaxation. Nearby there is a scenic walking path along the sea.`,
    ru: `Дом 1 располагает 6 студиями, каждая из которых тщательно обставлена и оборудована современными удобствами. Студии предлагают комфортное пространство для проживания, с полностью оборудованными кухнями, уютными спальнями и балконами с видом на сад.

Пляж находится в 7 минутах ходьбы, но тишина и покой делают это место идеальным для расслабления. Рядом есть живописная прогулочная дорожка вдоль моря.`,
    sr: `Кућа 1 има 6 студија, сваки пажљиво намештен и опремљен модерним погодностима. Студији нуде удобан простор за живот, са потпуно опремљеним кухињама, уютним спаваћим собама и балконима са погледом на башту.

Плажа је удаљена 7 минута хода, али мир и тишина чине ово место савршеним за опуштање. У близини постоји сликовита шетна стаза поред мора.`,
    el: `Το Σπίτι 1 διαθέτει 6 στούντιο, καθένα από τα οποία είναι προσεκτικά επιπλωμένο και εξοπλισμένο με σύγχρονες ανέσεις. Τα στούντιο προσφέρουν άνετο χώρο διαμονής, με πλήρως εξοπλισμένες κουζίνες, άνετα υπνοδωμάτια και μπαλκόνια με θέα στον κήπο.

Η παραλία απέχει 7 λεπτά με τα πόδια, αλλά η ηρεμία και η γαλήνη κάνουν αυτό το μέρος ιδανικό για χαλάρωση. Κοντά υπάρχει ένα γραφικό μονοπάτι για περπάτημα κατά μήκος της θάλασσας.`,
    ro: `Casa 1 are 6 studiouri, fiecare mobilat cu grijă și echipat cu facilități moderne. Studiourile oferă spațiu confortabil de locuit, cu bucătării complet echipate, dormitoare confortabile și balcoane cu vedere la grădină.

Plaja este la 7 minute de mers pe jos, dar liniștea și pacea fac acest loc perfect pentru relaxare. În apropiere există o potecă pitorească de plimbare pe lângă mare.`,
    mk: `🏡 Olive Garden Apartments

Семејна погодност и морска инспирација

Olive Garden Apartments нуди 2 пространи апартмани (до 6 лица) и 4 комфорни студија (до 4 лица), секое наместено со внимание кон деталот и современи погодности.

Тука ќе откриете се потребно за вашиот престој – целосно опремена кујна, клима, Wi-Fi, удобни спални и тераси со поглед кон градината.

Во дворот има детско игралиште и паркинг, а плажата е само на неколку минути пешка.

Тишина, простор и чувство на дом – тоа е Olive Garden Apartments.`,
  };

  const house2Text = {
    bg: `🌿 Olive Garden Guesthouse

Простор, уют и време за споделени моменти

Olive Garden Guesthouse е перфектен избор за големи семейства или компании до 14 души.

Къщата разполага с 2 мезонета, 3 двойни стаи с бани и общи зони, които създават усещане за топлина и близост. Всяко помещение е стилно обзаведено и оборудвано с всичко необходимо за безгрижна ваканция.

Прекарвайте следобедите в сенчестата градина, а вечер – край масата с чаша вино и приятна компания.

Наоколо ще откриете живописни плажове и малки крайбрежни таверни, където времето сяCaаш спира.`,
    en: `House 2 offers 5 studios with even more space and comfort. Each studio has modern amenities, spacious rooms and balconies from which you can enjoy the peaceful surroundings.

The beach is 7 minutes walk away, but the peace and quiet make this place perfect for relaxation. Nearby there is a scenic walking path along the sea.`,
    ru: `Дом 2 предлагает 5 студий с еще большим пространством и комфортом. Каждая студия имеет современные удобства, просторные комнаты и балконы, с которых можно наслаждаться тихой обстановкой.

Пляж находится в 7 минутах ходьбы, но тишина и покой делают это место идеальным для расслабления. Рядом есть живописная прогулочная дорожка вдоль моря.`,
    sr: `Кућа 2 нуди 5 студија са још више простора и удобности. Сваки студио има модерне погодности, простране собе и балконе са којих можете уживати у мирном окружењу.

Плажа је удаљена 7 минута хода, али мир и тишина чине ово место савршеним за опуштање. У близини постоји сликовита шетна стаза поред мора.`,
    el: `Το Σπίτι 2 προσφέρει 5 στούντιο με ακόμη περισσότερο χώρο και άνεση. Κάθε στούντιο διαθέτει σύγχρονες ανέσεις, ευρύχωρα δωμάτια και μπαλκόνια από τα οποία μπορείτε να απολαύσετε το ήσυχο περιβάλλον.

Η παραλία απέχει 7 λεπτά με τα πόδια, αλλά η ηρεμία και η γαλήνη κάνουν αυτό το μέρος ιδανικό για χαλάρωση. Κοντά υπάρχει ένα γραφικό μονοπάτι για περπάτημα κατά μήκος της θάλασσας.`,
    ro: `Casa 2 oferă 5 studiouri cu și mai mult spațiu și confort. Fiecare studio are facilități moderne, camere spațioase și balcoane de unde puteți admira împrejurimile liniștite.

Plaja este la 7 minute de mers pe jos, dar liniștea și pacea fac acest loc perfect pentru relaxare. În apropiere există o potecă pitorească de plimbare pe lângă mare.`,
    mk: `🌿 Olive Garden Guesthouse

Простор, удобност и време за заеднички моменти

Olive Garden Guesthouse е перфектен избор за големи семејства или групи до 14 лица.

Куќата располага со 2 мезонети, 3 двојни соби со бањи и заеднички простории, кои создаваат чувство на топлина и блискост. Секој простор е стилски наместен и опремен со се потребно за безгрижна ваканција.

Поминувајте ги попладните во сенкеста градина, а навечер – крај масата со чаша вино и пријатно друштво.

Наоколу ќе откриете живописни плажи и мали крајбрежни таверни, каде што времето како да застанува.`,
  };

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4 z-40">
        <LanguageSelector />
      </div>

      <Hero />

      <SearchBar
        searchParams={searchParams}
        onSearchChange={setSearchParams}
        onSearch={handleSearch}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-16">
          <div className="float-left mr-8 mb-6 w-full lg:w-2/5">
            <ImageGallery images={mainImages} />
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {introText[language]}
            </p>
          </div>
          <div className="clear-both"></div>
        </div>

        <div className="flex justify-center mb-16">
          <Link
            to="/studios"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500 hover:from-cyan-600 hover:via-teal-600 hover:to-blue-600 text-white font-bold text-2xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <span>
              {language === 'bg' && 'Виж нашите предложения'}
              {language === 'en' && 'View Our Studios'}
              {language === 'ru' && 'Посмотрите наши студии'}
              {language === 'sr' && 'Погледајте наше студије'}
              {language === 'el' && 'Δείτε τα στούντιό μας'}
              {language === 'ro' && 'Vezi studiourile noastre'}
              {language === 'mk' && 'Погледнете ги нашите понуди'}
            </span>
          </Link>
        </div>

        <div className="mb-16">
          <ContactSection />
        </div>

        <div id="studios" className="mb-16">
          <HouseSection
            houseNumber={1}
            images={house1Images}
            description={house1Text[language]}
            mapUrl="https://maps.app.goo.gl/SnQ9cz1ADxV5jt7E8"
          />
        </div>

        <div className="mb-16">
          <HouseSection
            houseNumber={2}
            images={house2Images}
            description={house2Text[language]}
            mapUrl="https://maps.app.goo.gl/pg4KbXXuL4tMr44j6"
          />
        </div>
      </div>
    </div>
  );
}
