// npm i node-sass@7.0.1 --save-dev
// npm i sass@1.49.9 --save -dev
// npm i sass-loader@10.1.0 --save-dev
// npm install sass-resources-loader --save-dev
module.exports = {
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
            // sass-loader版本不同  键名不同  v8- data  v8  prependData  v8+ additionalData
            sass: {
                additionalData: `@import './src/styles/_index.scss';`
              }
       }
    },
    // 关闭eslint
    lintOnSave: false
}