import xlsx from 'node-xlsx';
import {writeFile} from './fileutil'
import {ClearTable,InsertStatisticData} from './sqlite'
import {con} from './constant'
import { Statistic } from '@/beans/Statistic';
var fs = require("fs");
var moment = require('moment')

//导入功能的实现   `test.xlsx`
function OpenXlsx(filepath:string) {
    // Parse a buffer
    ClearTable(con.STATISTIC_TABLE_NAME);
    const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(filepath));
    //从第二行开始取数据
    //清空数据库，插入数据库
    workSheetsFromBuffer[0].data.forEach((element: any) => {
        //类别	日期	金钱	支出与收入	生命能量	备注说明
       if((element.length>0) &&(!element[0].toString().includes('类别')))
       {
        let data =  new Statistic();
        data.tag = element[0];
        data.date = moment(new Date(1900, 0, element[1] - 1)).format('YYYY-MM-DD');
        data.prices = element[2];
        data.moneyTag = element[3];
        data.lifeEnergy = element[4];
        data.mark = element[5];
        InsertStatisticData(data)
       }
   });
}

//导出功能的实现
function writeXlsx() {
    //一行就是一个数组
    const data = [
        [1, 2, 3],
        [true, false, null, 'sheetjs'],
        ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
        ['baz', null, 'qux'],
    ];

    const sheet = { name: '六月', data: data , options: { '!cols': [{ wch: 10 }, { wch: 10 }, { wch: 10 }] }};
    const buffer = xlsx.build([sheet]);
    //var buffer = xlsx.build([{ name: '六月', data: data }]); // Returns a buffer
    writeFile("test.xlsx",buffer);
}





export {writeXlsx,OpenXlsx}



