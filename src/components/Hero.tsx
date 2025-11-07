import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

export default function Hero() {
  const { language } = useLanguage();

  return (
    <div className="relative h-96 w-full overflow-hidden">
      <img
        src="https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920"
        alt="Greek beach"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/40 via-teal-900/30 to-blue-900/20 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
            {t(language, 'hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-lg">
            {t(language, 'hero.subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
}
