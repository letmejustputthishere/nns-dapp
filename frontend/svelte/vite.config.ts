import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

let base = "/v2/";

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [svelte()]
})
