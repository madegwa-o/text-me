import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx', // Treats .js files as JSX
    include: /src\/.*\.js$/, // Only applies to .js files in src/
  },
});
''