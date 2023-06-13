//创建数据库
const Database = require('better-sqlite3');
import { con } from './constant';
import{Statistic} from '../beans/Statistic.js'
//每次运行创建数据库和数据表
const db = new Database(con.DBNAME);

export function CreateTable(){
    if(!TableIsExit(con.STATISTIC_TABLE_NAME)){
        const create_table_sql =
        `CREATE TABLE ${con.STATISTIC_TABLE_NAME}
        (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            tag  TEXT,
            prices FLOAT,
            mark     TEXT,
            lifeEnergy FLOAT,
            date      TEXT,
            moneyTag   TEXT
        );`
        createTable(create_table_sql)
    }
    if(!TableIsExit(con.TAG_TABLE_NAME)){
        const create_table_sql =
        `CREATE TABLE ${con.TAG_TABLE_NAME}
        (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            tag  TEXT
        );`
        createTable(create_table_sql)
    }
}

//InsertData("testfirst", 1)
export function select(table_name :string) {
    // 执行查询
    const query = db.prepare(`SELECT * FROM ${table_name}`);
    const result = query.all();
    // 处理查询结果
    console.log(result);
    // if (result.length > 0) {
    //     console.log(typeof (result));
    //     result.filter(item => {
    //       Tags.push(item)
    //     })
    //   }
    return result;
    // 关闭数据库连接
    //db.close();
}




//创建表格
function createTable(sql:string) {
    db.exec(sql) //执行sql命令
    console.log('创建表成功');
}

export function InsertStatisticData(data:Statistic) {
    const stmt = db.prepare(`INSERT INTO ${con.STATISTIC_TABLE_NAME}(tag,prices,mark,lifeEnergy,date,moneyTag) VALUES (?,?,?,?,?,?)`);
    const info = stmt.run(data.tag, data.prices,data.mark,data.lifeEnergy,data.date,data.moneyTag);
    const lastInsertedId = db.prepare('SELECT last_insert_rowid() as id').get().id;
    console.log('插入的自增ID:', lastInsertedId);
    return lastInsertedId;
}
//添加消费类型
export function InsertTagData(data :string) {
    const stmt = db.prepare(`INSERT INTO ${con.TAG_TABLE_NAME}(tag) VALUES (?)`);
    const info = stmt.run(data);
    const lastInsertedId = db.prepare('SELECT last_insert_rowid() as id').get().id;
    console.log('插入的自增ID:', lastInsertedId);
    return lastInsertedId;
}

export function UpdateTagData(tag:string , id:number) {
    const stmt = db.prepare(`UPDATE ${con.TAG_TABLE_NAME} SET tag = '{${tag}}' where id =  ${id}`);
    const info = stmt.run();
}
export function DeleteTagData(id :number) {
    const stmt = db.prepare(`delete from ${con.TAG_TABLE_NAME} where id = ${id}`);
    const info = stmt.run();
}

export function DeleteStatisticData(id :number) {
    const stmt = db.prepare(`delete from ${con.STATISTIC_TABLE_NAME} where id = ${id}`);
    const info = stmt.run();
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