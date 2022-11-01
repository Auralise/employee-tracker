const inquirer = require('inquirer');
const databaseInterface = require('./lib/database');
// eslint-disable-next-line no-unused-vars
const ct = require('console.table');

const {chooseDepartment, chooseManager} = require('./src/select');
const {addDept, addRole, addEmployee} = require('./src/add');
const {updateEmployeeRole, updateEmployeeManager} = require('./src/update');

const dbConfig = {
    host: "localhost",
    user: "empdb",
    password: "password",
    database: "employee_db",
}



const mainMenu = [
    {
        type: "list",
        name: "options",
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "View all employees by department",
            "View all employees by manager",
            "View total consumed budget by department",
            new inquirer.Separator(),
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee's role",
            "Update and employee's manager",
            new inquirer.Separator(),
            "Delete a department",
            "Delete a role",
            "Delete an employee",
            new inquirer.Separator(),
            new inquirer.Separator(),
            "Quit"
        ]
    }
];






const run = async db => {
    const answer = await inquirer.prompt(mainMenu);

    switch (answer.options) {
        case "View all departments":
            console.log(''); //Print a new line for layout
            console.table(await db.getDepartments());
            console.log('');
            break;
        case "View all roles":
            console.log('');
            console.table(await db.getRoles());
            console.log('');
            break;
        case "View all employees":
            console.log('');
            console.table(await db.getEmployees());
            console.log('');
            break;
        case "View all employees by department":
            console.log('');
            console.table(await db.getEmployeesByDepartment(await chooseDepartment(db)));
            console.log('');
            break;
        case "View all employees by manager":
            console.log('');
            console.table(await db.getEmployeesByManager(await chooseManager(db)));
            console.log('');
            break;
        case "View total consumed budget by department":
            console.log('');
            console.table(await db.getTotalUtilisedBudget());
            console.log('');
            break;
        case "Add a department":
            console.log('');
            await addDept(db);
            console.log('');
            break;
        case "Add a role":
            console.log('');
            await addRole(db);
            console.log('');
            break;
        case "Add an employee":
            console.log('');
            await addEmployee;
            console.log('');
            break;
        case "Update an employee's role":
            console.log('');
            await updateEmployeeRole(db);
            console.log('');
            break;
        case "Update and employee's manager":
            console.log('');
            await updateEmployeeManager(db);
            console.log('');
            break;
        case "Delete a department":

            break;
        case "Delete a role":

            break;
        case "Delete an employee":

            break;
        case "Quit":
            return;
    }

    run(db);
}

const init = () => {
    const db = new databaseInterface(dbConfig);
    run(db);
}

init();