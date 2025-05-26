import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PropertiesListPage from './pages/PropertiesListPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import AdminPage from './pages/AdminPage';

// Create and export the router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/properties',
    element: <PropertiesListPage />,
  },
  {
    path: '/properties/:id',
    element: <PropertyDetailsPage />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
  {
    path: '/search',
    element: <PropertiesListPage />,
  },
]);

export default router;
