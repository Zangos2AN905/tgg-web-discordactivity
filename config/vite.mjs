import { DiscordProxy } from '@robojs/patch'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [DiscordProxy.Vite()],
	server: {
		allowedHosts: true,
		headers: {
			'Cross-Origin-Embedder-Policy': 'require-corp',
			'Cross-Origin-Opener-Policy': 'same-origin'
		}
	},
	assetsInclude: ['**/*.wasm'],
	optimizeDeps: {
		exclude: ['index.wasm']
	},
	define: {
		global: 'globalThis'
	}
})
