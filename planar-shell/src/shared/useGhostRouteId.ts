import { useEffect } from 'react';
import { useParams } from 'react-router';

export const useGhostRouteId = (
  paramKey: string,
  load: (id: string) => Promise<void>,
  clear: () => void,
): void => {
  const params = useParams();
  const id = params[paramKey];

  useEffect(() => {
    if (!id) {
      clear();
      return;
    }
    load(id).catch((e: unknown) => console.error(e));
  }, [id, load, clear]);
};
