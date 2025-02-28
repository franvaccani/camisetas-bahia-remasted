import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, CreditCard, ShieldCheck} from 'lucide-react';
import { getProducts, Product } from '../lib/productService';
import ScrollAnimation from '../components/ScrollAnimation';
import Carrousel from '../components/Carrousel';

interface CategorySubcategory {
  id: string;
  name: string;
  subItems?: string[];
  mappedCategory?: string;
  mappedSubcategory?: string;
  mappedSubsubcategory?: string;
  mappedSubsubsubcategory?: string;
}

interface CategoryItem {
  id: string;
  name: string;
  image: string;
  subcategories: CategorySubcategory[];
  mappedCategory?: string;
  mappedSubcategory?: string;
  mappedSubsubcategory?: string;
}

const categories: CategoryItem[] = [
  {
    id: 'camisetas-retro',
    name: 'Camisetas Retro',
    image: 'https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { id: 'retro-clubes-internacionales', name: 'Clubes Internacionales', mappedCategory: 'adulto', mappedSubcategory: 'futbol', mappedSubsubcategory: 'camisetas-retro', mappedSubsubsubcategory: 'retro-clubes-internacionales' },
      { id: 'retro-clubes-nacionales', name: 'Clubes Nacionales', mappedCategory: 'adulto', mappedSubcategory: 'futbol', mappedSubsubcategory: 'camisetas-retro', mappedSubsubsubcategory: 'retro-clubes-nacionales' },
      { id: 'retro-selecciones', name: 'Selecciones Nacionales', mappedCategory: 'adulto', mappedSubcategory: 'futbol', mappedSubsubcategory: 'camisetas-retro', mappedSubsubsubcategory: 'retro-selecciones-nacionales' }
    ],
    mappedCategory: 'adulto',
    mappedSubcategory: 'futbol',
    mappedSubsubcategory: 'camisetas-retro'
  },
  {
    id: 'camisetas',
    name: 'Camisetas',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { id: 'camisetas-clubes-nacionales', name: 'Clubes Nacionales', mappedCategory: 'adulto', mappedSubcategory: 'futbol', mappedSubsubcategory: 'camisetas', mappedSubsubsubcategory: 'clubes-nacionales' },
      { id: 'camisetas-clubes-internacionales', name: 'Clubes Internacionales', mappedCategory: 'adulto', mappedSubcategory: 'futbol', mappedSubsubcategory: 'camisetas', mappedSubsubsubcategory: 'clubes-internacionales' },
      { id: 'camisetas-selecciones', name: 'Selecciones Nacionales', mappedCategory: 'adulto', mappedSubcategory: 'futbol', mappedSubsubcategory: 'camisetas', mappedSubsubsubcategory: 'selecciones-nacionales' }
    ],
    mappedCategory: 'adulto',
    mappedSubcategory: 'futbol',
    mappedSubsubcategory: 'camisetas'
  },
  {
    id: 'remeras-algodon',
    name: 'Remeras Algodón',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { id: 'remeras-clubes-internacionales', name: 'Clubes Internacionales', mappedCategory: 'adulto', mappedSubcategory: 'futbol', mappedSubsubcategory: 'remeras-algodon', mappedSubsubsubcategory: 'algodon-clubes-internacionales' },
    ],
    mappedCategory: 'adulto',
    mappedSubcategory: 'futbol',
    mappedSubsubcategory: 'remeras-algodon'
  },
  {
    id: 'camperas-buzos',
    name: 'Camperas y Buzos',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { id: 'camperas-internacional', name: 'Internacional', mappedCategory: 'adulto', mappedSubcategory: 'futbol', mappedSubsubcategory: 'camperas-buzos', mappedSubsubsubcategory: 'internacional' },
      { id: 'camperas-nacional', name: 'Nacional', mappedCategory: 'adulto', mappedSubcategory: 'futbol', mappedSubsubcategory: 'camperas-buzos', mappedSubsubsubcategory: 'nacional' },
      { id: 'camperas-afa', name: 'AFA', mappedCategory: 'adulto', mappedSubcategory: 'futbol', mappedSubsubcategory: 'camperas-buzos', mappedSubsubsubcategory: 'afa' }
    ],
    mappedCategory: 'adulto',
    mappedSubcategory: 'futbol',
    mappedSubsubcategory: 'camperas-buzos'
  },
  {
    id: 'musculosas',
    name: 'Musculosas',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { id: 'musculosas-calidad-original', name: 'Calidad Original', mappedCategory: 'adulto', mappedSubcategory: 'basquet', mappedSubsubcategory: 'basquet-musculosas', mappedSubsubsubcategory: 'calidad-original' },
      { id: 'musculosas-apliques', name: 'Apliques', mappedCategory: 'adulto', mappedSubcategory: 'basquet', mappedSubsubcategory: 'basquet-musculosas', mappedSubsubsubcategory: 'apliques' },
      { id: 'musculosas-replicas', name: 'Replicas', mappedCategory: 'adulto', mappedSubcategory: 'basquet', mappedSubsubcategory: 'basquet-musculosas', mappedSubsubsubcategory: 'replicas' },
      { id: 'musculosas-sublimadas', name: 'Sublimadas', mappedCategory: 'adulto', mappedSubcategory: 'basquet', mappedSubsubcategory: 'basquet-musculosas', mappedSubsubsubcategory: 'sublimadas' }
    ],
    mappedCategory: 'adulto',
    mappedSubcategory: 'basquet',
    mappedSubsubcategory: 'basquet-musculosas'
  },
  {
    id: 'ninos',
    name: 'Niños',
    image: 'https://images.unsplash.com/photo-1577217534079-41d6bb68ac50?q=80&w=800&auto=format&fit=crop',
    subcategories: [
      { id: 'futbol-nino', name: 'Fútbol Niño', mappedCategory: 'nino', mappedSubcategory: 'nino-futbol' },
      { id: 'basket-nino', name: 'Basket Niño', mappedCategory: 'nino', mappedSubcategory: 'nino-basquet' }
    ],
    mappedCategory: 'nino',
    mappedSubcategory: 'futbol'
  }
];

const Home = () => {
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

  // Function to generate the correct URL for a category
  const getCategoryUrl = (category: CategoryItem, subcategory?: CategorySubcategory) => {
    let url = '/productos?';
    
    if (subcategory && subcategory.mappedCategory) {
      // If we're linking to a subcategory and it has mapping data, use that
      url += `categoria=${subcategory.mappedCategory}`;
      
      if (subcategory.mappedSubcategory) {
        url += `&subcategoria=${subcategory.mappedSubcategory}`;
        
        if (subcategory.mappedSubsubcategory) {
          url += `&subsubcategoria=${subcategory.mappedSubsubcategory}`;
          
          if (subcategory.mappedSubsubsubcategory) {
            url += `&subsubsubcategoria=${subcategory.mappedSubsubsubcategory}`;
          }
        }
      }
    } else if (category.mappedCategory) {
      // Otherwise use the category mapping data
      url += `categoria=${category.mappedCategory}`;
      
      if (category.mappedSubcategory) {
        url += `&subcategoria=${category.mappedSubcategory}`;
        
        if (category.mappedSubsubcategory) {
          url += `&subsubcategoria=${category.mappedSubsubcategory}`;
        }
      }
    } else {
      // Fallback to the old way if no mapping data is available
      url += `categoria=${category.id}`;
      
      if (subcategory) {
        url += `&subcategoria=${subcategory.id}`;
      }
    }
    
    return url;
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
          <h1 className="text-4xl max-sm:text-3xl md:text-6xl font-bold text-white mb-6">
            Las Mejores Camisetas de Fútbol y Basket
          </h1>
          <p className="text-xl text-white max-sm:text-xl max-w-2xl">
            Encontrá tu camiseta favorita entre nuestra amplia colección de equipos.
          </p>
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
                animation="zoom-in" 
                delay={index * 100}
              >
                <Link
                  to={getCategoryUrl(category)}
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
                            {/* Fix: Use span instead of Link to avoid nested anchor tags */}
                            <span 
                              className="hover:text-white hover:underline cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(getCategoryUrl(category, sub));
                              }}
                            >
                              {sub.name}
                            </span>
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
        <div className="max-w-7xl mx-auto px-4 mb-14 sm:px-6 lg:px-8 text-center">
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
                className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
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