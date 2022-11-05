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
        const [results] = await conn.execute(sql);
        conn.end();

        return results;
    }

    async getDepartmentByName(name) {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT id, name AS department_name FROM department WHERE name = ?';
        const params = [name];

        const [results] = await conn.execute(sql, params);
        conn.end();

        return results;
    }

    async getDepartmentByID(id) {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT id, name AS department_name FROM department WHERE id = ?';
        const params = [id];

        const [results] = await conn.execute(sql, params);

        conn.end();

        return results;
    }

    async getRoles() {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT r.id AS role_id, r.title, r.salary, d.name AS department_name FROM role AS r INNER JOIN department AS d ON d.id = r.department_id';
        const [results] = await conn.execute(sql);
        conn.end();
        return results;
    }

    async getRoleByName(name) {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT r.id, r.title, r.salary, d.name AS department_name FROM role AS r INNER JOIN department AS d ON d.id = r.department_id WHERE r.title = ?';
        const params = [name];

        const [results] = await conn.execute(sql, params);
        conn.end();
        return results;
    }

    async getRoleByID(id) {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT r.id, r.title, r.salary, d.name AS department_name FROM role AS r INNER JOIN department AS d ON d.id = r.department_id WHERE r.id = ?';
        const params = [id];

        const [results] = await conn.execute(sql, params);
        conn.end();
        return results;
    }

    async getEmployees() {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT e.id AS employee_id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, em.first_name AS manager_fname, em.last_name AS manager_lname FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS em ON e.manager_id = em.id ORDER BY e.id;'

        const [results] = await conn.execute(sql);
        conn.end();

        return results;

    }

    async getEmployeeByName(fname, lname) {
        if (!fname && !lname) {
            console.error(`Please provide a first name or last name to the function`);
            return;
        }
        const conn = await mysql.createConnection(this.details);
        let sql = 'SELECT e.id AS employee_id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, em.first_name AS manager_fname, em.last_name AS manager_lname FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS em ON e.manager_id = em.id '

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

        const [results] = await conn.execute(sql, params);
        conn.end();

        return results;
    }

    async getEmployeeByID(id) {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT e.id AS employee_id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, em.first_name AS manager_fname, em.last_name AS manager_lname FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS em ON e.manager_id = em.id WHERE e.id = ?;'

        const params = [id];


        const [results] = await conn.execute(sql, params);
        conn.end();

        return results;
    }

    async getEmployeesByManager(mgrID) {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT e.id AS employee_id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, em.id AS manager_id, em.first_name AS manager_fname, em.last_name AS manager_lname FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS em ON e.manager_id = em.id WHERE e.manager_id = ?;'

        const params = [mgrID];

        const [results] = await conn.execute(sql, params);
        conn.end();

        return results;
    }

    async getManagers() {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT e.id AS employee_id, e.first_name, e.last_name, r.title, d.name AS department_name FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON r.department_id = d.id WHERE e.id IN (SELECT DISTINCT manager_id FROM employee);'

        const [results] = await conn.execute(sql);
        conn.end();

        return results;

    }

    async getEmployeesByDepartment(deptId) {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT e.id AS employee_id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, em.first_name AS manager_fname, em.last_name AS manager_lname FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS em ON e.manager_id = em.id WHERE d.id = ?;';

        const params = [deptId];

        const [results] = await conn.execute(sql, params);
        conn.end();

        return results;
    }

    async addDepartment(name) {
        const existing = await this.getDepartmentByName(name);
        if (existing.length > 0) {
            console.error(`A department with the name ${name} already exists with ID ${existing[0].id}\nAborting action`);
            return existing[0].id;
        }

        const conn = await mysql.createConnection(this.details);
        const sql = 'INSERT INTO department (name) VALUES (?)';
        const params = [name];

        const [results] = await conn.execute(sql, params);

        if (results.affectedRows === 1) {
            const verify = await this.getDepartmentByName(name);
            //console.log(verify);
            console.log(`Department ${name} added successfully with ID ${verify[0].id} `);
            conn.end();
            return verify[0].id;
        }
        else {
            console.error(`Failed to add department ${name}`);
            conn.end();
            return null;
        }

    }

    async deleteDepartment(deptID) {
        const toRemove = await this.getDepartmentByID(deptID);
        
        if (toRemove.length < 1){
            console.error(`Department with ID ${deptID} does not exist and can not be deleted`);
            return;
        }

        const conn = await mysql.createConnection(this.details);
        const sql = 'DELETE FROM department WHERE id = ?';
        const params = [deptID];

        const [results] = await conn.execute(sql, params);

        //If results affect one or more rows - accounting for cascading deletions
        if (results.affectedRows > 0) {
            console.log(`The department ${toRemove[0].department_name} and all associated roles have been removed. Employees have had their role set to NULL. Please update employees roles.`)
        }
        else {
            console.error(`Failed to delete Department ${toRemove[0].department_name}`);
        }

        conn.end();

    }


    async addRole(title, salary, department_id) {
        
        const existing = await this.getRoleByName(title);
        if (existing.length > 0){
            console.log(`Role already exists`);
            return existing[0].id;
        }


        const conn = await mysql.createConnection(this.details);
        const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        const params = [title, salary, department_id];

        // console.log(params);

        const [results] = await conn.execute(sql, params);

        if (results.affectedRows === 1) {
            const verify = await this.getRoleByName(title);
            console.log(`Role ${title} added successfully with ID ${verify[0].id} under the department ${verify[0].department_name}`);
            conn.end();
            return verify[0].id;
        }
        else {
            console.err(`Failed to add department ${title}`);
            conn.end();
            return null;
        }
    }

    async deleteRole (roleID){
        const toRemove = await this.getRoleByID(roleID);
        if (toRemove.length < 1){
            console.error(`Role with ID ${roleID} does not exist and cannot be deleted`);
            return;
        }

        const conn = await mysql.createConnection(this.details);
        const sql = 'DELETE FROM role WHERE id = ?';
        const params = [roleID];

        const [results] = await conn.execute(sql, params);

        //If results affect one or more rows - accounting for cascading deletions
        if (results.affectedRows > 0) {
            console.log(`The role ${toRemove[0].title} has been removed. Employees associated with this role have had their role set to NULL. Please update employees roles are your earliest convenience.`)
        }
        else {
            console.error(`Failed to delete role ${toRemove[0].title}`);
        }

        conn.end();


    }

    async addEmployee(fname, lname, role_id, manager_id) {
        //Assumption that some validation was done prior
        // No checks if employee already exists by name - if the employee exists by name, ask the user if they still want to add before calling this method.
        // Returns new emp id if successful or null if failed
        const conn = await mysql.createConnection(this.details);
        const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);';
        const params = [fname, lname, role_id, manager_id];

        // console.log(params);

        const [results] = await conn.execute(sql, params);

        if (results.affectedRows === 1) {
            const verify = await this.getEmployeeByName(fname, lname);
            console.log(`Employee ${fname} ${lname} successfully created with ID ${verify[0].employee_id}`);
            conn.end();
            return verify[0].employee_id;
        }
        else {
            console.error(`Failed to add employee ${fname} ${lname}`);
            conn.end();
            return null;
        }
    }

    async deleteEmployee (empID) {
        const toDelete = await this.getEmployeeByID(empID);
        if (toDelete.length < 1){
            console.error(`Could not find employee with ID ${empID}.`)
            return;
        }

        const conn = await mysql.createConnection(this.details);
        const sql = 'DELETE FROM employee WHERE id = ?';
        const params = [empID];

        const [results] = await conn.execute(sql,params);

        if (results.affectedRows === 1){
            console.log(`Successfully deleted employee ${toDelete[0].first_name} ${toDelete[0].last_name} with ID ${empID}`);
        }
        else {
            console.error (`Failed to delete employee with ID ${empID}`);
        }

        conn.end();
    }

    async updateEmployeeRole(empId, newRoleID) {
        const conn = await mysql.createConnection(this.details);
        const sql = 'UPDATE employee SET role_id = ? WHERE id = ?;';
        const params = [newRoleID, empId];

        const [results] = await conn.execute(sql, params);

        if (results.affectedRows === 1) {
            const verify = await this.getEmployeeByID(empId);
            console.log(`Employee ${verify[0].first_name} ${verify[0].last_name} role updated to ${verify[0].title}`);
        }
        else {
            console.error(`Failed to update employee ${empId} role.`)
        }

        conn.end()
    }

    async updateEmployeeManager(empId, newMgrId) {
        const conn = await mysql.createConnection(this.details);
        const sql = 'UPDATE employee SET manager_id = ? where id = ?;';
        const params = [newMgrId, empId];

        const [results] = await conn.execute(sql, params);

        if (results.affectedRows === 1) {
            const verify = await this.getEmployeeByID(empId);
            const mgr = await this.getEmployeeByID(newMgrId);
            console.log(`Employee ${verify[0].first_name} ${verify[0].last_name} now managed by ${mgr[0].first_name} ${mgr[0].last_name}`)
        }
        else {
            console.error(`Failed to update manager for employee ID ${empId}`);
        }

        conn.end();
    }

    async getTotalUtilisedBudget() {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT d.id AS department_id, d.name AS department_name, SUM(r.salary) AS total_utilised_budget FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON r.department_id = d.id GROUP BY d.name;'

        const [results] = await conn.execute(sql);

        conn.end();

        return results;
    }

    async getEmployeesWithoutRole() {
        const conn = await mysql.createConnection(this.details);
        const sql = 'SELECT id, first_name, last_name FROM employee WHERE role_id IS NULL;'

        const [results] = await conn.execute(sql);

        conn.end();

        return results;
    }



}

module.exports = Database;