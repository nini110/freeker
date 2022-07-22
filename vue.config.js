// npm i node-sass@7.0.1 --save-dev
// npm i sass@1.49.9 --save -dev
// npm i sass-loader@10.1.0 --save-dev
// npm install sass-resources-loader --save-dev
// gz压缩
// npm install --save-dev compression-webpack-plugin@1.1.12
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const IS_PROD = process.env.NODE_ENV === 'production';
module.exports = {
    publicPath: IS_PROD ? './' : '/', // 默认'/'，部署应用包时的基本 URL,
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: []
        }
    },
    devServer: {
        overlay: {
            warning: true,
            errors: true
        }
    },
    productionSourceMap: false,
    chainWebpack: config => {
        config.resolve.symlinks(true);
        if (IS_PROD) {
            // webpack-bundle-analyzer打包文件分析工具
            // npm install webpack-bundle-analyzer --save-dev
            config
                .plugin('webpack-bundle-analyzer')
                .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
                .end();
            // 移除prefetch插件，避免加载多余的资源
            config.plugins.delete('prefetch')
            // 移除 preload 插件， 避免加载多余的资源
            config.plugins.delete('preload');
            config.plugins.delete('prefetch-index');
            config.plugins.delete('preload-index');
        }
    },
    configureWebpack: config => {
        config.optimization = {
            splitChunks: {
                chunks: 'all', // async是异步代码切割 initial是同步 all 是同步异步都切割
                minSize: 30, // 字节 文件大于30kb才切割
                maxInitialRequests: 10, // 首页加载的时候引入的文件最多10个
                automaticNameDelimiter: '-', // 打包生成的JS文件分隔符  默认‘~’
                // 配置提取的模块的方案  每一项代表一个提取模块的方案。若cacheGroups每项中有，就按配置的，没有就使用外面配置的
                cacheGroups: {
                    // //第三方组件
                    vendors: {
                        name: 'chunk-app-vendors',
                        test: /[\\\/]node_modules[\\\/]/,
                        priority: -2
                    },
                    zrender: {
                        name: 'chunk-zrender',
                        test: /[\\\/]node_modules[\\\/]zrender[\\\/]/,
                        priority: 0
                    },
                    'antDesignVue': {
                        name: 'chunk-antDesign-vue',
                        test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
                        priority: 0
                    },
                }
            }
        }
        // 性能提示
        config.performance = {
            hints: 'warning',
            //入口起点的最大体积
            maxEntrypointSize: 90000000,
            //生成文件的最大体积
            maxAssetSize: 60000000,
            //只给出 js 文件的性能提示
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js');
            }
        }
        // 配置gz压缩
        if (process.env.NODE_ENV === 'production') {
            const plugins = [
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
                    threshold: 10240,
                    minRatio: 0.8,
                    // deleteOriginalAssets:false,//是否删除源文件
                })
            ]
            config.plugins = [...config.plugins, ...plugins];
        } else {
            // sourcemap用于调试文件
            config.devtool = 'source-map'
        }
    },
    css:{
        loaderOptions:{
            less:{
                lessOptions:{
                    javascriptEnabled: true,
      
                }
            },
       }
    },
    // 关闭eslint
    lintOnSave: false
}