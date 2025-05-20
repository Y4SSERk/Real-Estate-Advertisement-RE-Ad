import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import PropertiesListPage from './pages/PropertiesListPage.jsx';
import PropertyDetailsPage from './pages/PropertyDetailsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MyPropertiesPage from './pages/MyPropertiesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PropertyCRUD from './components/properties/PropertyCRUD.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content" style={{ minHeight: 'calc(100vh - 160px)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<PropertiesListPage />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-properties" element={<MyPropertiesPage />} />
            <Route path="/add-property" element={<PropertyCRUD />} />
            <Route path="/edit-property/:id" element={<PropertyCRUD />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;