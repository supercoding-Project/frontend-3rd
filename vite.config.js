import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://ec2-52-79-228-10.ap-northeast-2.compute.amazonaws.com:8080',
        changeOrigin: true,
      },
    },
  },
});
