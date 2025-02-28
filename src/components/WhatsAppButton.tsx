import whatsapp from '../assets/whatsapp.png';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/5492911234567"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full shadow-lg transition-colors z-50"
      aria-label="Contactar por WhatsApp"
    >
<img className="w-8 m-3 transition-colors z-50" src={whatsapp} alt="" />    </a>
  );
};

export default WhatsAppButton;  