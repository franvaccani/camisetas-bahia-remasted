import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, CreditCard, ShieldCheck, Search } from 'lucide-react';
import { getProducts, Product } from '../lib/productService';
import ScrollAnimation from '../components/ScrollAnimation';
import Carrousel from '../components/Carrousel';
const categories = [
  {
    id: 'camisetas-retro',
    name: 'Camisetas Retro',
    image: 'https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { id: 'retro-clubes-internacionales', name: 'Clubes Internacionales' },
      { id: 'retro-clubes-nacionales', name: 'Clubes Nacionales' },
      { id: 'retro-selecciones', name: 'Selecciones Nacionales' }
    ]
  },
  {
    id: 'camisetas',
    name: 'Camisetas',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { id: 'camisetas-clubes-nacionales', name: 'Clubes Nacionales' },
      { id: 'camisetas-clubes-internacionales', name: 'Clubes Internacionales' },
      { id: 'camisetas-selecciones', name: 'Selecciones Nacionales' }
    ]
  },
  {
    id: 'remeras-algodon',
    name: 'Remeras Algodón',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { id: 'remeras-clubes-internacionales', name: 'Clubes Internacionales' },
      { id: 'remeras-clubes-nacionales', name: 'Clubes Nacionales', subItems: [
        'River', 'Boca', 'Racing', 'San Lorenzo', 'Independiente', 'AFA', 'Resto'
      ]},
    ]
  },
  {
    id: 'camperas-buzos',
    name: 'Camperas y Buzos',
    image: 'https://images.unsplash.com/photo-1556172662-322739ade232?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { id: 'camperas-internacional', name: 'Internacional' },
      { id: 'camperas-nacional', name: 'Nacional' },
      { id: 'camperas-afa', name: 'AFA' }
    ]
  },
  {
    id: 'musculosas',
    name: 'Musculosas',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { id: 'musculosas-calidad-original', name: 'Calidad Original' },
      { id: 'musculosas-apliques', name: 'Apliques' },
      { id: 'musculosas-replicas', name: 'Replicas' },
      { id: 'musculosas-sublimadas', name: 'Sublimadas' }
    ]
  },
  {
    id: 'ninos',
    name: 'Niños',
    image: 'https://images.unsplash.com/photo-1577217534079-41d6bb68ac50?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { id: 'futbol-nino', name: 'Fútbol Niño' },
      { id: 'basket-nino', name: 'Basket Niño' }
    ]
  },
  {
    id: 'otros',
    name: 'Otros',
    image: 'https://images.unsplash.com/photo-1580087433295-ab2600c1030e?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { id: 'shorts', name: 'Shorts' },
      { id: 'bermudas', name: 'Bermudas' },
      { id: 'chupines', name: 'Chupines' },
      { id: 'gorras', name: 'Gorras' },
      { id: 'merchandising', name: 'Merchandising' }
    ]
  }
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setLoading(true);
      try {
        // Get all products
        const allProducts = await getProducts();
        
        // Create a map to store one product from each category
        const categoryMap = new Map<string, Product>();
        const subCategoryMap = new Map<string, Product>();
        
        // First pass: get one product from each main category
        allProducts.forEach(product => {
          // Skip products without images
          if (!product.images || product.images.length === 0) return;
          
          const categoryKey = product.category;
          if (!categoryMap.has(categoryKey)) {
            categoryMap.set(categoryKey, product);
          }
          
          // Also try to get one from each subcategory
          const subCategoryKey = `${product.category}-${product.subcategory}`;
          if (!subCategoryMap.has(subCategoryKey)) {
            subCategoryMap.set(subCategoryKey, product);
          }
        });
        
        // Combine products from both maps, prioritizing subcategories
        let combined = [...subCategoryMap.values()];
        
        // If we don't have enough from subcategories, add some from main categories
        if (combined.length < 8) {
          const mainCategoryProducts = [...categoryMap.values()];
          // Add products from main categories that aren't already included
          for (const product of mainCategoryProducts) {
            if (combined.length >= 8) break;
            if (!combined.some(p => p.id === product.id)) {
              combined.push(product);
            }
          }
        }
        
        // If we still don't have 8, just add more products
        if (combined.length < 8 && allProducts.length > 0) {
          const remaining = allProducts.filter(p => 
            !combined.some(cp => cp.id === p.id) && 
            p.images && p.images.length > 0
          ).slice(0, 8 - combined.length);
          
          combined = [...combined, ...remaining];
        }
        
        // Limit to 8 products
        combined = combined.slice(0, 8);
        
        setFeaturedProducts(combined);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFeaturedProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?buscar=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero Section with Search */}
      <section className="relative h-[70vh] bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0">
        <img
            src="https://images.unsplash.com/photo-1676498111080-5b73b7f0122c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Fondo de camisetas de fútbol"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Las Mejores Camisetas de Fútbol y Basket
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl">
            Encontrá tu camiseta favorita entre nuestra amplia colección de equipos.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
            <input
              type="text"
              placeholder="Buscar camisetas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-12 rounded-lg text-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            <button 
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimation animation="fade-up" delay={100}>
              <div className="flex items-center space-x-4 p-6 bg-black rounded-lg">
                <Truck className="h-10 w-10 text-white" />
                <div>
                  <h3 className="font-semibold text-gray-200">Envío Gratis</h3>
                  <p className="text-gray-200">En compras mayores a $50.000</p>
                </div>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fade-up" delay={200}>
              <div className="flex items-center space-x-4 p-6 bg-black rounded-lg">
                <CreditCard className="h-10 w-10 text-white" />
                <div>
                  <h3 className="font-semibold text-gray-200">Cuotas Sin Interés</h3>
                  <p className="text-gray-200">Con todas las tarjetas</p>
                </div>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fade-up" delay={300}>
              <div className="flex items-center space-x-4 p-6 bg-black rounded-lg">
                <ShieldCheck className="h-10 w-10 text-white" />
                <div>
                  <h3 className="font-semibold text-gray-200">Comprá Tranquilo y Seguro</h3>
                  <p className="text-gray-200">Estamos para ayudarte</p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation animation="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Categorías</h2>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <ScrollAnimation 
                key={category.id} 
                animation="fade-up" 
                delay={100 * (index % 3)}
              >
                <Link
                  to={`/productos?categoria=${category.id}`}
                  className="relative group overflow-hidden rounded-lg aspect-h-9"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                      <ul className="space-y-1">
                        {category.subcategories.map((sub) => (
                          <li key={sub.id} className="text-gray-200 text-sm">
                            {sub.name}
                            {sub.subItems && (
                              <ul className="ml-4 mt-1 space-y-1">
                                {sub.subItems.map((item) => (
                                  <li key={item} className="text-gray-300 text-xs">{item}</li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Link>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation animation="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Lo más vendido</h2>
          </ScrollAnimation>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <ScrollAnimation 
                  key={product.id} 
                  animation="fade-up" 
                  delay={100 * (index % 4)}
                >
                  <Link to={`/producto/${product.id}`} className="group">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name || ''}
                        className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">{product.name || ''}</h3>
                        {product.price ? (
                          <p className="text-black font-bold mt-2">${product.price.toLocaleString()}</p>
                         ) : (
                          <p className="text-gray-500 italic mt-2">Consultar precio</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </ScrollAnimation>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollAnimation animation="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Querés recibir nuestras ofertas?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Suscribite a nuestro newsletter y recibí las mejores ofertas y novedades
            </p>
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Suscribirse
              </button>
            </form>
          </ScrollAnimation>
        </div>
      </section>
      <Carrousel />
    </div>
  );
};

export default Home;