import type { Maybe } from '@planar/shared';

export type ItemWidgetState = {
  loading: boolean;
  items: string[];
  currentItemId: Maybe<string>;
};

export type ItemWidgetActions = {
  loadItems: () => Promise<void>;
  loadItem: (itemId: string) => Promise<void>;
};
