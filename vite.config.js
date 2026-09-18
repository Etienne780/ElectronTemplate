// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

const dirname = import.meta.dirname;

export default defineConfig({
    root: 'renderer',
    base: './',
    build: {
        outDir: '../renderer/dist',
        emptyOutDir: true
    },
    resolve: {
        alias: {
            '@core': path.resolve(dirname, 'renderer/core'),
            '@common': path.resolve(dirname, 'renderer/common'),
            '@ui': path.resolve(dirname, 'renderer/ui'),
        }
    }
});