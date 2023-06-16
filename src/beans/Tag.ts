class Tag {
    //js里面不能使用name字段，容易和内置的字段冲突
    public content : string ;
    constructor(content:string){
        this.content = content
    }
}

class TagData extends Tag {
    //备注 
    public id :  number  = 0;  
}
export {Tag,TagData}