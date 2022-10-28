const mysql = require('mysql2/promise');

class Database {
    constructor(connectionDetails){
        this.details = connectionDetails;
        mysql.createConnection(this.details)
        .then(conn => {
            const result = conn.query('select 1+1 as sum;');
            conn.end();
        })
        .then(() => {
            console.log (`Credentials accepted`);
            
        })
        .catch(err => {
            throw new Error(`Failed to connect to database. ${err.stack}`);
        })
    }

    async getDepartments(){
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT id, name FROM department';
        const results = await conn.execute(sql);
        conn.end();
        return results;
    }

    async getRoles() {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT r.id AS role_id, r.title, r.salary, d.name AS department_name FROM role AS r INNER JOIN departments AS d ON d.id = r.department_id';
        const results = await conn.execute(sql);
        conn.end();
        return results;
    }

}