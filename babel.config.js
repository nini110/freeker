module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'import',
      {
        libraryName: 'ant-design-vue',
        libraryDirdecory: 'es',
        style: true
      },
      "@babel/plugin-syntax-dynamic-import", // 路由的动态加载需要
    ]
  ]
}