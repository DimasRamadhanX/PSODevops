import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // ⬅️ Penting untuk testing komponen React
    globals: true,        // Opsional, biar gak perlu import describe/it/expect di setiap file
    setupFiles: './setupTests.js', // ⬅️ Opsional jika pakai setup khusus
  },
})
