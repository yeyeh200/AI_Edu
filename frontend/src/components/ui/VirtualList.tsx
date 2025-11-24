import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  overscan?: number;
  getItemKey?: (item: T, index: number) => string | number;
  onEndReached?: () => void;
  onScroll?: (scrollTop: number) => void;
  className?: string;
  estimatedItemHeight?: number;
}

interface VirtualItem {
  index: number;
  start: number;
  end: number;
  size: number;
  data: any;
}

export const VirtualList = <T,>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  getItemKey = (item, index) => index,
  onEndReached,
  onScroll,
  className = '',
  estimatedItemHeight,
}: VirtualListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollTopRef = useRef(0);

  // Calculate item heights (supports dynamic heights)
  const itemHeights = useMemo(() => {
    if (estimatedItemHeight) {
      return items.map(() => estimatedItemHeight);
    }
    return items.map(() => itemHeight);
  }, [items, itemHeight, estimatedItemHeight]);

  // Calculate cumulative heights for fast position lookup
  const itemPositions = useMemo(() => {
    const positions = [0];
    for (let i = 1; i < itemHeights.length; i++) {
      positions[i] = positions[i - 1] + itemHeights[i - 1];
    }
    return positions;
  }, [itemHeights]);

  // Calculate total height
  const totalHeight = useMemo(() => {
    return itemPositions[itemPositions.length - 1] + itemHeights[itemHeights.length - 1];
  }, [itemPositions, itemHeights]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    if (!containerRef) return { start: 0, end: 0 };

    const containerTop = scrollTop;
    const containerBottom = scrollTop + containerHeight;

    // Binary search for start index
    let start = 0;
    let end = items.length - 1;
    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      if (itemPositions[mid] <= containerTop) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }
    const visibleStart = Math.max(0, start - 1);

    // Binary search for end index
    start = 0;
    end = items.length - 1;
    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      if (itemPositions[mid] < containerBottom) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }
    const visibleEnd = Math.min(items.length - 1, end + 1);

    return {
      start: Math.max(0, visibleStart - overscan),
      end: Math.min(items.length - 1, visibleEnd + overscan),
    };
  }, [scrollTop, containerHeight, items.length, itemPositions, overscan]);

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);

    // Detect scrolling state for performance optimizations
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);

    // Check if reached end for infinite scrolling
    const scrollPercentage = (newScrollTop + containerHeight) / totalHeight;
    if (onEndReached && scrollPercentage > 0.9) {
      onEndReached();
    }

    lastScrollTopRef.current = newScrollTop;
  }, [onScroll, onEndReached, containerHeight, totalHeight]);

  // Scroll to specific item
  const scrollToItem = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    if (!containerRef || index < 0 || index >= items.length) return;

    const itemTop = itemPositions[index];
    const itemBottom = itemTop + itemHeights[index];

    let scrollTop: number;
    switch (align) {
      case 'center':
        scrollTop = itemTop - (containerHeight - itemHeights[index]) / 2;
        break;
      case 'end':
        scrollTop = itemBottom - containerHeight;
        break;
      default:
        scrollTop = itemTop;
    }

    containerRef.scrollTop = Math.max(0, Math.min(scrollTop, totalHeight - containerHeight));
  }, [containerRef, itemPositions, itemHeights, containerHeight, totalHeight, items.length]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    if (containerRef) {
      containerRef.scrollTop = 0;
    }
  }, [containerRef]);

  // Get visible items with positions
  const renderedItems = useMemo(() => {
    const rendered: VirtualItem[] = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      if (i >= 0 && i < items.length) {
        rendered.push({
          index: i,
          start: itemPositions[i],
          end: itemPositions[i] + itemHeights[i],
          size: itemHeights[i],
          data: items[i],
        });
      }
    }
    return rendered;
  }, [visibleRange, itemPositions, itemHeights, items]);

  // Update container ref
  useEffect(() => {
    const container = document.getElementById('virtual-list-container');
    setContainerRef(container);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      id="virtual-list-container"
      className={`virtual-list overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {/* Total height spacer */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Visible items */}
        {renderedItems.map((item) => {
          const key = getItemKey(item.data, item.index);
          const style: React.CSSProperties = {
            position: 'absolute',
            top: item.start,
            left: 0,
            right: 0,
            height: item.size,
            willChange: isScrolling ? 'transform' : undefined,
          };

          return (
            <div
              key={key}
              style={style}
              className="virtual-list-item"
            >
              {renderItem(item.data, item.index, style)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Hook for virtual list state management
export const useVirtualList = <T,>(
  items: T[],
  options: {
    itemHeight: number;
    containerHeight: number;
    overscan?: number;
    estimatedItemHeight?: number;
  }
) => {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [scrollTop, setScrollTop] = useState(0);

  return {
    visibleItems,
    scrollTop,
    setScrollTop,
    VirtualList: VirtualList,
  };
};

export default VirtualList;