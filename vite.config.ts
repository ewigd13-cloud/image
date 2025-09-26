import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/image/', // GitHub Pages 展開時は '/image/'、ローカル確認時は './'
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    // rollupOptions.input は削除
  },
});