//创建数据库
const Database = require('better-sqlite3');
import { con } from '../utils/constant';
import{Statistic} from '../beans/Statistic.js'
import { Config } from '@/beans/Config';
import { da } from 'element-plus/es/locale';
//每次运行创建数据库和数据表
const db = new Database(con.DBNAME);
import {tables} from './tables'

export function CreateTable(){
    for(let entry of tables.entries()){
        if(!TableIsExit(entry[0])){
            createTable(entry[1])
        }
    }
}

export function select(table_name :string) {
    const query = db.prepare(`SELECT * FROM ${table_name}`);
    const result = query.all();
    console.log(result);
 
    return result;
    // 关闭数据库连接
    //db.close();
}

//创建表格
function createTable(sql:string) {
    db.exec(sql) //执行sql命令
    console.log('创建表成功');
}

export function InsertConfigData(data:Config) {
    const stmt = db.prepare(`INSERT INTO ${con.Setting_TABLE_NAME}(key,value) VALUES (?,?)`);
    const info = stmt.run(data.key,data.value);
    const lastInsertedId = db.prepare('SELECT last_insert_rowid() as id').get().id;
    console.log('插入的自增ID:', lastInsertedId);
    return lastInsertedId;
}

export function InsertStatisticData(data:Statistic) {
    const stmt = db.prepare(`INSERT INTO ${con.STATISTIC_TABLE_NAME}(category,prices,mark,lifeEnergy,date,moneyTag) VALUES (?,?,?,?,?,?)`);
    const info = stmt.run(data.category, data.prices,data.mark,data.lifeEnergy,data.date,data.moneyTag);
    const lastInsertedId = db.prepare('SELECT last_insert_rowid() as id').get().id;
    console.log('插入的自增ID:', lastInsertedId);
    return lastInsertedId;
}
//添加消费类型
export function InsertTagData(data :string) {
    const stmt = db.prepare(`INSERT INTO ${con.Category_TABLE_NAME}(tag) VALUES (?)`);
    const info = stmt.run(data);
    const lastInsertedId = db.prepare('SELECT last_insert_rowid() as id').get().id;
    console.log('插入的自增ID:', lastInsertedId);
    return lastInsertedId;
}

export function UpdateTagData(tag:string , id:number) {
    const stmt = db.prepare(`UPDATE ${con.Category_TABLE_NAME} SET tag = '{${tag}}' where id =  ${id}`);
    const info = stmt.run();
}

export function UpdateConfigData(key:string , value:string) {
    const stmt = db.prepare(`UPDATE ${con.Setting_TABLE_NAME} SET value = '{${value}}' where key =  ${key}`);
    const info = stmt.run();
}

export function DeleteTagData(id :number) {
    const stmt = db.prepare(`delete from ${con.Category_TABLE_NAME} where id = ${id}`);
    const info = stmt.run();
}

export function DeleteStatisticData(id :number) {
    const stmt = db.prepare(`delete from ${con.STATISTIC_TABLE_NAME} where id = ${id}`);
    const info = stmt.run();
}

export function ClearTable(table_name :string){
    const deleteQuery = `DELETE FROM ${table_name}`;
    db.exec(deleteQuery);
}


function TableIsExit(table_name:string) {
    // 准备查询语句
    const query = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?");
    // 执行查询
    const result = query.get(table_name);
    // 关闭数据库连接
    //db.close();
    // 判断结果
    if (result) {
        console.log('表已存在');
        return true;
    } else {
        console.log('表不存在');
        return false;
    }
}