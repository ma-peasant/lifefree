import xlsx from 'node-xlsx';
import { writeFile } from './fileutil'
import { ClearTable, InsertStatisticData ,select} from '../sqlite/sqlite'
import { con } from './constant'
import { Statistic } from '@/beans/Statistic';
var fs = require("fs");
var moment = require('moment')

//导入功能的实现
function OpenXlsx(filepath: string) {
    // Parse a buffer
    try{
        ClearTable(con.STATISTIC_TABLE_NAME);
        const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(filepath));
        //从第二行开始取数据
        //清空数据库，插入数据库
        //let sheetName = workSheetsFromBuffer[0].name;
        workSheetsFromBuffer[0].data.forEach((element: any) => {
            //类别	日期	金钱	支出与收入	生命能量	备注说明
            if ((element.length > 0) && (!element[0].toString().includes('类别'))) {
                let data = new Statistic();
                data.tag = element[0];
                data.date = moment(new Date(1900, 0, element[1] - 1)).format('YYYY-MM-DD');
                data.prices = element[2];
                data.moneyTag = element[3];
                data.lifeEnergy = element[4];
                data.mark = element[5];
                InsertStatisticData(data)
            }
        });
    }catch(error : any){
        console.log("导入数据报错:" + error.message);
    }
   
}

//导出功能的实现
function writeXlsx(sheetName :string,  filepath :string) {
    //一行就是一个数组
    let data : Array<Statistic> =  select(con.STATISTIC_TABLE_NAME)
    //创建一个空的一维数组来存放展开后的信息
    //遍历每个对象，将对象的属性值添加到展开数组中
    let out_data :Array<string[]> = [];
    data.forEach(element => {
        let flattened_array = []
        flattened_array.push(element.tag);
        flattened_array.push(element.date);
        flattened_array.push(element.prices);
        flattened_array.push(element.moneyTag);
        flattened_array.push(element.lifeEnergy);
        flattened_array.push(element.mark);
        out_data.push(flattened_array);
    });
    console.log("out_data : " + out_data);
    // const data = [
    //     [1, 2, 3],
    //     [true, false, null, 'sheetjs'],
    //     ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
    //     ['baz', null, 'qux'],
    // ];

    const sheet = { name: sheetName, data: out_data, options: { '!cols': [{ wch: 10 }, { wch: 10 }, { wch: 10 }] } };
    const buffer = xlsx.build([sheet]);
    //var buffer = xlsx.build([{ name: '六月', data: data }]); // Returns a buffer
    writeFile(filepath, buffer);
}

export { writeXlsx, OpenXlsx }



