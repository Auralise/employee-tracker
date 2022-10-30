const mysql = require('mysql2/promise');

class Database {
    constructor(connectionDetails){
        this.details = connectionDetails;
        mysql.createConnection(this.details)
        .then(conn => {
            conn.query('select 1+1 as sum;');
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
        const sql = 'SELECT id, name AS department_name FROM department';
        const [rows] = await conn.execute(sql);
        conn.end();

        return rows;
    }

    async getRoles() {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT r.id AS role_id, r.title, r.salary, d.name AS department_name FROM role AS r INNER JOIN department AS d ON d.id = r.department_id';
        const [rows] = await conn.execute(sql);
        conn.end();
        return rows;
    }

    async getEmployees() {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT e.id AS employee_id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, em.first_name AS manager_fname, em.last_name AS manager_lname FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS em ON e.manager_id = em.id;'

        const [rows] = await conn.execute(sql);
        conn.end();

        return rows;
        
    }

    

}

module.exports = Database;