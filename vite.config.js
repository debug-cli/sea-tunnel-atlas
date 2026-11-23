import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'js/3d.js',
      name: 'ImmersiveMap3D',
      formats: ['es'],
      fileName: '3d',
    },
    outDir: 'dist/3d',
    emptyOutDir: true,
    copyPublicDir: false,
    minify: 'esbuild',
  },
});
