import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Settings, AlertCircle, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import logo from '../assets/logo.png';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { user, loading, error, signOut, clearError } = useAuth();
  const navigate = useNavigate();

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    signOut();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?buscar=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setShowSearch(false);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <nav className="bg-[#b6142c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img className='w-32' src={logo} alt="" />
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex text-lg items-center space-x-8">
            <Link to="/" className="hover:text-gray-300 transition">Inicio</Link>
            <Link to="/productos" className="hover:text-gray-300 transition">Productos</Link>
            <Link to="/sobre-nosotros" className="hover:text-gray-300 transition">Nosotros</Link>
            <Link to="/contacto" className="hover:text-gray-300 transition">Contacto</Link>
            
            {/* Search Button */}
          
            
            {user ? (
              <>
                <Link 
                  to="/admin/products" 
                  className="flex items-center space-x-1 hover:text-gray-300 transition"
                >
                  <Settings className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="hover:text-gray-300 transition"
                >
                  {loading ? 'Cerrando...' : 'Cerrar Sesión'}
                </button>
              </>
            ) : (
              <button
                onClick={handleOpenLoginModal}
                disabled={loading}
                className="hover:text-gray-300 transition flex items-center"
              >
                {loading ? (
                  <>
                    <span className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                    Iniciando...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleSearch}
              className="text-white"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>
            <button 
              className="text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar (Expandable) */}
      {showSearch && (
        <div className="bg-blue-700 py-3 px-4">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-12 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
            >
              <span className="sr-only">Buscar</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 hover:bg-blue-700 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              to="/productos" 
              className="block px-3 py-2 hover:bg-blue-700 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Productos
            </Link>
            <Link 
              to="/sobre-nosotros" 
              className="block px-3 py-2 hover:bg-blue-700 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Nosotros
            </Link>
            <Link 
              to="/contacto" 
              className="block px-3 py-2 hover:bg-blue-700 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </Link>
            {user ? (
              <>
                <Link 
                  to="/admin/products" 
                  className="block px-3 py-2 hover:bg-blue-700 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  disabled={loading}
                  className="block w-full text-left px-3 py-2 hover:bg-blue-700 rounded-md"
                >
                  {loading ? 'Cerrando...' : 'Cerrar Sesión'}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleOpenLoginModal();
                  setIsOpen(false);
                }}
                disabled={loading}
                className="block w-full text-left px-3 py-2 hover:bg-blue-700 rounded-md"
              >
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-500 text-white p-4 text-center relative">
          <div className="flex items-center justify-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
          <button 
            onClick={clearError}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-red-100"
            aria-label="Cerrar mensaje de error"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
    </nav>
  );
};

export default Navbar;