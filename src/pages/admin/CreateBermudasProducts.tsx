import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBermudasProducts } from '../../lib/productService';
import { Loader, ArrowLeft, Check } from 'lucide-react';

const CreateBermudasProducts = () => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(50);
  const navigate = useNavigate();

  const handleCreateProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const products = await createBermudasProducts(count);
      if (products && products.length > 0) {
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
          Crear Productos en Masa - Bermudas
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
              Se han creado {count} productos en la categoría Adulto-Futbol-Bermudas.
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
                Se crearán productos en la categoría Adulto-Futbol-Bermudas sin nombres ni precios.
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

export default CreateBermudasProducts;