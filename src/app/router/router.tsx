import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '../layouts/MainLayout.tsx';
import { HomePage } from '../../pages/HomePage/HomePage.tsx';
import { PointsPage } from '../../pages/PointsPage/PointsPage.tsx';
import { ListingsPage } from '../../pages/ListingsPage/ListingsPage.tsx';
import { NotFoundPage } from '../../pages/NotFoundPage/NotFoundPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'points',
        element: <PointsPage />,
      },
      {
        path: 'listings',
        element: <ListingsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
