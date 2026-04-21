import { forwardRef } from 'react';
import { List } from 'react-window';

import type { CSSProperties } from 'react';
import type { RowComponentProps } from 'react-window';

const RowComponent = (props: RowComponentProps<{ data: string[] }>) => {
  const {
    index,
    data,
    style,
  } = props;

  return (
    <span
      style={style}
      role="option"
      aria-selected={false}
    >
      {data[index]}
    </span>
  );
};

const VirtualizedListbox = forwardRef<HTMLDivElement, { children?: string[]; style?: CSSProperties | undefined }>(
  ({ children = [], ...other }, ref) => (
    <div ref={ref} {...other} style={{ overflow: 'hidden', ...other.style }}>
      <List
        style={{ height: 400 }}
        rowComponent={RowComponent}
        rowCount={children.length}
        rowHeight={30}
        rowProps={{ data: children }}
        overscanCount={5}
      />
    </div>
  ),
);

export default VirtualizedListbox;
