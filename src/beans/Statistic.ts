import { tableV2GridProps } from "element-plus/es/components/table-v2/src/grid";
//统计数据
class Statistic {
    public prices : string = '';
    //备注 
    public mark :  string  = '';  
    //消费标签
    public category : string = '';
    public lifeEnergy : string = '';
    public date : string = '';
    //开支类型
    public moneyTag : string  = '';
    constructor(){
    };
}

//表格数据，表格要根据id进行删减，使用数据库操作后返回的id
class TabData extends Statistic {
    //备注 
    public id :  number  = 0;  
}

export{Statistic,TabData}