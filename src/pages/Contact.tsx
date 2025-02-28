
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import ScrollAnimation from '../components/ScrollAnimation';

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fade-up">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contacto</h1>
            <p className="text-xl text-gray-600">
              Estamos para ayudarte. Contáctanos por cualquiera de estos medios.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <ScrollAnimation animation="slide-in-left">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-200 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Teléfono</p>
                    <p className="text-gray-600">291-5322338</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-gray-200 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">camisetasbahia@hotmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-gray-200 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dirección</p>
                    <p className="text-gray-600">Zapiola 123 - Camisetas Bahia (Local 3)</p>
                    <p className="text-gray-600">Zapiola 123 - Fan Store (Local 2)</p>
                    <p className="text-gray-600">Zapiola 148 - Camisetas Bahia Basquet</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-gray-200 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Horario de Atención</p>
                    <p className="text-gray-600">Lunes a Sábado: 9:00 - 20:00</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="https://wa.me/5492911234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </ScrollAnimation>

          {/* Map */}
          <ScrollAnimation animation="slide-in-right">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ubicación</h2>
              <div className="aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d880.559179805297!2d-62.26331653836195!3d-38.7131329249968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95edbcaccb571925%3A0x14e95dddc85af21b!2sCamisetas%20Bah%C3%ADa!5e0!3m2!1ses-419!2sar!4v1739991165248!5m2!1ses-419!2sar"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
};

export default Contact;