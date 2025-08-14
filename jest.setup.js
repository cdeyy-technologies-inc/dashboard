/** @jsxImportSource react */
import React from 'react';
import '@testing-library/jest-dom';
import type { ReactNode, ComponentPropsWithoutRef } from 'react';

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
  };
};

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

// Mock Next.js Head component
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: ReactNode }): ReactNode => {
      return children;
    },
  };
});

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ComponentPropsWithoutRef<'img'>): ReactNode => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return React.createElement('img', props);
  },
}));
