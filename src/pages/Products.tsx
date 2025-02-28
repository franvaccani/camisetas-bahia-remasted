import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, Search, ChevronRight, X } from 'lucide-react';
import { categories } from '../lib/categories';
import { getProducts, Product } from '../lib/productService';
import ScrollAnimation from '../components/ScrollAnimation';

// Define types for category structure
interface SubSubSubCategory {
  id: string;
  name: string;
}

interface SubSubCategory {
  id: string;
  name: string;
  subcategories?: SubSubSubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  subcategories?: SubSubCategory[];
  subItems?: string[];
}

interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: SubCategory[];
}

// Define path type
interface CategoryPath {
  level0?: string;
  level1?: string;
  level2?: string;
  level3?: string;
  [key: string]: string | undefined;
}

// Popular products to show first
const popularCategories = [
  { category: 'adulto', subcategory: 'futbol', subsubcategory: 'camisetas', name: 'Camisetas de Fútbol' },
  { category: 'adulto', subcategory: 'futbol', subsubcategory: 'camisetas-retro', name: 'Camisetas Retro' },
  { category: 'adulto', subcategory: 'futbol', subsubcategory: 'bermudas', name: 'Bermudas' },
  { category: 'adulto', subcategory: 'futbol', subsubcategory: 'chupines-entrenamiento', name: 'Chupines de Entrenamiento' }
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('categoria') || 'todos';
  const currentSubcategory = searchParams.get('subcategoria');
  const currentSubSubcategory = searchParams.get('subsubcategoria');
  const currentSubSubSubcategory = searchParams.get('subsubsubcategoria');
  const searchQuery = searchParams.get('search') || '';
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [popularProducts, setPopularProducts] = useState<{[key: string]: Product[]}>({});

  useEffect(() => {
    // Load products from Supabase
    const loadProducts = async () => {
      setLoading(true);
      try {
        const loadedProducts = await getProducts();
        setProducts(loadedProducts);
        
        // Organize popular products by category
        const popular: {[key: string]: Product[]} = {};
        
        popularCategories.forEach(cat => {
          const key = `${cat.category}-${cat.subcategory}-${cat.subsubcategory}`;
          popular[key] = loadedProducts.filter(p => 
            p.category === cat.category && 
            p.subcategory === cat.subcategory && 
            p.subsubcategory === cat.subsubcategory
          ).slice(0, 8); // Limit to 8 products per category
        });
        
        setPopularProducts(popular);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  // Set search term from URL parameter
  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    const newExpandedCategories = new Set(expandedCategories);
    
    if (currentCategory !== 'todos') {
      newExpandedCategories.add(currentCategory);
      
      if (currentSubcategory) {
        newExpandedCategories.add(currentSubcategory);
        
        if (currentSubSubcategory) {
          newExpandedCategories.add(currentSubSubcategory);
        }
      }
    }
    
    setExpandedCategories(Array.from(newExpandedCategories));
  }, [currentCategory, currentSubcategory, currentSubSubcategory]);

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

  const isCategorySelected = (categoryId: string, path: CategoryPath) => {
    return Object.values(path).includes(categoryId) || 
           categoryId === currentCategory ||
           categoryId === currentSubcategory ||
           categoryId === currentSubSubcategory ||
           categoryId === currentSubSubSubcategory;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    
    if (searchTerm.trim()) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    
    setSearchParams(newParams);
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    
    if (currentCategory !== 'todos') {
      const category = categories.find(c => c.id === currentCategory) as Category | undefined;
      if (category) {
        breadcrumbs.push({ id: category.id, name: category.name });
        
        if (currentSubcategory) {
          const subcategory = category.subcategories?.find(s => s.id === currentSubcategory);
          if (subcategory) {
            breadcrumbs.push({ id: subcategory.id, name: subcategory.name });
            
            if (currentSubSubcategory && subcategory.subcategories) {
              const subsubcategory = subcategory.subcategories.find(s => s.id === currentSubSubcategory);
              if (subsubcategory) {
                breadcrumbs.push({ id: subsubcategory.id, name: subsubcategory.name });
                
                if (currentSubSubSubcategory && subsubcategory.subcategories) {
                  const subsubsubcategory = subsubcategory.subcategories.find(s => s.id === currentSubSubSubcategory);
                  if (subsubsubcategory) {
                    breadcrumbs.push({ id: subsubsubcategory.id, name: subsubsubcategory.name });
                  }
                }
              }
            }
          }
        }
      }
    }
    
    return breadcrumbs;
  };

  const renderCategoryTree = (categoryItems: any[], level = 0, parentPath: CategoryPath = {}) => {
    return categoryItems.map(category => {
      const currentPath = { ...parentPath, [`level${level}`]: category.id };
      const isExpanded = isCategoryExpanded(category.id);
      const isSelected = isCategorySelected(category.id, currentPath);
      const hasSubcategories = category.subcategories && category.subcategories.length > 0;
      
      return (
        <div key={category.id} className={`ml-${level * 4}`}>
          <button
            onClick={() => {
              if (hasSubcategories) {
                toggleCategory(category.id);
              }
              
              // Create new search params based on the category level
              const newParams = new URLSearchParams(searchParams);
              
              if (level === 0) {
                newParams.set('categoria', category.id);
                newParams.delete('subcategoria');
                newParams.delete('subsubcategoria');
                newParams.delete('subsubsubcategoria');
              } else if (level === 1) {
                newParams.set('categoria', parentPath.level0 || '');
                newParams.set('subcategoria', category.id);
                newParams.delete('subsubcategoria');
                newParams.delete('subsubsubcategoria');
              } else if (level === 2) {
                newParams.set('categoria', parentPath.level0 || '');
                newParams.set('subcategoria', parentPath.level1 || '');
                newParams.set('subsubcategoria', category.id);
                newParams.delete('subsubsubcategoria');
              } else if (level === 3) {
                newParams.set('categoria', parentPath.level0 || '');
                newParams.set('subcategoria', parentPath.level1 || '');
                newParams.set('subsubcategoria', parentPath.level2 || '');
                newParams.set('subsubsubcategoria', category.id);
              }
              
              setSearchParams(newParams);
            }}
            className={`w-full text-left px-4 py-2 rounded-md transition flex items-center justify-between ${
              isSelected
                ? 'bg-black text-white font-medium shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>{category.name}</span>
            {hasSubcategories && (
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                } ${isSelected ? 'text-white' : 'text-gray-400'}`}
              />
            )}
          </button>
          
          {isExpanded && hasSubcategories && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
              {renderCategoryTree(category.subcategories, level + 1, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  const filteredProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
    return products.filter(product => {
      // Filter by search term
      if (searchQuery && product.name && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by category
      if (currentCategory !== 'todos') {
        if (product.category !== currentCategory) return false;
        if (currentSubcategory && product.subcategory !== currentSubcategory) return false;
        if (currentSubSubcategory && product.subsubcategory !== currentSubSubcategory) return false;
        if (currentSubSubSubcategory && product.subsubsubcategory !== currentSubSubSubcategory) return false;
      }
      
      return true;
    });
  }, [currentCategory, currentSubcategory, currentSubSubcategory, currentSubSubSubcategory, searchQuery, products]);

  // Render a product card
  const renderProductCard = (product: Product) => (
    <Link
      key={product.id}
      to={`/producto/${product.id}`}
      className="group"
    >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={product.images[0]}
            alt={product.name || 'Producto'}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
        <div className="p-3">
          {product.price !== null ? (
            <p className="text-black font-bold text-lg">
              ${product.price.toLocaleString()}
            </p>
          ) : (
            <p className="text-gray-500 italic text-sm">
              Precio no disponible
            </p>
          )}
          <p className="text-sm text-gray-700 mt-1 line-clamp-2">
            {product.name || 'Producto sin nombre'}
          </p>
        </div>
      </div>
    </Link>
  );

  // Render popular products section
  const renderPopularProducts = () => {
    if (currentCategory !== 'todos' || searchQuery) return null;
    
    return (
      <div className="space-y-8 mb-12">
        {popularCategories.map((category, index) => {
          const key = `${category.category}-${category.subcategory}-${category.subsubcategory}`;
          const products = popularProducts[key] || [];
          
          if (products.length === 0) return null;
          
          return (
            <ScrollAnimation key={key} animation="fade-up" delay={index * 100}>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                  <Link
                    to={`/productos?categoria=${category.category}&subcategoria=${category.subcategory}&subsubcategoria=${category.subsubcategory}`}
                    className="text-black hover:text-gray-400 flex items-center text-sm font-medium"
                  >
                    Ver todos <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map(product => renderProductCard(product))}
                </div>
              </div>
            </ScrollAnimation>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-white px-4 py-2 rounded-lg shadow-sm flex items-center justify-between text-gray-700 hover:bg-gray-50 transition"
          >
            <span className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </span>
            {showFilters ? (
              <X className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-4 py-1 rounded-lg transition"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Breadcrumbs */}
        {currentCategory !== 'todos' && (
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center space-x-2">
                <li>
                  <button
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('categoria');
                      newParams.delete('subcategoria');
                      newParams.delete('subsubcategoria');
                      newParams.delete('subsubsubcategoria');
                      setSearchParams(newParams);
                      setExpandedCategories([]);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Todas las Categorías
                  </button>
                </li>
                {getBreadcrumbs().map((crumb, index) => (
                  <React.Fragment key={crumb.id}>
                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <li>
                      <span className={`${
                        index === getBreadcrumbs().length - 1
                          ? 'text-black font-medium'
                          : 'text-gray-500'
                      }`}>
                        {crumb.name}
                      </span>
                    </li>
                  </React.Fragment>
                ))}
              </ol>
            </nav>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`md:w-72 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="space-y-6">
              {/* Categories */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="font-semibold text-gray-900 mb-4">Categorías</h2>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('categoria');
                      newParams.delete('subcategoria');
                      newParams.delete('subsubcategoria');
                      newParams.delete('subsubsubcategoria');
                      setSearchParams(newParams);
                      setExpandedCategories([]);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-md transition ${
                      currentCategory === 'todos'
                        ? 'bg-black text-white font-medium shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Todas las Categorías
                  </button>

                  <div className="mt-2 space-y-1">
                    {renderCategoryTree(categories as any[])}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Category Title */}
            {currentCategory !== 'todos' && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {getBreadcrumbs().map(crumb => crumb.name).join(' › ')}
                </h1>
                <p className="text-gray-600 mt-2">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} encontrados
                </p>
              </div>
            )}

            {/* Search Results Title */}
            {searchQuery && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Resultados de búsqueda: "{searchQuery}"
                </h1>
                <p className="text-gray-600 mt-2">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} encontrados
                </p>
              </div>
            )}

            {/* Popular Products Sections (only on main page) */}
            {renderPopularProducts()}

            {/* All Products Grid */}
            {(currentCategory !== 'todos' || searchQuery) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => renderProductCard(product))}
              </div>
            )}

            {filteredProducts.length === 0 && (currentCategory !== 'todos' || searchQuery) && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No se encontraron productos con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;