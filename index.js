const inquirer = require('inquirer');
const databaseInterface = require('./lib/database');
// eslint-disable-next-line no-unused-vars
const consoleTable = require('console.table');

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
]



const run = async db => {
    const answer = await inquirer.prompt(mainMenu);
    
    switch (answer.options) {
        case "View all departments":
            console.log('');
            console.table(await db.getDepartments());
            console.log('');
            break;
        case "View all roles": 

            break;
        case "View all employees":

            break;
        case "View all employees by department":

            break;
        case "View all employees by manager":

            break;
        case "View total consumed budget by department":

            break;
        case "Add a department":

            break;
        case "Add a role":

            break;
        case "Add an employee":

            break;
        case "Update an employee's role":
        
            break;
        case "Update and employee's manager":

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