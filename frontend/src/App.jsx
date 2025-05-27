import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import './App.css';

// Lazy load components for better performance
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const PropertiesListPage = lazy(() => import('./pages/PropertiesListPage.jsx'));
const PropertyDetailsPage = lazy(() => import('./pages/PropertyDetailsPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const MyPropertiesPage = lazy(() => import('./pages/MyPropertiesPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const PropertyCRUD = lazy(() => import('./components/properties/PropertyCRUD.jsx'));

// Simple loading component
const LoadingFallback = () => (
  <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <div className="loading-spinner">
      <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content" style={{ minHeight: 'calc(100vh - 160px)' }}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<PropertiesListPage />} />
              <Route path="/properties/:id" element={<PropertyDetailsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-properties" element={<MyPropertiesPage />} />
              <Route path="/add-property" element={<PropertyCRUD showFormDirectly={true} />} />
              <Route path="/edit-property/:id" element={<PropertyCRUD />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;