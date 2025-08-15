import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port:4000,
    strictPort: true,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          vendor: ['react', 'react-dom'],
          
          // Router
          router: ['react-router-dom'],
          
          // State management
          redux: ['@reduxjs/toolkit', 'react-redux', 'redux-persist', 'redux-logger'],
          
          // React Query
          query: ['@tanstack/react-query'],
          
          // UI components (largest libraries)
          radix: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-popover',
            '@radix-ui/react-toast',
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
          ],
          
          // Animation and interaction
          animation: ['framer-motion', '@react-spring/web', 'canvas-confetti'],
          
          // Charts and visualization
          charts: ['recharts'],
          
          // Form handling
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Date utilities
          dates: ['date-fns', 'react-day-picker'],
          
          // HTTP client
          http: ['axios'],
          
          // Utilities
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
  },
}));
