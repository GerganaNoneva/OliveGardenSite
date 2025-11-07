import { Phone, Mail, MessageCircle, Facebook } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

export default function ContactSection() {
  const { language } = useLanguage();
  const phone = '+359887870474';
  const email = 'fanynoneva@gmail.com';
  const facebookPage = 'https://www.facebook.com/profile.php?id=100063558434738';

  const handleViber = () => {
    window.open(`viber://chat?number=${phone}`, '_blank');
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${phone.replace('+', '')}`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${email}`;
  };

  const handleFacebook = () => {
    window.open(facebookPage, '_blank');
  };

  return (
    <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500 text-white py-12 px-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {t(language, 'contact.getInTouch')}
      </h2>

      <div className="max-w-4xl mx-auto">
        <p className="text-center text-lg mb-8 opacity-90">
          {t(language, 'contact.reachOut')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={handleViber}
            className="flex flex-col items-center gap-3 bg-white/10 hover:bg-white/20 p-6 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <MessageCircle size={48} className="text-purple-200" />
            <span className="font-semibold text-lg">Viber</span>
            <span className="text-sm opacity-90">{phone}</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center gap-3 bg-white/10 hover:bg-white/20 p-6 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Phone size={48} className="text-green-200" />
            <span className="font-semibold text-lg">WhatsApp</span>
            <span className="text-sm opacity-90">{phone}</span>
          </button>

          <button
            onClick={handleEmail}
            className="flex flex-col items-center gap-3 bg-white/10 hover:bg-white/20 p-6 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Mail size={48} className="text-blue-200" />
            <span className="font-semibold text-lg">Email</span>
            <span className="text-sm opacity-90">{email}</span>
          </button>

          <button
            onClick={handleFacebook}
            className="flex flex-col items-center gap-3 bg-white/10 hover:bg-white/20 p-6 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Facebook size={48} className="text-blue-300" />
            <span className="font-semibold text-lg">Facebook</span>
            <span className="text-sm opacity-90">Visit Page</span>
          </button>
        </div>
      </div>
    </div>
  );
}
