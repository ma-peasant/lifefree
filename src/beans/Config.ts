class Config {
    //js里面不能使用name字段，容易和内置的字段冲突
    public key : string ;
    public value : string ;
    constructor(key:string , value:string){
        this.key = key,
        this.value = value
    }
}
export {Config}