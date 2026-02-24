import { lazy, FC } from 'react';
import { Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('@/components/Home/Home'));

const RouterComponent: FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    )
}
export default RouterComponent;
