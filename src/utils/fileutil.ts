//node操作文件
var fs = require("fs")
export function readFileSync(filepath:string){
    // 同步读取
    var data = fs.readFileSync(filepath);
    console.log("同步读取: " + data.toString());
    console.log("程序执行完毕。");
    return data.toString();
}

export function writeFile(filepath:string,data:Buffer){
    console.log("准备写入文件");
    if(fs.existsSync(filepath)) {
        fs.writeFile(filepath, data,  function(err:any) {
            if (err) {
                return console.error(err);
            }
            console.log("数据写入成功！");
         });
    }
}





