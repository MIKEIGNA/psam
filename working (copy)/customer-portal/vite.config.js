// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//   },
// })



// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'src/ssl/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'src/ssl/localhost.pem')),
    },
    port: 3000, // You can change the port if necessary
    host: 'localhost', // Ensure it's running on localhost
  },
});
