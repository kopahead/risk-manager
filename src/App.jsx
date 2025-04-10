import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RiskList from './pages/RiskList';
import RiskAnalytics from './pages/RiskAnalytics';
import RiskDetail from './pages/RiskDetail';
import AppLayout from './layouts/AppLayout';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <RiskList />
      },
      {
        path: 'analytics',
        element: <RiskAnalytics />
      },
      {
        path: 'risk/:riskId',
        element: <RiskDetail />
      }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}