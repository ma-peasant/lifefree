const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,
  pages: {
    index: { entry: 'src/main.ts' }
    //subpage: { entry: 'src/subpage/main.ts' }
  },
  productionSourceMap: false,
  transpileDependencies: true,
  runtimeCompiler:true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  },
})
