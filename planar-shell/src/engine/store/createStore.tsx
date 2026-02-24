import { useRef, createContext, useContext } from 'react';
import type { UseBoundStore, StoreApi } from 'zustand';

type UseData<TData> = UseBoundStore<StoreApi<TData>>;
type Store<TData, TFunctions> = Readonly<{
    data: UseData<TData>;
    functions: TFunctions;
}>;
type CreateStoreProps<TData, TFunctions> = Readonly<{
    createData: (x: TData) => UseData<TData>;
    createFunctions: (x: UseData<TData>) => TFunctions;
}>
type ProviderProps<TData> = Readonly<{
    children: React.ReactNode;
    initialData: TData;
}>;
export type CreateStoreResult<TData, TFunctions> = Readonly<{
    provider: (x: ProviderProps<TData>) => JSX.Element;
    useData: () => UseData<TData>;
    useFunctions: () => TFunctions;
}>;
export const createStore = <TData, TFunctions>(props: CreateStoreProps<TData, TFunctions>): CreateStoreResult<TData, TFunctions> => {
    const context = createContext<Store<TData, TFunctions>>(null!)
    const provider = ({ children, initialData }: ProviderProps<TData>) => {
        const storeRef = useRef<Store<TData, TFunctions>>();
        if (!storeRef.current) {
            const data = props.createData(initialData);
            const functions = props.createFunctions(data);
            storeRef.current = { data, functions };
        }
        return (
            <context.Provider value={storeRef.current}>{children}</context.Provider>
        );
    };
    const useData = (): UseData<TData> => {
        const ctx = useContext(context);
        return ctx.data;
    };
    const useFunctions = (): TFunctions => {
        const ctx = useContext(context);
        return ctx.functions;
    };
    return {
        provider,
        useData,
        useFunctions
    }
}
