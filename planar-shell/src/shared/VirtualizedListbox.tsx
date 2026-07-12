import { forwardRef } from 'react';
import { List } from 'react-window';

import type { ComponentPropsWithRef } from 'react';
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

const VirtualizedListbox = forwardRef<HTMLDivElement, ComponentPropsWithRef<'div'>>(
  ({ children, ...other }, ref) => (
    <div ref={ref} {...other} style={{ overflow: 'hidden', ...other.style }}>
      <List
        style={{ height: 400 }}
        rowComponent={RowComponent}
        rowCount={Array.isArray(children) ? children.length : 0}
        rowHeight={30}
        rowProps={{ data: Array.isArray(children) ? children : [] }}
        overscanCount={5}
      />
    </div>
  ),
);

export default VirtualizedListbox;
