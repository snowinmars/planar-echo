import { lazy, Suspense } from 'react';
import { createBrowserRouter, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Loading from '@/components/Loading';

import type { FC, PropsWithChildren } from 'react';

const Landing = lazy(() => import('@/components/Landing'));
const Details = lazy(() => import('@/components/Details'));
const Workbench = lazy(() => import('@/components/Workbench'));
const Convert = lazy(() => import('@/components/Convert'));
const Settings = lazy(() => import('@/components/Settings'));
const Dlg = lazy(() => import('@/components/Workbench/children/Dlg'));
const Cre = lazy(() => import('@/components/Workbench/children/Cre'));
const Itm = lazy(() => import('@/components/Workbench/children/Itm'));
const Bcs = lazy(() => import('@/components/Workbench/children/Bcs'));
const Mos = lazy(() => import('@/components/Workbench/children/Mos'));
const Pvrz = lazy(() => import('@/components/Workbench/children/Pvrz'));
const Tis = lazy(() => import('@/components/Workbench/children/Tis'));
const Wed = lazy(() => import('@/components/Workbench/children/Wed'));
const Acm = lazy(() => import('@/components/Workbench/children/Acm'));
const Bam = lazy(() => import('@/components/Workbench/children/Bam'));
const Bmp = lazy(() => import('@/components/Workbench/children/Bmp'));
const Wav = lazy(() => import('@/components/Workbench/children/Wav'));
const Mus = lazy(() => import('@/components/Workbench/children/Mus'));
const Eff = lazy(() => import('@/components/Workbench/children/Eff'));
const Ids = lazy(() => import('@/components/Workbench/children/Ids'));
const Ini = lazy(() => import('@/components/Workbench/children/Ini'));
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
    path: '/workbench',
    element: <HelloDevs><Workbench /></HelloDevs>,
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
