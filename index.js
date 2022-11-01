const inquirer = require('inquirer');
const databaseInterface = require('./lib/database');
// eslint-disable-next-line no-unused-vars
const ct = require('console.table');

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

const chooseDepartment = async db => {
    const departments = await db.getDepartments();
    const choices = [];
    departments.forEach(e => choices.push(e.department_name));

    const question = [{
        type: "list",
        name: "department",
        message: "Which department do you want to view?",
        choices: choices,
    }];

    const answer = await inquirer.prompt(question);

    console.log(''); // add space

    return departments.find(e => e.name = answer.department).id;
}

const chooseManager = async db => {
    const managers = await db.getManagers();
    const choices = [];
    managers.forEach(e => choices.push(`${e.first_name} ${e.last_name}`));

    const question = [{
        type: "list",
        name: "manager",
        message: "Which manager do you want to select?",
        choices: choices,
    }];

    const answer = await inquirer.prompt(question);

    console.log(''); // add space after question

    const names = answer.manager.split(' ');

    return managers.find(e => e.first_name === names[0] && e.last_name === names[1]).employee_id;

}

const addDept = async db => {
    const question = [{
        type: 'input',
        name: 'deptName',
        message: "What do you want to call the department?" 
    }];

    const answer = inquirer.prompt(question);

    console.log('');

    db.addDepartment(answer.deptName);
}

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