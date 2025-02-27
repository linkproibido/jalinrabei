import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Lazy load components for better performance
const App = lazy(() => import('./App.tsx'));
const Player = lazy(() => import('./Player.tsx'));
const PlayerBBB = lazy(() => import('./PlayerBBB.tsx'));
const AdultLink = lazy(() => import('./adultLink.tsx'));
const NotFound = lazy(() => import('./NotFound.tsx'));

// Loading component
const Loading = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    ),
  },
  {
    path: '/watch/:id',
    element: (
      <Suspense fallback={<Loading />}>
        <Player />
      </Suspense>
    ),
  },
  {
    path: '/player-bbb',
    element: (
      <Suspense fallback={<Loading />}>
        <PlayerBBB />
      </Suspense>
    ),
  },
  {
    path: '/adult',
    element: (
      <Suspense fallback={<Loading />}>
        <AdultLink />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<Loading />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

// Use createRoot for React 18
createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);