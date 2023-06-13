const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  runtimeCompiler:true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  },
})
