import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Authentication/Login';
import CreateProductForm from './components/Products/CreateProductForm';
import ProductCatalog from './components/Products/ProductCatalog';
import Post from './component/ui/Post';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Post />} />
      <Route path="/login" element={<Login />} />
      <Route path="/welcome" element={<Post />} />
      <Route path="/products/create" element={<CreateProductForm />} />
      <Route path="/products" element={<ProductCatalog />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
