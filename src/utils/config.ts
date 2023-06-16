// const path = require('path');
// const fs = require('fs');
// // 全局 JSON 对象类
// class GlobalConfig {
//   constructor() {
//     this.filePath = path.join(app.getPath('userData'), 'config.json');
//     this.data = {};

//     this.load();
//   }

//   load() {
//     try {
//       const fileContent = fs.readFileSync(this.filePath, 'utf-8');
//       this.data = JSON.parse(fileContent);
//     } catch (error) {
//       console.error('Failed to load global config:', error);
//     }
//   }

//   save() {
//     try {
//       const jsonContent = JSON.stringify(this.data, null, 2);
//       fs.writeFileSync(this.filePath, jsonContent, 'utf-8');
//     } catch (error) {
//       console.error('Failed to save global config:', error);
//     }
//   }
// }

// // 创建全局的 JSON 对象实例
// const globalConfig = new GlobalConfig();

// // 在其他地方访问和修改全局 JSON 对象
// globalConfig.data.key1 = 'value1';
// globalConfig.data.key2 = 'value2';
// globalConfig.save();
