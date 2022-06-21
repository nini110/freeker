// npm i node-sass@7.0.1 --save-dev
// npm i sass@1.49.9 --save -dev
// npm i sass-loader@10.1.0 --save-dev
// npm install sass-resources-loader --save-dev
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