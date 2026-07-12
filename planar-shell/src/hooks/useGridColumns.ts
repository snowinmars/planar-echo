import { useState, useEffect, useRef, useCallback } from 'react';

interface UseGridColumnsOptions {
  columnWidth: number;
  minColumns?: number;
  maxColumns?: number;
  gap?: number;
}

export function useGridColumns({
  columnWidth,
  minColumns = 1,
  maxColumns,
  gap = 8,
}: UseGridColumnsOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(minColumns);

  const calculateColumns = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const availableWidth = containerWidth - gap;
    const columns = Math.floor(availableWidth / (columnWidth + gap));

    let finalColumns = Math.max(columns, minColumns);
    if (maxColumns) {
      finalColumns = Math.min(finalColumns, maxColumns);
    }

    setColumnCount(finalColumns);
  }, [columnWidth, minColumns, maxColumns, gap]);

  useEffect(() => {
    const observer = new ResizeObserver(calculateColumns);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    calculateColumns();

    return () => observer.disconnect();
  }, [calculateColumns]);

  return { containerRef, columnCount };
}
