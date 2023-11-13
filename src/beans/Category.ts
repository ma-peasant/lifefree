//消费类型
class Category {
    //js里面不能使用name字段，容易和内置的字段冲突
    public content : string ;
    constructor(content:string){
        this.content = content
    }
}

class CategoryData extends Category {
    //备注 
    public id :  number  = 0;  
}
export {Category,CategoryData}