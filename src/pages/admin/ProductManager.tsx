import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronRight, Filter, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getProducts, deleteProduct, Product } from '../../lib/productService';
import { categories, Category, SubCategory, SubSubCategory, SubSubSubCategory } from '../../lib/categories';

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'category'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    } else {
      // Redirect if not authenticated
      navigate('/');
    }
  }, [user, navigate]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      const success = await deleteProduct(id);
      if (success) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        setError('No se pudo encontrar el producto para eliminar');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Error al eliminar el producto');
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategories.includes(categoryId);
  };

  // Group products by category
  const productsByCategory = React.useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    
    // First level: main categories
    (categories as Category[]).forEach(category => {
      grouped[category.id] = products.filter(p => p.category === category.id);
      
      // Second level: subcategories
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          const subcategoryKey = `${category.id}-${subcategory.id}`;
          grouped[subcategoryKey] = products.filter(
            p => p.category === category.id && p.subcategory === subcategory.id
          );
          
          // Third level: subsubcategories
          if (subcategory.subcategories) {
            subcategory.subcategories.forEach(subsubcategory => {
              const subsubcategoryKey = `${category.id}-${subcategory.id}-${subsubcategory.id}`;
              grouped[subsubcategoryKey] = products.filter(
                p => p.category === category.id && 
                  p.subcategory === subcategory.id && 
                  p.subsubcategory === subsubcategory.id
              );
              
              // Fourth level: subsubsubcategories
              if (subsubcategory.subcategories) {
                subsubcategory.subcategories.forEach(subsubsubcategory => {
                  const subsubsubcategoryKey = `${category.id}-${subcategory.id}-${subsubcategory.id}-${subsubsubcategory.id}`;
                  grouped[subsubsubcategoryKey] = products.filter(
                    p => p.category === category.id && 
                      p.subcategory === subcategory.id && 
                      p.subsubcategory === subsubcategory.id &&
                      p.subsubsubcategory === subsubsubcategory.id
                  );
                });
              }
            });
          }
        });
      }
    });
    
    return grouped;
  }, [products]);

  // Filter products by search term
  const filteredProducts = React.useMemo(() => {
    if (!searchTerm) return products;
    
    return products.filter(product => 
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.subsubcategory && product.subsubcategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.subsubsubcategory && product.subsubsubcategory.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  // Get category name from ID
  const getCategoryName = (categoryId: string): string => {
    const category = (categories as Category[]).find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Get subcategory name from IDs
  const getSubcategoryName = (categoryId: string, subcategoryId: string): string => {
    const category = (categories as Category[]).find(c => c.id === categoryId);
    if (!category) return subcategoryId;
    
    const subcategory = category.subcategories?.find(s => s.id === subcategoryId);
    return subcategory ? subcategory.name : subcategoryId;
  };

  // Get subsubcategory name from IDs
  const getSubsubcategoryName = (categoryId: string, subcategoryId: string, subsubcategoryId: string): string => {
    const category = (categories as Category[]).find(c => c.id === categoryId);
    if (!category) return subsubcategoryId;
    
    const subcategory = category.subcategories?.find(s => s.id === subcategoryId);
    if (!subcategory) return subsubcategoryId;
    
    const subsubcategory = subcategory.subcategories?.find(s => s.id === subsubcategoryId);
    return subsubcategory ? subsubcategory.name : subsubcategoryId;
  };

  // Get subsubsubcategory name from IDs
  const getSubsubsubcategoryName = (
    categoryId: string, 
    subcategoryId: string, 
    subsubcategoryId: string,
    subsubsubcategoryId: string
  ): string => {
    const category = (categories as Category[]).find(c => c.id === categoryId);
    if (!category) return subsubsubcategoryId;
    
    const subcategory = category.subcategories?.find(s => s.id === subcategoryId);
    if (!subcategory) return subsubsubcategoryId;
    
    const subsubcategory = subcategory.subcategories?.find(s => s.id === subsubcategoryId);
    if (!subsubcategory) return subsubsubcategoryId;
    
    const subsubsubcategory = subsubcategory.subcategories?.find(s => s.id === subsubsubcategoryId);
    return subsubsubcategory ? subsubsubcategory.name : subsubsubcategoryId;
  };

  // Render product table
  const renderProductTable = (productsToRender: Product[]) => {
    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {productsToRender.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                No hay productos en esta categoría.
              </td>
            </tr>
          ) : (
            productsToRender.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name || 'Producto'}
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name || 'Producto sin nombre'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.sizes.join(', ')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getCategoryName(product.category)}</div>
                  <div className="text-sm text-gray-500">{getSubcategoryName(product.category, product.subcategory)}</div>
                  {product.subsubcategory && (
                    <div className="text-xs text-gray-400">
                      {getSubsubcategoryName(product.category, product.subcategory, product.subsubcategory)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.price !== null ? (
                    <div className="text-sm text-gray-900">
                      ${product.price.toLocaleString()}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No disponible
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  };

  // Render category section
  const renderCategorySection = (category: Category, level = 0) => {
    const categoryId = category.id;
    const isExpanded = isCategoryExpanded(categoryId);
    const productsInCategory = productsByCategory[categoryId] || [];
    const hasProducts = productsInCategory.length > 0;
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    
    return (
      <div key={categoryId} className="mb-6">
        <button
          onClick={() => toggleCategory(categoryId)}
          className={`w-full flex items-center justify-between p-3 rounded-t-lg ${
            isExpanded ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          <span className="font-medium">{category.name} ({productsInCategory.length})</span>
          {(hasProducts || hasSubcategories) && (
            isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
          )}
        </button>
        
        {isExpanded && (
          <div className="bg-white rounded-b-lg shadow overflow-hidden">
            {hasProducts && renderProductTable(productsInCategory)}
            
            {hasSubcategories && category.subcategories && (
              <div className="p-4 space-y-4">
                {category.subcategories.map((subcategory: SubCategory) => {
                  const subcategoryKey = `${category.id}-${subcategory.id}`;
                  const productsInSubcategory = productsByCategory[subcategoryKey] || [];
                  const hasSubcategoryProducts = productsInSubcategory.length > 0;
                  const hasSubsubcategories = subcategory.subcategories && subcategory.subcategories.length > 0;
                  const isSubcategoryExpanded = isCategoryExpanded(subcategoryKey);
                  
                  return (
                    <div key={subcategoryKey} className="ml-4">
                      <button
                        onClick={() => toggleCategory(subcategoryKey)}
                        className={`w-full flex items-center justify-between p-2 rounded ${
                          isSubcategoryExpanded 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="font-medium">{subcategory.name} ({productsInSubcategory.length})</span>
                        {(hasSubcategoryProducts || hasSubsubcategories) && (
                          isSubcategoryExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      
                      {isSubcategoryExpanded && (
                        <div className="mt-2 mb-4">
                          {hasSubcategoryProducts && renderProductTable(productsInSubcategory)}
                          
                          {hasSubsubcategories && subcategory.subcategories && (
                            <div className="p-2 space-y-3">
                              {subcategory.subcategories.map((subsubcategory: SubSubCategory) => {
                                const subsubcategoryKey = `${category.id}-${subcategory.id}-${subsubcategory.id}`;
                                const productsInSubsubcategory = productsByCategory[subsubcategoryKey] || [];
                                const hasSubsubcategoryProducts = productsInSubsubcategory.length > 0;
                                const hasSubsubsubcategories = subsubcategory.subcategories && subsubcategory.subcategories.length > 0;
                                const isSubsubcategoryExpanded = isCategoryExpanded(subsubcategoryKey);
                                
                                // Special case for shorts category
                                const isShortsCategory = subsubcategory.id === 'shorts';
                                
                                return (
                                  <div key={subsubcategoryKey} className="ml-4">
                                    <div className="flex items-center justify-between">
                                      <button
                                        onClick={() => toggleCategory(subsubcategoryKey)}
                                        className={`flex-grow flex items-center justify-between p-2 rounded ${
                                          isSubsubcategoryExpanded 
                                            ? 'bg-blue-50 text-blue-700' 
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                      >
                                        <span className="font-medium">{subsubcategory.name} ({productsInSubsubcategory.length})</span>
                                        {(hasSubsubcategoryProducts || hasSubsubsubcategories) && (
                                          isSubsubcategoryExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                                        )}
                                      </button>
                                    </div>
                                    
                                    {isSubsubcategoryExpanded && (
                                      <div className="mt-2 mb-3">
                                        {hasSubsubcategoryProducts && renderProductTable(productsInSubsubcategory)}
                                        
                                        {hasSubsubsubcategories && subsubcategory.subcategories && (
                                          <div className="p-2 space-y-2">
                                            {subsubcategory.subcategories.map((subsubsubcategory: SubSubSubCategory) => {
                                              const subsubsubcategoryKey = `${category.id}-${subcategory.id}-${subsubcategory.id}-${subsubsubcategory.id}`;
                                              const productsInSubsubsubcategory = productsByCategory[subsubsubcategoryKey] || [];
                                              const hasSubsubsubcategoryProducts = productsInSubsubsubcategory.length > 0;
                                              const isSubsubsubcategoryExpanded = isCategoryExpanded(subsubsubcategoryKey);
                                              
                                              return (
                                                <div key={subsubsubcategoryKey} className="ml-4">
                                                  <button
                                                    onClick={() => toggleCategory(subsubsubcategoryKey)}
                                                    className={`w-full flex items-center justify-between p-1 rounded ${
                                                      isSubsubsubcategoryExpanded 
                                                        ? 'bg-indigo-50 text-indigo-700' 
                                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                  >
                                                    <span className="font-medium">{subsubsubcategory.name} ({productsInSubsubsubcategory.length})</span>
                                                    {hasSubsubsubcategoryProducts && (
                                                      isSubsubsubcategoryExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                                                    )}
                                                  </button>
                                                  
                                                  {isSubsubsubcategoryExpanded && hasSubsubsubcategoryProducts && (
                                                    <div className="mt-2 mb-2">
                                                      {renderProductTable(productsInSubsubsubcategory)}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600">Debes iniciar sesión para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Administrar Productos</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/admin/mass-image-uploader')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
          >
            <Upload className="h-5 w-5 mr-2" />
            Subir Imágenes en Masa
          </button>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-4 py-2 rounded-lg ${
              filterMode === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos ({products.length})
          </button>
          <button
            onClick={() => setFilterMode('category')}
            className={`px-4 py-2 rounded-lg ${
              filterMode === 'category'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Por Categoría
          </button>
        </div>
      </div>

      {/* Product Display */}
      {filterMode === 'all' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {renderProductTable(filteredProducts)}
        </div>
      ) : (
        <div className="space-y-6">
          {(categories as Category[]).map(category => renderCategorySection(category))}
        </div>
      )}
    </div>
  );
};

export default ProductManager;