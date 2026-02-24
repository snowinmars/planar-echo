import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import StoreCollector from '@/engine/store/StoreCollector';
import Loading from '@/components/Loading/Loading';
import RouterComponent from '@/components/Router/Router'
import {
    CountStoreContextProvider,
    initialCountStore,
} from '@/engine/store/count';

import type { AllStoresProps } from '@/engine/store/StoreCollector';

import './index.scss'

const storeConfigs: AllStoresProps[] = [
    { provider: CountStoreContextProvider, initialData: initialCountStore },
];

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <StoreCollector stores={storeConfigs}>
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Suspense fallback={<Loading />}>
                    <RouterComponent />
                </Suspense>
            </BrowserRouter >
        </StoreCollector>
    </React.StrictMode >,
)
