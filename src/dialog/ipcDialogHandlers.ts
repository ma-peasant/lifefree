
const { ipcMain, dialog } = require('electron');

module.exports = (mainWindow:any) => {
  ipcMain.on('open-file-dialog', (event) => {
    const options : Electron.OpenDialogOptions = {
      properties: ['openFile'],
      filters:[{name:"表格/Execl格式",extensions:["xlsx"]}]
    };

    dialog.showOpenDialog(mainWindow, options).then((result) => {
      if(result.filePaths.length > 0 ){
        event.reply('selected-file', result.filePaths);
      }
    });
  });

  ipcMain.on('save-file-dialog', (event) => {
    const options : Electron.SaveDialogOptions = {
      filters:[{name:"表格/Execl格式",extensions:["xlsx"]}]
    };

    dialog.showSaveDialog(mainWindow, options).then((result) => {
      if(result.filePath != undefined ){
        event.reply('save-file', result.filePath);
      }
    });
  });

};
