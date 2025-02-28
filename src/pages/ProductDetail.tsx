import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductById } from '../lib/productService';
import ScrollAnimation from '../components/ScrollAnimation';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setLoading(true);
        try {
          const foundProduct = await getProductById(id);
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            // Product not found, redirect to products page
            navigate('/productos');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          navigate('/productos');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Producto no encontrado</h1>
      </div>
    );
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hola! Me gustaría tener más información sobre este producto`);
    window.open(`https://wa.me/5492911234567?text=${message}`, '_blank');
  };

  const nextImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // Get category names for display
  const getCategoryPath = () => {
    const parts = [];
    
    if (product.category) {
      parts.push(product.category);
      
      if (product.subcategory) {
        parts.push(product.subcategory);
        
        if (product.subsubcategory) {
          parts.push(product.subsubcategory);
          
          if (product.subsubsubcategory) {
            parts.push(product.subsubsubcategory);
          }
        }
      }
    }
    
    return parts.join(' > ');
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Carousel */}
          <ScrollAnimation animation="slide-in-left">
            <div className="relative aspect-w-3 rounded-lg overflow-hidden group">
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[currentImageIndex]}
                    alt={`Producto - Vista ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Buttons (only show if there are multiple images) */}
                  {product.images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={prevImage}
                        className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                        aria-label="Imagen anterior"
                      >
                        <ChevronLeft className="h-6 w-6 text-gray-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                        aria-label="Siguiente imagen"
                      >
                        <ChevronRight className="h-6 w-6 text-gray-800" />
                      </button>
                    </div>
                  )}

                  {/* Dots Indicator (only show if there are multiple images) */}
                  {product.images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {product.images.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                          }`}
                          aria-label={`Ir a imagen ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">No hay imagen disponible</p>
                </div>
              )}
            </div>
          </ScrollAnimation>

          {/* Product Info */}
          <ScrollAnimation animation="slide-in-right">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name || 'Producto sin nombre'}</h1>
              
              <div className="text-sm text-gray-500 mb-2">
                {getCategoryPath()}
              </div>
              
              {product.price !== null ? (
                <p className="text-2xl text-blue-600 font-bold mb-6">
                  ${product.price.toLocaleString()}
                </p>
              ) : (
                <p className="text-lg text-gray-600 italic mb-6">
                  Precio no disponible
                </p>
              )}
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Talle</h2>
                <div className="flex flex-wrap gap-2">
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-md border ${
                          selectedSize === size
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                        } flex items-center justify-center font-medium`}
                      >
                        {size}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500">No hay talles disponibles</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                
                
              </div>

              <button
                onClick={handleWhatsAppClick}
                className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Consultar por WhatsApp
              </button>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;