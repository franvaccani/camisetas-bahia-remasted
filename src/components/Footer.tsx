import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#b6142c] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Camisetas Bahia</h3>
            <p className="">
              Tu tienda de confianza para camisetas de fútbol originales y retro.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>291-5322338</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>camisetasbahia@hotmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Bahía Blanca, Buenos Aires</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Síguenos</h3>
            <div className="flex max-sm:space-x-0 space-x-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="transition">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-blue-400 transition">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white text-center">
          <p>&copy; {new Date().getFullYear()} Camisetas Bahia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;