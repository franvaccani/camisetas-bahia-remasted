import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import WhatsAppButton from './components/WhatsAppButton';
import ProductManager from './pages/admin/ProductManager';
import ProductForm from './pages/admin/ProductForm';
import MassImageUploader from './pages/admin/MassImageUploader';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/sobre-nosotros" element={<About />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/admin/products" element={<ProductManager />} />
            <Route path="/admin/products/new" element={<ProductForm />} />
            <Route path="/admin/products/:id" element={<ProductForm />} />
            <Route path="/admin/mass-image-uploader" element={<MassImageUploader />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App