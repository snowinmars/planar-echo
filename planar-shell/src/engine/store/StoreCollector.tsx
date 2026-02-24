import { ReactNode } from 'react';
import {
    CountStoreData,
    CountStoreContextProvider,
} from '@/engine/store/count';

export type AllStoresProps =
    | { provider: typeof CountStoreContextProvider; initialData: CountStoreData };

type StoreCollectorProps = {
    stores: AllStoresProps[];
    children: ReactNode;
}

const StoreCollector = ({
    stores,
    children
}: StoreCollectorProps) => {
    return stores.reduceRight(
        (acc, cur) => (<cur.provider initialData={cur.initialData}>{acc}</cur.provider>),
        children
    );
};

export default StoreCollector;
