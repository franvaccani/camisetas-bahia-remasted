import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, ArrowLeft, Check, AlertCircle, Plus, Trash, Image } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { categories, Category } from '../../lib/categories';

interface ProductVariant {
  image: string;
  name: string;
}

const MassImageUploader = () => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedSubsubcategory, setSelectedSubsubcategory] = useState<string>('');
  const [selectedSubsubsubcategory, setSelectedSubsubsubcategory] = useState<string>('');
  const [createdCount, setCreatedCount] = useState(0);
  const [imageUrls, setImageUrls] = useState<string>('');
  const [variants, setVariants] = useState<ProductVariant[]>([{ image: '', name: '' }]);
  const [bulkMode, setBulkMode] = useState(true);
  const navigate = useNavigate();

  // Get subcategories based on selected category
  const getSubcategories = () => {
    const category = (categories as Category[]).find(c => c.id === selectedCategory);
    return category?.subcategories || [];
  };

  // Get subsubcategories based on selected subcategory
  const getSubsubcategories = () => {
    const category = (categories as Category[]).find(c => c.id === selectedCategory);
    const subcategory = category?.subcategories?.find(s => s.id === selectedSubcategory);
    return subcategory?.subcategories || [];
  };

  // Get subsubsubcategories based on selected subsubcategory
  const getSubsubsubcategories = () => {
    const category = (categories as Category[]).find(c => c.id === selectedCategory);
    const subcategory = category?.subcategories?.find(s => s.id === selectedSubcategory);
    const subsubcategory = subcategory?.subcategories?.find(s => s.id === selectedSubsubcategory);
    return subsubcategory?.subcategories || [];
  };

  // Get category name for display
  const getCategoryName = (categoryId: string): string => {
    const category = (categories as Category[]).find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  // Get subcategory name for display
  const getSubcategoryName = (categoryId: string, subcategoryId: string): string => {
    const category = (categories as Category[]).find(c => c.id === categoryId);
    if (!category) return subcategoryId;
    
    const subcategory = category.subcategories?.find(s => s.id === subcategoryId);
    return subcategory?.name || subcategoryId;
  };

  // Get subsubcategory name for display
  const getSubsubcategoryName = (categoryId: string, subcategoryId: string, subsubcategoryId: string): string => {
    const category = (categories as Category[]).find(c => c.id === categoryId);
    if (!category) return subsubcategoryId;
    
    const subcategory = category.subcategories?.find(s => s.id === subcategoryId);
    if (!subcategory) return subsubcategoryId;
    
    const subsubcategory = subcategory.subcategories?.find(s => s.id === subsubcategoryId);
    return subsubcategory?.name || subsubcategoryId;
  };

  // Get full category path for display
  const getCategoryPath = (): string => {
    const parts = [];
    
    if (selectedCategory) {
      parts.push(getCategoryName(selectedCategory));
      
      if (selectedSubcategory) {
        parts.push(getSubcategoryName(selectedCategory, selectedSubcategory));
        
        if (selectedSubsubcategory) {
          parts.push(getSubsubcategoryName(selectedCategory, selectedSubcategory, selectedSubsubcategory));
          
          if (selectedSubsubsubcategory) {
            const category = (categories as Category[]).find(c => c.id === selectedCategory);
            const subcategory = category?.subcategories?.find(s => s.id === selectedSubcategory);
            const subsubcategory = subcategory?.subcategories?.find(s => s.id === selectedSubsubcategory);
            const subsubsubcategory = subsubcategory?.subcategories?.find(s => s.id === selectedSubsubsubcategory);
            
            if (subsubsubcategory) {
              parts.push(subsubsubcategory.name);
            }
          }
        }
      }
    }
    
    return parts.join(' > ');
  };

  const handleVariantChange = (index: number, field: 'image' | 'name', value: string) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { image: '', name: '' }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const processBulkUrls = () => {
    // Split by newlines and filter out empty lines
    const urls = imageUrls.split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    // Create variants from URLs
    const newVariants = urls.map(url => ({
      image: url,
      name: ''
    }));
    
    if (newVariants.length > 0) {
      setVariants(newVariants);
      setBulkMode(false);
    } else {
      setError('No se encontraron URLs válidas');
    }
  };

  const handleCreateProducts = async () => {
    // Validate form
    if (!selectedCategory) {
      setError('Debe seleccionar una categoría');
      return;
    }

    if (!selectedSubcategory) {
      setError('Debe seleccionar una subcategoría');
      return;
    }

    // Validate variants
    const validVariants = variants.filter(v => v.image.trim() !== '');
    if (validVariants.length === 0) {
      setError('Debe agregar al menos una imagen válida');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
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
      const productsToInsert = validVariants.map(variant => {
        // Random selection of sizes (between 3 and 6 sizes)
        const numSizes = Math.floor(Math.random() * 4) + 3; // 3 to 6 sizes
        const shuffledSizes = [...allSizes].sort(() => 0.5 - Math.random());
        const selectedSizes = shuffledSizes.slice(0, numSizes);
        
        return {
          id: uuidv4(),
          name: variant.name || null,
          category: selectedCategory,
          subcategory: selectedSubcategory,
          subsubcategory: selectedSubsubcategory || null,
          subsubsubcategory: selectedSubsubsubcategory || null,
          price: null,
          images: [variant.image],
          temporada: '',
          marca: '',
          description: null,
          sizes: selectedSizes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: userId
        };
      });

      console.log(`Creating ${productsToInsert.length} products for ${getCategoryPath()}...`);

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
        setCreatedCount(successCount);
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
          Creador Masivo de Productos con Imágenes
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
              Se han creado {createdCount} productos en la categoría {getCategoryPath()}.
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
              <p className="text-sm text-gray-500 mb-4">
                Esta herramienta te permite crear múltiples productos con imágenes para cualquier categoría.
                Selecciona la categoría y agrega las URLs de las imágenes.
              </p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría Principal *
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubcategory('');
                      setSelectedSubsubcategory('');
                      setSelectedSubsubsubcategory('');
                    }}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="">Seleccionar categoría</option>
                    {(categories as Category[]).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategoría *
                    </label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => {
                        setSelectedSubcategory(e.target.value);
                        setSelectedSubsubcategory('');
                        setSelectedSubsubsubcategory('');
                      }}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="">Seleccionar subcategoría</option>
                      {getSubcategories().map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {selectedSubcategory && getSubsubcategories().length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub-subcategoría
                    </label>
                    <select
                      value={selectedSubsubcategory}
                      onChange={(e) => {
                        setSelectedSubsubcategory(e.target.value);
                        setSelectedSubsubsubcategory('');
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="">Seleccionar sub-subcategoría</option>
                      {getSubsubcategories().map((subsubcategory) => (
                        <option key={subsubcategory.id} value={subsubcategory.id}>
                          {subsubcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedSubsubcategory && getSubsubsubcategories().length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub-sub-subcategoría
                      </label>
                      <select
                        value={selectedSubsubsubcategory}
                        onChange={(e) => setSelectedSubsubsubcategory(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      >
                        <option value="">Seleccionar sub-sub-subcategoría</option>
                        {getSubsubsubcategories().map((subsubsubcategory) => (
                          <option key={subsubsubcategory.id} value={subsubsubcategory.id}>
                            {subsubsubcategory.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {selectedCategory && selectedSubcategory && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-blue-800 mb-2">Ruta de categoría seleccionada:</h3>
                  <p className="text-blue-700">{getCategoryPath()}</p>
                </div>
              )}

              {/* Toggle between bulk mode and individual mode */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setBulkMode(true)}
                    className={`px-4 py-2 rounded-md ${
                      bulkMode
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Pegar URLs en bloque
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkMode(false)}
                    className={`px-4 py- 2 rounded-md ${
                      !bulkMode
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Agregar URLs individualmente
                  </button>
                </div>
              </div>

              {/* Bulk URL input */}
              {bulkMode && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URLs de imágenes (una por línea)
                  </label>
                  <textarea
                    value={imageUrls}
                    onChange={(e) => setImageUrls(e.target.value)}
                    rows={10}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.jpg&#10;https://ejemplo.com/imagen3.jpg"
                  />
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={processBulkUrls}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <Image className="h-5 w-5 mr-2" />
                      Procesar URLs
                    </button>
                  </div>
                </div>
              )}

              {/* Individual URL inputs */}
              {!bulkMode && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Imágenes para productos
                    </label>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar otra imagen
                    </button>
                  </div>
                  
                  <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                    {variants.map((variant, index) => (
                      <div key={index} className="p-4 bg-white rounded-md shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Imagen {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="text-red-600 hover:text-red-900"
                            disabled={variants.length === 1}
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nombre (Opcional)
                            </label>
                            <input
                              type="text"
                              value={variant.name}
                              onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                              placeholder="Nombre del producto"
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              URL de la Imagen *
                            </label>
                            <input
                              type="url"
                              value={variant.image}
                              onChange={(e) => handleVariantChange(index, 'image', e.target.value)}
                              placeholder="https://ejemplo.com/imagen.jpg"
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                              required
                            />
                          </div>
                          
                          {variant.image && (
                            <div className="mt-2">
                              <img
                                src={variant.image}
                                alt={variant.name || `Imagen ${index + 1}`}
                                className="h-20 w-auto object-cover rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error+de+imagen';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleCreateProducts}
                disabled={loading || !selectedCategory || !selectedSubcategory || (bulkMode && !imageUrls.trim())}
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MassImageUploader;