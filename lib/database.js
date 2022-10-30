const mysql = require('mysql2/promise');

class Database {
    constructor(connectionDetails) {
        this.details = connectionDetails;
        mysql.createConnection(this.details)
            .then(conn => {
                conn.query('select 1+1 as sum;');
                conn.end();
            })
            .then(() => {
                console.log(`Credentials accepted`);

            })
            .catch(err => {
                throw new Error(`Failed to connect to database. ${err.stack}`);
            })
    }



    async getDepartments() {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT id, name AS department_name FROM department';
        const [rows] = await conn.execute(sql);
        conn.end();

        return rows;
    }

    async getDepartmentByName(name) {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT id, name AS department_name FROM department WHERE name = ?';
        const params = [name.toLowerCase()];

        const [rows] = await conn.execute(sql, params);
        conn.end();

        return rows;
    }

    async getDepartmentByID(id) {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT id, name AS department_name FROM department WHERE id = ?';
        const params = [id];

        const [rows] = await conn.execute(sql, params);

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

    async getRoleByName(name) {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT r.id AS role_id, r.title, r.salary, d.name AS department_name FROM role AS r INNER JOIN department AS d ON d.id = r.department_id WHERE r.title = ?';
        const params = [name.toLowerCase()];

        const [rows] = await conn.execute(sql, params);
        conn.end();
        return rows;
    }

    async getRoleByID(id) {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT r.id AS role_id, r.title, r.salary, d.name AS department_name FROM role AS r INNER JOIN department AS d ON d.id = r.department_id WHERE r.id = ?';
        const params = [id];

        const [rows] = await conn.execute(sql, params);
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

    async getEmployeeByName(fname, lname) {
        if (!fname && !lname) {
            console.error(`Please provide a first name or last name to the function`);
            return;
        }
        const conn = await mysql.createConnection(this.details);
        let sql = 'SELECT e.id AS employee_id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, em.first_name AS manager_fname, em.last_name AS manager_lname FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS em ON e.manager_id = em.id'

        const params = [];
        if (fname && lname) {
            sql += 'WHERE e.first_name = ? AND e.last_name = ?;';
            params.push(fname);
            params.push(lname);
        }
        else if (fname && !lname) {
            sql += 'WHERE e.first_name = ?;';
            params.push(fname);
        }
        else {
            sql += 'WHERE e.last_name = ?;';
            params.push(lname);
        }

        const [rows] = await conn.execute(sql, params);
        conn.end();

        return rows;
    }

    async getEmployeeByID(id) {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT e.id AS employee_id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, em.first_name AS manager_fname, em.last_name AS manager_lname FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS em ON e.manager_id = em.id WHERE e.id = ?;'

        const params = [id];


        const [rows] = await conn.execute(sql, params);
        conn.end();

        return rows;
    }

    async addDepartment(name) {
        const existing = await this.getDepartmentByName(name);
        if (existing.length > 0) {
            console.error(`A department with the name ${name} already exists with ID ${existing[0].id}\nAborting action`);
            return;
        }

        const conn = await mysql.createConnection(this.details);
        const sql = 'INSERT INTO department (name) VALUES (?)';
        const params = [name];

        const [results] = await conn.execute(sql, params);

        if (results.affectedRows === 1) {
            const verify = await this.getDepartmentByName(name);
            //console.log(verify);
            console.log(`Department ${name} added successfully with ID ${verify[0].id} `);
        }
        else {
            console.error(`Failed to add department ${name}`);
        }
        //console.log (results);
        conn.end();
    }


    async addRole(name, salary, department) {


        const conn = await mysql.createConnection(this.details);

        const sql = 'INSERT'




    }



}

module.exports = Database;