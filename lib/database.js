const mysql = require('mysql2');

class Database {
    constructor(connectionDetails){
        this.conn = mysql.createConnection(connectionDetails);

    }

}