import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()],
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler', // or "modern", "legacy"
				// importers: [
				//   // ...
				// ],
			},
		},
	},
	server: {
		port: 5050
	}
});
