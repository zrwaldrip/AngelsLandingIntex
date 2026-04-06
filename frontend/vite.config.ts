import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target:
          'https://angels-landing-backend-e7fcddf4a6anb6g4.centralus-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
