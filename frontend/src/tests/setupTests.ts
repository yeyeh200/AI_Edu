import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Mock HTMLCanvas
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({ data: new Array(4) })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  resetTransform: jest.fn(),
}));

HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,mock');

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock WebSocket
global.WebSocket = jest.fn().mockImplementation(() => ({
  close: jest.fn(),
  send: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  readyState: WebSocket.OPEN,
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock Blob
global.Blob = jest.fn((content, options) => ({
  content,
  type: options?.type || '',
  size: content ? content.length : 0,
}));

// Mock navigator
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(() => Promise.resolve()),
  },
  writable: true,
});

Object.defineProperty(navigator, 'share', {
  value: {
    canShare: jest.fn(() => Promise.resolve(false)),
    share: jest.fn(() => Promise.resolve()),
  },
  writable: true,
});

// Mock Notification
Object.defineProperty(window, 'Notification', {
  value: {
    requestPermission: jest.fn(() => Promise.resolve('granted')),
  },
  writable: true,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
  writable: true,
});

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: jest.fn(() => ({
    getPropertyValue: jest.fn(),
  })),
  writable: true,
});

// Mock crypto
Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      digest: jest.fn(() => Promise.resolve(new ArrayBuffer(32))),
    },
    getRandomValues: jest.fn(() => new Uint8Array(32)),
  },
  writable: true,
});

// Mock performance
Object.defineProperty(global, 'performance', {
  value: {
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
  },
  writable: true,
});

// Mock window.print
Object.defineProperty(window, 'print', {
  value: jest.fn(),
  writable: true,
});

// Mock window.open
Object.defineProperty(window, 'open', {
  value: jest.fn(),
  writable: true,
});

// Mock alert
Object.defineProperty(window, 'alert', {
  value: jest.fn(),
  writable: true,
});

// Mock console warnings/errors (optional)
global.console = {
  ...console,
  // Uncomment to suppress warnings during tests:
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock timers for consistent behavior
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

// Global test utilities
global.createMockEvent = (type: string, data: any = {}) => {
  const event = new Event(type, { bubbles: true, cancelable: true, data });
  Object.assign(event, data);
  return event;
};

global.waitFor = (condition: () => boolean, timeout = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime >= timeout) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(check, 50);
      }
    };

    check();
  });
};

// Mock implementation for requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 16) as unknown as number;
};

global.cancelAnimationFrame = jest.fn(id => {
  clearTimeout(id);
});