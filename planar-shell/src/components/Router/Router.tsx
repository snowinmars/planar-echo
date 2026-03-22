import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import type { FC } from 'react';

const Landing = lazy(() => import('@/components/Landing'));
const Details = lazy(() => import('@/components/Details'));

const RouterComponent: FC = () => {
  return (
    <Routes>
      <Route path="/details" element={<Details />} />
      <Route path="/" element={<Landing />} />
    </Routes>
  );
};
export default RouterComponent;
