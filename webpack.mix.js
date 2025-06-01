const mix = require('laravel-mix');
const LiveReloadPlugin = require('webpack-livereload-plugin');

mix.js('resources/js/app.js', 'public/js')
    .sass('resources/scss/main.scss', 'public/css')
    .options({ processCssUrls: false });

mix.webpackConfig({
    plugins: [new LiveReloadPlugin()]
});

if (mix.inProduction()) {
    mix.version();
}
