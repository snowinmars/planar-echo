import { lazy, Suspense } from 'react';
import { createBrowserRouter, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Loading from '@/components/Loading';

import type { FC, PropsWithChildren } from 'react';

const Landing = lazy(() => import('@/components/Landing'));
const Details = lazy(() => import('@/components/Details'));
const Convert = lazy(() => import('@/components/Convert'));
const Settings = lazy(() => import('@/components/Settings'));
const Dlg = lazy(() => import('@/components/runners/Dlg'));
const Cre = lazy(() => import('@/components/runners/Cre'));
const Itm = lazy(() => import('@/components/runners/Itm'));
const Bcs = lazy(() => import('@/components/runners/Bcs'));
const Mos = lazy(() => import('@/components/runners/Mos'));
const Pvrz = lazy(() => import('@/components/runners/Pvrz'));
const Tis = lazy(() => import('@/components/runners/Tis'));
const Wed = lazy(() => import('@/components/runners/Wed'));
const Acm = lazy(() => import('@/components/runners/Acm'));
const Bam = lazy(() => import('@/components/runners/Bam'));
const Bmp = lazy(() => import('@/components/runners/Bmp'));
const Wav = lazy(() => import('@/components/runners/Wav'));
const Mus = lazy(() => import('@/components/runners/Mus'));
const Eff = lazy(() => import('@/components/runners/Eff'));
const Ids = lazy(() => import('@/components/runners/Ids'));
const Ini = lazy(() => import('@/components/runners/Ini'));
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
    path: '/dlg',
    element: <HelloDevs><Dlg /></HelloDevs>,
  }, {
    path: '/cre',
    element: <HelloDevs><Cre /></HelloDevs>,
  }, {
    path: '/itm',
    element: <HelloDevs><Itm /></HelloDevs>,
  }, {
    path: '/bcs',
    element: <HelloDevs><Bcs /></HelloDevs>,
  }, {
    path: '/mos',
    element: <HelloDevs><Mos /></HelloDevs>,
  }, {
    path: '/pvrz',
    element: <HelloDevs><Pvrz /></HelloDevs>,
  }, {
    path: '/tis',
    element: <HelloDevs><Tis /></HelloDevs>,
  }, {
    path: '/wed',
    element: <HelloDevs><Wed /></HelloDevs>,
  }, {
    path: '/acm',
    element: <HelloDevs><Acm /></HelloDevs>,
  }, {
    path: '/bam',
    element: <HelloDevs><Bam /></HelloDevs>,
  }, {
    path: '/bmp',
    element: <HelloDevs><Bmp /></HelloDevs>,
  }, {
    path: '/wav',
    element: <HelloDevs><Wav /></HelloDevs>,
  }, {
    path: '/mus',
    element: <HelloDevs><Mus /></HelloDevs>,
  }, {
    path: '/eff',
    element: <HelloDevs><Eff /></HelloDevs>,
  }, {
    path: '/ids',
    element: <HelloDevs><Ids /></HelloDevs>,
  }, {
    path: '/ini',
    element: <HelloDevs><Ini /></HelloDevs>,
  }, {
    path: '/settings',
    element: <HelloDevs><Settings /></HelloDevs>,
  }, {
    path: '/stores',
    element: <HelloDevs><Stores /></HelloDevs>,
  }],
}]);
export default router;
