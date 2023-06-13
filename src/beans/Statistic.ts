import { tableV2GridProps } from "element-plus/es/components/table-v2/src/grid";

class Statistic {
    public prices : number = 0;
    //备注 
    public mark :  string  = '';  
    //消费标签
    public tag : string = '';
    public lifeEnergy : number = 0;
    public date : string = '';
    //开支类型
    public moneyTag : string  = '';

    constructor(){
    };

    // constructor(prices: number, mark: string, tag: string ,lifeEnergy:number,date:string,moneyTag :string) {
       
    //     this.prices = prices
    //     this.mark = mark
    //     this.tag = tag
    //     this.lifeEnergy = lifeEnergy
    //     this.date = date
    //     this.moneyTag = moneyTag
    //   }
   
}


class TabData extends Statistic {
    //备注 
    public id :  number  = 0;  
}

export{Statistic,TabData}