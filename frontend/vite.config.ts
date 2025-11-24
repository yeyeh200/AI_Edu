import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Enable JSX runtime
      jsxRuntime: 'automatic',
      // Configure babel for additional optimizations
      babel: {
        plugins: [
          // Tree shaking for production
          ...(process.env.NODE_ENV === 'production' ? [] : []),
        ],
      },
    }),
    // Bundle analyzer for development
    process.env.NODE_ENV === 'development' && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    // Compression plugin for production
    process.env.NODE_ENV === 'production' && viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    process.env.NODE_ENV === 'production' && viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/pages': resolve(__dirname, 'src/pages'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/api': resolve(__dirname, 'src/api'),
      '@/store': resolve(__dirname, 'src/store'),
      '@/assets': resolve(__dirname, 'src/assets'),
      '@/styles': resolve(__dirname, 'src/styles'),
    },
    // Optimize module resolution
    dedupe: ['react', 'react-dom'],
  },

  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
    // Enable HMR for better development experience
    hmr: {
      overlay: true,
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    minify: 'terser',
    target: 'es2015',

    // Terser options for better compression
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
    },

    rollupOptions: {
      output: {
        // Optimize chunk splitting for better caching
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],

          // Router and navigation
          'router-vendor': ['@tanstack/react-router'],

          // UI component libraries
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],

          // Charting libraries
          'charts-vendor': [
            'recharts',
            'd3-scale',
            'd3-shape',
          ],

          // Utility libraries
          'utils-vendor': [
            'axios',
            'date-fns',
            'lodash-es',
            'clsx',
            'tailwind-merge',
          ],

          // State management
          'state-vendor': [
            '@tanstack/react-query',
            'zustand',
          ],

          // Form handling
          'form-vendor': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
          ],

          // Data table components
          'table-vendor': [
            '@tanstack/react-table',
          ],
        },

        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `${extType}/[name]-[hash][extname]`;
        },
      },

      // External dependencies for better bundle splitting
      external: [],
    },

    // Enable code splitting and optimization
    cssCodeSplit: true,

    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB

    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },

  // Optimize dependencies for faster builds
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'axios',
      'date-fns',
      'recharts',
      '@tanstack/react-query',
      'zustand',
    ],
    exclude: ['@radix-ui/react-dialog'],
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __NODE_ENV__: JSON.stringify(process.env.NODE_ENV || 'development'),
  },

  // CSS optimization
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },

  // Performance optimization
  experimental: {
    renderBuiltUrl: (filename, { hostType }) => {
      if (hostType === 'js') {
        return { js: `/${filename}` };
      } else {
        return { relative: true };
      }
    },
  },

  // Preload optimization
  preview: {
    port: 3000,
    host: true,
  },
})