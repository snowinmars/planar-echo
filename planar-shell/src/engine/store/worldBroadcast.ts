const PLANAR_WORLD_STORES_CHANNEL_NAME = 'planar-world-stores';

export type WorldStoreBroadcast = {
  type: 'reread';
};

let channel: BroadcastChannel | null = null;

export const getWorldStoresChannel = (): BroadcastChannel => {
  if (!channel) {
    channel = new BroadcastChannel(PLANAR_WORLD_STORES_CHANNEL_NAME);
  }
  return channel;
};

export const fireWorldStoreBroadcast = (): void => {
  getWorldStoresChannel().postMessage({ type: 'reread' } satisfies WorldStoreBroadcast);
};

export const listenWorldStoreBroadcast = (
  onReread: () => void,
): (() => void) => {
  const ch = getWorldStoresChannel();
  const handler = (event: MessageEvent<WorldStoreBroadcast>): void => {
    if (event.data.type === 'reread') {
      onReread();
    }
  };
  ch.addEventListener('message', handler);
  return () => ch.removeEventListener('message', handler);
};
