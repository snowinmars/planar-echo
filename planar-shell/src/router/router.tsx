import { lazy, Suspense } from 'react';
import { createBrowserRouter, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Loading from '@/components/Loading';

import type { FC, PropsWithChildren } from 'react';

const Landing = lazy(() => import('@/components/Landing'));
const Details = lazy(() => import('@/components/Details'));
const Convert = lazy(() => import('@/components/Convert'));
const Settings = lazy(() => import('@/components/Settings'));
const Dialogue = lazy(() => import('@/components/runners/Dialogue'));
const Creature = lazy(() => import('@/components/runners/Creature'));
const Item = lazy(() => import('@/components/runners/Item'));
const Stores = lazy(() => import('@/components/Stores'));

// https://github.com/remix-run/react-router/issues/12474#issuecomment-2538281149
const HelloDevs: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  return <Suspense fallback={<Loading />} key={location.key}>{children}</Suspense>;
};

const router = createBrowserRouter([{
  path: '/',
  element: <Layout />,
  children: [{
    path: '/',
    element: <HelloDevs><Landing /></HelloDevs>,
  }, {
    path: '/details',
    element: <HelloDevs><Details /></HelloDevs>,
  }, {
    path: '/convert',
    element: <HelloDevs><Convert /></HelloDevs>,
  }, {
    path: '/dialogue',
    element: <HelloDevs><Dialogue /></HelloDevs>,
  }, {
    path: '/creature',
    element: <HelloDevs><Creature /></HelloDevs>,
  }, {
    path: '/item',
    element: <HelloDevs><Item /></HelloDevs>,
  }, {
    path: '/settings',
    element: <HelloDevs><Settings /></HelloDevs>,
  }, {
    path: '/stores',
    element: <HelloDevs><Stores /></HelloDevs>,
  }],
}]);
export default router;
