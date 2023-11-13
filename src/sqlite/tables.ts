import { con } from '../utils/constant';

let tables = new Map();

tables.set(con.STATISTIC_TABLE_NAME, `CREATE TABLE ${con.STATISTIC_TABLE_NAME}
(
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    category  TEXT,
    prices FLOAT,
    mark     TEXT,
    lifeEnergy FLOAT,
    date      TEXT,
    moneyTag   TEXT
);`)


tables.set(con.Category_TABLE_NAME,
    `CREATE TABLE ${con.Category_TABLE_NAME}
(
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    tag  TEXT
);`)

tables.set(con.Setting_TABLE_NAME,
    `CREATE TABLE ${con.Setting_TABLE_NAME}
    (
        key  TEXT PRIMARY KEY,
        value  TEXT
    );`)

export{tables}




