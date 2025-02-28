
import { Store, Award, Package } from 'lucide-react';
import ScrollAnimation from '../components/ScrollAnimation';

const About = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <ScrollAnimation animation="fade-up">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Sobre Nosotros</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos una tienda especializada en camisetas de fútbol, con más de 10 años de experiencia 
              brindando calidad y autenticidad a nuestros clientes.
            </p>
          </div>
        </ScrollAnimation>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ScrollAnimation animation="slide-in-left" delay={100}>
            <div className="text-center p-6">
              <Store className="h-12 w-12 text-black mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tienda Física</h3>
              <p className="text-gray-600">
                Visítanos en nuestra tienda en Bahía Blanca, donde podrás ver y probar nuestros productos.
              </p>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation animation="fade-up" delay={200}>
            <div className="text-center p-6">
              <Award className="h-12 w-12 text-black mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Productos Originales</h3>
              <p className="text-gray-600">
                Garantizamos la autenticidad de todos nuestros productos con certificados oficiales.
              </p>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation animation="slide-in-right" delay={300}>
            <div className="text-center p-6">
              <Package className="h-12 w-12 text-black mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Envíos Seguros</h3>
              <p className="text-gray-600">
                Realizamos envíos a todo el país con seguimiento y garantía de entrega.
              </p>
            </div>
          </ScrollAnimation>
        </div>

        {/* History */}
        <ScrollAnimation animation="fade-up">
          <div className="bg-gray-50 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                Fundada en 2014, Camisetas Bahia nació de la pasión por el fútbol y la necesidad de ofrecer 
                productos auténticos y de calidad en la región.
              </p>
              <p className="mb-4">
                A lo largo de los años, nos hemos convertido en referentes del mercado, especializándonos 
                en camisetas oficiales de equipos nacionales e internacionales, así como en ediciones retro 
                y coleccionables.
              </p>
              <p>
                Nuestro compromiso con la calidad y el servicio al cliente nos ha permitido crecer y 
                mantener la confianza de miles de aficionados al fútbol que buscan productos auténticos.
              </p>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default About;