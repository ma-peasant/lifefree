class Tag {
    //js里面不能使用name字段，容易和内置的字段冲突
    public content : string ;
    constructor(content:string){
        this.content = content
    }
}
export {Tag}