import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';
import { Database } from './database.types';

export interface Product {
  id: string;
  name: string | null;
  category: string;
  subcategory: string;
  subsubcategory: string | null;
  subsubsubcategory: string | null;
  price: number | null;
  images: string[];
  temporada: string | null;
  marca: string | null;
  description: string | null;
  sizes: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface ProductVariant {
  image: string;
  name: string;
}

// Categories data for name generation
const categories = [
  {
    id: 'adulto',
    name: 'Adulto',
    subcategories: [
      {
        id: 'futbol',
        name: 'Fútbol',
        subcategories: [
          { id: 'bermudas', name: 'Bermudas' },
          {
            id: 'camisetas',
            name: 'Camisetas',
            subcategories: [
              { id: 'clubes-internacionales', name: 'Clubes Internacionales' },
              { id: 'clubes-nacionales', name: 'Clubes Nacionales' },
              { id: 'selecciones-nacionales', name: 'Selecciones Nacionales' }
            ]
          },
          {
            id: 'camisetas-retro',
            name: 'Camisetas Retro',
            subcategories: [
              { id: 'retro-clubes-internacionales', name: 'Clubes Internacionales' },
              { id: 'retro-clubes-nacionales', name: 'Clubes Nacionales' },
              { id: 'retro-selecciones-nacionales', name: 'Selecciones Nacionales' }
            ]
          }
        ]
      },
      {
        id: 'basquet',
        name: 'Básquet',
        subcategories: []
      }
    ]
  },
  {
    id: 'nino',
    name: 'Niño',
    subcategories: []
  }
];

// Initial sample products
const initialProducts: Product[] = [
  {
    id: uuidv4(), // Generate valid UUID instead of "1"
    name: 'Argentina 2022 Campeón',
    category: 'adulto',
    subcategory: 'futbol',
    subsubcategory: 'camisetas',
    subsubsubcategory: 'selecciones-nacionales',
    price: 24999,
    images: [
      'https://images.unsplash.com/photo-1671465317593-a637c8a0e08c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1671465314792-2bd24c64c1c4?q=80&w=600&auto=format&fit=crop'
    ],
    temporada: '2022',
    marca: 'Adidas',
    description: null,
    sizes: ['S', 'M', 'L', 'XL'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'system'
  },
  {
    id: uuidv4(), // Generate valid UUID instead of "2"
    name: 'Boca Juniors 2024',
    category: 'adulto',
    subcategory: 'futbol',
    subsubcategory: 'camisetas',
    subsubsubcategory: 'clubes-nacionales',
    price: 22999,
    images: [
      'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614632537355-3aa9c93c8e8c?q=80&w=600&auto=format&fit=crop'
    ],
    temporada: '2024',
    marca: 'Adidas',
    description: null,
    sizes: ['S', 'M', 'L', 'XL'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'system'
  },
  {
    id: uuidv4(), // Generate valid UUID instead of "3"
    name: 'River Plate Retro 1986',
    category: 'adulto',
    subcategory: 'futbol',
    subsubcategory: 'camisetas-retro',
    subsubsubcategory: 'retro-clubes-nacionales',
    price: 19999,
    images: [
      'https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577471488695-a4dd0d38c335?q=80&w=600&auto=format&fit=crop'
    ],
    temporada: '1986',
    marca: 'Adidas',
    description: null,
    sizes: ['S', 'M', 'L', 'XL'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'system'
  }
];

// Helper function to generate a name from categories
function getCategoryName(category: string, subcategory: string, 
                         subsubcategory?: string, subsubsubcategory?: string): string {
  const parts = [];
  
  // Find category names from IDs
  const categoryObj = categories.find(c => c.id === category);
  if (categoryObj) {
    parts.push(categoryObj.name);
    
    const subcategoryObj = categoryObj.subcategories?.find(s => s.id === subcategory);
    if (subcategoryObj) {
      parts.push(subcategoryObj.name);
      
      if (subsubcategory) {
        const subsubcategoryObj = subcategoryObj.subcategories?.find(s => s.id === subsubcategory);
        if (subsubcategoryObj) {
          parts.push(subsubcategoryObj.name);
          
          if (subsubsubcategory) {
            const subsubsubcategoryObj = subsubcategoryObj.subcategories?.find(s => s.id === subsubsubcategory);
            if (subsubsubcategoryObj) {
              parts.push(subsubsubcategoryObj.name);
            }
          }
        }
      }
    }
  }
  
  return parts.join(' - ') || 'Producto';
}

// Initialize Supabase with sample products if empty
const initializeProducts = async () => {
  try {
    // Check if products table is empty
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking products:', checkError);
      return [];
    }

    // If no products exist, insert initial products
    if (!existingProducts || existingProducts.length === 0) {
      // Add default user_id to each product
      const productsWithUserId = initialProducts.map(product => ({
        ...product,
        user_id: 'system'
      }));

      // Insert initial products
      const { data, error } = await supabase
        .from('products')
        .insert(productsWithUserId)
        .select();

      if (error) {
        console.error('Error initializing products:', error);
        return [];
      }

      return data || [];
    }

    return existingProducts;
  } catch (err) {
    console.error('Error in initializeProducts:', err);
    return [];
  }
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getProducts:', err);
    return [];
  }
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getProductById:', err);
    return null;
  }
};

// Create a new product
export const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
  try {
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

    const newProduct = {
      ...productData,
      temporada: productData.temporada || '', // Provide empty string instead of null
      marca: productData.marca || '', // Provide empty string instead of null
      description: productData.description || null,
      user_id: userId
    };

    console.log('Creating product with data:', newProduct);

    const { data, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    console.log('Product created successfully:', data);
    return data;
  } catch (err) {
    console.error('Error in createProduct:', err);
    return null;
  }
};

// Create multiple products with different images
export const createMultipleProducts = async (
  baseProductData: Omit<Product, 'id' | 'created_at' | 'updated_at'>, 
  variants: ProductVariant[]
): Promise<Product[]> => {
  try {
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

    // Generate a name based on categories if no name provided
    const categoryName = getCategoryName(
      baseProductData.category, 
      baseProductData.subcategory, 
      baseProductData.subsubcategory || undefined, 
      baseProductData.subsubsubcategory || undefined
    );
    
    const productsToInsert = variants.map(variant => {
      return {
        ...baseProductData,
        name: variant.name || baseProductData.name || categoryName,
        images: [variant.image],
        temporada: baseProductData.temporada || '', // Provide empty string instead of null
        marca: baseProductData.marca || '', // Provide empty string instead of null
        description: baseProductData.description || null,
        user_id: userId
      };
    });

    console.log('Creating multiple products:', productsToInsert);

    const { data, error } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select();

    if (error) {
      console.error('Error creating multiple products:', error);
      return [];
    }

    console.log('Multiple products created successfully:', data);
    return data || [];
  } catch (err) {
    console.error('Error in createMultipleProducts:', err);
    return [];
  }
};

// Update an existing product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | null> => {
  try {
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

    const updatedData = {
      ...productData,
      temporada: productData.temporada || '', // Provide empty string instead of null
      marca: productData.marca || '', // Provide empty string instead of null
      description: productData.description || null,
      user_id: userId
    };

    const { data, error } = await supabase
      .from('products')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in updateProduct:', err);
    return null;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in deleteProduct:', err);
    return false;
  }
};

// Create multiple bermudas products
export const createBermudasProducts = async (count: number): Promise<Product[]> => {
  try {
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

    // Sample bermudas images
    const bermudaImages = [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584865288642-42078afe6942?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560243563-062bfc001d68?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590400516695-36708d3f964a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=600&auto=format&fit=crop'
    ];
    
    // Sample colors for naming
    const colors = ['Negro', 'Azul', 'Rojo', 'Blanco', 'Gris', 'Verde', 'Amarillo', 'Naranja'];
    
    // Sample teams
    const teams = ['Boca', 'River', 'Racing', 'Independiente', 'San Lorenzo', 'Estudiantes', 'Gimnasia', 'Newell\'s', 'Rosario Central', 'Talleres', 'Belgrano', 'Colón', 'Unión', 'Banfield', 'Lanús', 'Vélez', 'Huracán', 'Argentinos Juniors', 'Defensa y Justicia', 'Godoy Cruz'];

    // Sample sizes
    const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    // Create products array
    const productsToInsert = Array.from({ length: count }).map((_, index) => {
      // Randomly select image
      const randomImageIndex = Math.floor(Math.random() * bermudaImages.length);
      const randomTeamIndex = Math.floor(Math.random() * teams.length);
      const randomColorIndex = Math.floor(Math.random() * colors.length);
      
      // Random selection of sizes (between 3 and 6 sizes)
      const numSizes = Math.floor(Math.random() * 4) + 3; // 3 to 6 sizes
      const shuffledSizes = [...allSizes].sort(() => 0.5 - Math.random());
      const selectedSizes = shuffledSizes.slice(0, numSizes);
      
      return {
        id: uuidv4(),
        name: `Bermuda ${teams[randomTeamIndex]} ${colors[randomColorIndex]}`,
        category: 'adulto',
        subcategory: 'futbol',
        subsubcategory: 'bermudas',
        subsubsubcategory: null,
        price: Math.floor(Math.random() * 10000) + 5000, // Random price between 5000 and 15000
        images: [bermudaImages[randomImageIndex]],
        temporada: '', // Empty string instead of null
        marca: '', // Empty string instead of null
        description: null,
        sizes: selectedSizes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: userId
      };
    });

    console.log(`Creating ${count} bermudas products...`);

    // Insert in batches of 10 to avoid potential issues with large inserts
    const batchSize = 10;
    const results: Product[] = [];
    
    for (let i = 0; i < productsToInsert.length; i += batchSize) {
      const batch = productsToInsert.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('products')
        .insert(batch)
        .select();

      if (error) {
        console.error(`Error creating batch ${i/batchSize + 1}:`, error);
      } else if (data) {
        results.push(...data);
        console.log(`Batch ${i/batchSize + 1} created successfully (${data.length} products)`);
      }
    }

    return results;
  } catch (err) {
    console.error('Error in createBermudasProducts:', err);
    return [];
  }
};

// Initialize products on module load
initializeProducts();