import { create } from "zustand";

import type { UseBoundStore, StoreApi } from 'zustand';
import { createStore } from './createStore';


const store = createStore({
    createData: (x: CountStoreData): UseBoundStore<StoreApi<CountStoreData>> => createCountStoreData(x),
    createFunctions: (x: UseBoundStore<StoreApi<CountStoreData>>): CountStoreFunctions => createCountStoreFunctions(x)
})
export type CountStoreData = {
    count: number;
};
type CountStoreFunctions = {
    countInc: () => void;
    countDec: () => void;
};
const createCountStoreData = (x: CountStoreData): UseBoundStore<StoreApi<CountStoreData>> => create<CountStoreData>(() => ({
    count: x.count,
}));
const createCountStoreFunctions = (s: UseBoundStore<StoreApi<CountStoreData>>): CountStoreFunctions => ({
    countInc: () => s.setState((x) => ({ count: x.count + 1 })),
    countDec: () => s.setState((x) => ({ count: x.count - 1 })),
})

const _count = (x: CountStoreData) => x.count;
export const useCountStoreCount = () => {
    const {
        countInc,
        countDec
    } = store.useFunctions();
    return {
        count: store.useData()(_count),
        countInc,
        countDec,
    };
};
export const CountStoreContextProvider = store.provider;
export const initialCountStore: CountStoreData = {
    count: 5,
};
