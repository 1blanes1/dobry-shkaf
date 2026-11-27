import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '../layouts/MainLayout.tsx';
import { HomePage } from '../../pages/HomePage/HomePage.tsx';
import { PointsPage } from '../../pages/PointsPage/PointsPage.tsx';
import { PointDetailsPage } from '../../pages/PointDetailsPage/PointDetailsPage.tsx';
import { ListingsPage } from '../../pages/ListingsPage/ListingsPage.tsx';
import { CreateListingPage } from '../../pages/CreateListingPage/CreateListingPage.tsx';
import { ListingDetailsPage } from '../../pages/ListingDetailsPage/ListingDetailsPage.tsx';
import { EditListingPage } from '../../pages/EditListingPage/EditListingPage.tsx';
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
        path: 'points/:id',
        element: <PointDetailsPage />,
      },
      {
        path: 'listings',
        element: <ListingsPage />,
      },
      {
        path: 'listings/create',
        element: <CreateListingPage />,
      },
      {
        path: 'listings/:id',
        element: <ListingDetailsPage />,
      },
      {
        path: 'listings/:id/edit',
        element: <EditListingPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
