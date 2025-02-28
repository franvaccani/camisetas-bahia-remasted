import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, ArrowLeft, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const CreateChupinesProducts = () => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(48);
  const navigate = useNavigate();

  const handleCreateProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Sample chupines images
      const chupinesImages = [
        'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584865288642-42078afe6942?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571945153237-4929e783af4a?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560243563-062bfc001d68?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590400516695-36708d3f964a?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=600&auto=format&fit=crop'
      ];
      
      // Sample sizes
      const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

      // Use system user ID by default
      let userId = 'system';
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
        }
      } catch (error) {
        console.warn('No authenticated user found, using system user');
      }

      // Create products array
      const productsToInsert = Array.from({ length: count }).map(() => {
        // Randomly select image
        const randomImageIndex = Math.floor(Math.random() * chupinesImages.length);
        
        // Random selection of sizes (between 3 and 6 sizes)
        const numSizes = Math.floor(Math.random() * 4) + 3; // 3 to 6 sizes
        const shuffledSizes = [...allSizes].sort(() => 0.5 - Math.random());
        const selectedSizes = shuffledSizes.slice(0, numSizes);
        
        return {
          id: uuidv4(),
          name: null,
          category: 'adulto',
          subcategory: 'futbol',
          subsubcategory: 'chupines-entrenamiento',
          subsubsubcategory: null,
          price: null,
          images: [chupinesImages[randomImageIndex]],
          temporada: '',
          marca: '',
          description: null,
          sizes: selectedSizes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: userId
        };
      });

      console.log(`Creating ${count} chupines products...`);

      // Insert in batches of 10 to avoid potential issues with large inserts
      const batchSize = 10;
      let successCount = 0;
      
      for (let i = 0; i < productsToInsert.length; i += batchSize) {
        const batch = productsToInsert.slice(i, i + batchSize);
        
        const { data, error } = await supabase
          .from('products')
          .insert(batch)
          .select();

        if (error) {
          console.error(`Error creating batch ${i/batchSize + 1}:`, error);
        } else if (data) {
          successCount += data.length;
          console.log(`Batch ${i/batchSize + 1} created successfully (${data.length} products)`);
        }
      }

      if (successCount > 0) {
        setCompleted(true);
      } else {
        setError('No se pudieron crear los productos');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear los productos';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Crear Productos en Masa - Chupines Entrenamiento
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {completed ? (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-4 text-lg font-medium text-gray-900">¡Productos creados con éxito!</h2>
            <p className="mt-2 text-sm text-gray-500">
              Se han creado {count} productos en la categoría Adulto-Futbol-Chupines Entrenamiento.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/admin/products')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Ver Productos
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label htmlFor="count" className="block text-sm font-medium text-gray-700">
                Cantidad de productos a crear
              </label>
              <input
                type="number"
                id="count"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                min="1"
                max="100"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Se crearán productos en la categoría Adulto-Futbol-Chupines Entrenamiento sin nombres ni precios.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <button
              onClick={handleCreateProducts}
              disabled={loading}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Creando productos...
                </>
              ) : (
                'Crear Productos'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateChupinesProducts;