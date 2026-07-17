import type { Maybe } from '@planar/shared';

export type ItemWidgetState = Readonly<{
  loading: boolean;
  items: string[];
  currentItemId: Maybe<string>;
}>;

export type ItemWidgetActions = Readonly<{
  loadItems: () => Promise<void>;
  loadItem: (itemId: string) => Promise<void>;
}>;
