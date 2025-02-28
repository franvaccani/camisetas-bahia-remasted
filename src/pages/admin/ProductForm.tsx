import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, X, Plus, Trash, Info } from 'lucide-react';
import { categories } from '../../lib/categories';
import { getProductById, createProduct, updateProduct, createMultipleProducts } from '../../lib/productService';

interface ProductFormData {
  name: string | null;
  category: string;
  subcategory: string;
  subsubcategory: string;
  subsubsubcategory: string;
  price: number | null;
  images: string[];
  temporada: string | null;
  marca: string | null;
  sizes: string[];
}

interface ProductVariant {
  image: string;
  name: string;
}

const initialFormData: ProductFormData = {
  name: '',
  category: '',
  subcategory: '',
  subsubcategory: '',
  subsubsubcategory: '',
  price: null,
  images: [''],
  temporada: null,
  marca: null,
  sizes: []
};

// Ejemplos de imágenes de computadoras para usar
const sampleComputerImages = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1537498425277-c283d32ef9db?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1602080858428-57174f9431cf?q=80&w=600&auto=format&fit=crop'
];

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedSubsubcategory, setSelectedSubsubcategory] = useState<string>('');
  const [isMultipleMode, setIsMultipleMode] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([{ image: '', name: '' }]);
  const [showImageSuggestions, setShowImageSuggestions] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await getProductById(id!);
      if (product) {
        setFormData({
          name: product.name,
          category: product.category,
          subcategory: product.subcategory,
          subsubcategory: product.subsubcategory || '',
          subsubsubcategory: product.subsubsubcategory || '',
          price: product.price,
          images: product.images,
          temporada: product.temporada,
          marca: product.marca,
          sizes: product.sizes
        });
        setSelectedCategory(product.category);
        setSelectedSubcategory(product.subcategory);
        setSelectedSubsubcategory(product.subsubcategory || '');
      } else {
        setError('Producto no encontrado');
        navigate('/admin/products');
      }
    } catch (err) {
      setError('Error al cargar el producto');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.category || formData.category.trim() === '') {
        throw new Error('La categoría es obligatoria');
      }

      if (!formData.subcategory || formData.subcategory.trim() === '') {
        throw new Error('La subcategoría es obligatoria');
      }

      if (formData.sizes.length === 0) {
        throw new Error('Debe seleccionar al menos un talle');
      }

      if (isMultipleMode && variants.length > 0) {
        // Create multiple products with different images
        const validVariants = variants.filter(v => v.image.trim() !== '');
        
        if (validVariants.length === 0) {
          throw new Error('Debe agregar al menos una variante con imagen');
        }
        
        console.log('Creating multiple products with data:', formData, validVariants);
        const result = await createMultipleProducts(formData, validVariants);
        
        if (!result || result.length === 0) {
          throw new Error('No se pudieron crear los productos');
        }
        
        navigate('/admin/products');
        return;
      }

      // Validate images for single product mode
      if (!isMultipleMode && (!formData.images || formData.images.length === 0 || !formData.images[0])) {
        throw new Error('Debe agregar al menos una imagen');
      }

      if (id) {
        // Update existing product
        console.log('Updating product with data:', formData);
        const updatedProduct = await updateProduct(id, formData);
        if (!updatedProduct) {
          throw new Error('No se pudo actualizar el producto');
        }
      } else {
        // Create new product
        console.log('Creating new product with data:', formData);
        const newProduct = await createProduct(formData);
        if (!newProduct) {
          throw new Error('No se pudo crear el producto');
        }
      }

      navigate('/admin/products');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar el producto';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Handle price as a number or null
      const numValue = value === '' ? null : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      // Handle other fields
      setFormData(prev => ({ ...prev, [name]: value === '' ? null : value }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedSubcategory('');
    setSelectedSubsubcategory('');
    setFormData(prev => ({
      ...prev,
      category,
      subcategory: '',
      subsubcategory: '',
      subsubsubcategory: ''
    }));
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategory = e.target.value;
    setSelectedSubcategory(subcategory);
    setSelectedSubsubcategory('');
    setFormData(prev => ({
      ...prev,
      subcategory,
      subsubcategory: '',
      subsubsubcategory: ''
    }));
  };

  const handleSubsubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subsubcategory = e.target.value;
    setSelectedSubsubcategory(subsubcategory);
    setFormData(prev => ({
      ...prev,
      subsubcategory,
      subsubsubcategory: ''
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const getSubcategories = () => {
    const category = categories.find(c => c.id === selectedCategory);
    return category?.subcategories || [];
  };

  const getSubsubcategories = () => {
    const category = categories.find(c => c.id === selectedCategory);
    const subcategory = category?.subcategories?.find(s => s.id === selectedSubcategory);
    return subcategory?.subcategories || [];
  };

  const getSubsubsubcategories = () => {
    const category = categories.find(c => c.id === selectedCategory);
    const subcategory = category?.subcategories?.find(s => s.id === selectedSubcategory);
    const subsubcategory = subcategory?.subcategories?.find(s => s.id === selectedSubsubcategory);
    return subsubcategory?.subcategories || [];
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
    setVariants(variants.filter((_, i) => i !== index));
  };

  const toggleMultipleMode = () => {
    setIsMultipleMode(!isMultipleMode);
  };

  const useImageSuggestion = (imageUrl: string, index: number) => {
    if (isMultipleMode) {
      handleVariantChange(index, 'image', imageUrl);
    } else {
      handleImageChange(index, imageUrl);
    }
    setShowImageSuggestions(false);
  };

  if (loading && id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

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
          {id ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {!id && (
        <div className="mb-6">
          <button
            type="button"
            onClick={toggleMultipleMode}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isMultipleMode
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isMultipleMode ? 'Modo múltiple activado' : 'Crear múltiples productos'}
          </button>
          {isMultipleMode && (
            <p className="mt-2 text-sm text-gray-600">
              En este modo, se crearán múltiples productos con la misma información base pero con diferentes imágenes.
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del Producto (Opcional)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Ej: Camiseta Argentina 2022"
              />
              <p className="mt-1 text-sm text-gray-500">
                Si no se especifica, se generará automáticamente a partir de la categoría.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categoría Principal
                </label>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subcategoría
                  </label>
                  <select
                    value={selectedSubcategory}
                    onChange={handleSubcategoryChange}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sub-subcategoría
                  </label>
                  <select
                    value={selectedSubsubcategory}
                    onChange={handleSubsubcategoryChange}
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
                    <label className="block text-sm font-medium text-gray-700">
                      Sub-sub-subcategoría
                    </label>
                    <select
                      name="subsubsubcategory"
                      value={formData.subsubsubcategory || ''}
                      onChange={handleChange}
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Precio (Opcional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price === null ? '' : formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Ingrese el precio (opcional)"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Deje este campo vacío si el precio no está disponible.
              </p>
            </div>

            {!isMultipleMode && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Imágenes (URLs)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowImageSuggestions(!showImageSuggestions)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    {showImageSuggestions ? 'Ocultar sugerencias' : 'Ver sugerencias'}
                  </button>
                </div>
                
                {showImageSuggestions && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">Imágenes sugeridas (computadoras)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {sampleComputerImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img 
                            src={img} 
                            alt={`Sugerencia ${idx + 1}`} 
                            className="h-20 w-full object-cover rounded cursor-pointer hover:opacity-75"
                            onClick={() => useImageSuggestion(img, 0)}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => useImageSuggestion(img, 0)}
                              className="bg-green-600 text-white text-xs px-2 py-1 rounded"
                            >
                              Usar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Haz clic en una imagen para usarla. Estas son imágenes de Unsplash que puedes usar libremente.
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  {formData.images.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required={index === 0}
                      />
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="text-red-600 hover:text-red-900"
                        disabled={formData.images.length === 1 && index === 0}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                  >
                    + Agregar otra imagen
                  </button>
                </div>
              </div>
            )}

            {isMultipleMode && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Variantes de Productos
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowImageSuggestions(!showImageSuggestions)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    {showImageSuggestions ? 'Ocultar sugerencias' : 'Ver sugerencias'}
                  </button>
                </div>
                
                {showImageSuggestions && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">Imágenes sugeridas (computadoras)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {sampleComputerImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img 
                            src={img} 
                            alt={`Sugerencia ${idx + 1}`} 
                            className="h-20 w-full object-cover rounded cursor-pointer hover:opacity-75"
                            onClick={() => useImageSuggestion(img, 0)}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => useImageSuggestion(img, 0)}
                              className="bg-green-600 text-white text-xs px-2 py-1 rounded"
                            >
                              Usar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Haz clic en una imagen para usarla en la primera variante. Estas son imágenes de Unsplash que puedes usar libremente.
                    </p>
                  </div>
                )}
                
                <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                  {variants.map((variant, index) => (
                    <div key={index} className="p-4 bg-white rounded-md shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Variante {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-600 hover:text-red-900"
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
                            placeholder="Nombre de la variante"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL de la Imagen
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
                              alt={variant.name || `Variante ${index + 1}`}
                              className="h-20 w-auto object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addVariant}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:text-gray-900 hover:border-gray-400 flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    Agregar otra variante
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talles Disponibles
              </label>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-4 py-2 rounded-md ${
                      formData.sizes.includes(size)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Guardar Producto
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;