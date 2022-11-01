const inquirer = require('inquirer');
const databaseInterface = require('./lib/database');
// eslint-disable-next-line no-unused-vars
const ct = require('console.table');
const { up } = require('inquirer/lib/utils/readline');

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

const chooseEmployee = async db => {
    const employees = await db.getEmployees();
    const choices = [];
    employees.forEach(e => choices.push(`id:${e.employee_id} ${e.first_name} ${e.last_name}`));

    const question = [
        {
            type: "list",
            name: "employee",
            message: "Which employee do you want to select?",
            choices: choices
        }
    ];

    const answer = await inquirer.promt(question);

    console.log('');

    const names = answer.employee.split(' ');

    return employees.find(e => e.first_name === names[1] && e.last_name === names[2]).employee_id;
}

const chooseRole = async db => {
    const roles = await db.getRoles();
    const roleChoices = [];
    roles.forEach(e => roleChoices.push(e.title));

    const question = [
        {
            type: 'list',
            name: 'role',
            message: 'Which role do you want to select?',
            choices: roleChoices
        }
    ];

    const answer = await inquirer.promt(question);

    return roles.find(e => e.title === answer.role).id;
}

const addDept = async db => {
    const question = [{
        type: 'input',
        name: 'deptName',
        message: "What do you want to call the department?",
        validate: input => {
            if (input.length < 1)
                return "A department must have more 1 character for a name";
            else if (input.length > 30)
                return "A department can't have a name longer than 30 characters";
            else
                return true;
        }
    }];

    const answer = await inquirer.prompt(question);

    console.log('');

    db.addDepartment(answer.deptName);
}

const addRole = async db => {
    const departments = await db.getDepartments();

    const deptChoices = [];

    departments.forEach(e => deptChoices.push(e.department_name));

    const questions = [
        {
            type: "input",
            name: "title",
            message: "What do you want to call the role?",
            validate: input => {
                if (input.length < 3)
                    return "Role title can't be less than 3 characters long";
                else if (input.length > 30)
                    return "Role title can't be longer than 30 characters";
                else
                    return true;
            }
        },
        {
            type: "number",
            name: "salary",
            message: "What salary are you giving this person?",
            validate: input => {
                return input < 0 ? "Salaries can not be less than 0" : true;
            }
        },
        {
            type: "list",
            name: "department",
            message: "What department do you want to add the role to?",
            choices: deptChoices
        }
    ]

    const answers = await inquirer.prompt(questions);

    const deptID = departments.find(e => e.department_name === answers.department).id;

    await db.addRole(answers.title, answers.salary, deptID);
}

const validateName = name => {
    if (name.length < 2)
        return "Name must be 2 or more characters long";
    else if (name.length > 30)
        return "Name must be less than 30 characters long";
    else
        return true;
}

const addEmployee = async db => {
    const roles = await db.getRoles();
    const employees = await db.getEmployees();

    const roleChoices = [];
    roles.forEach(e => roleChoices.push(e.title));

    const managerChoices = [];
    employees.forEach(e => managerChoices.push(`${e.first_name} ${e.last_name}`));
    managerChoices.push("None");

    const questions = [
        {
            type: "input",
            name: "fname",
            message: "Employee's first name: ",
            validate: input => validateName(input)
        },
        {
            type: "input",
            name: "lname",
            message: "Employee's last name: ",
            validate: input => validateName(input)
        },
        {
            type: "list",
            name: "role",
            message: "What role will the employee have? ",
            choices: roleChoices
        },
        {
            type: "list",
            name: "manager",
            message: "Who will be the employee's manager? ",
            choices: managerChoices
        }
    ];

    const answers = await inquirer.prompt(questions);

    const roleID = roles.find(e => e.title === answers.role).id;

    let managerID = "NULL";

    if(answers.manager != "None"){
        const names = answers.manager.split(' ');
        managerID = employees.find(e => e.first_name === names[0] && e.last_name === names[1]).employee_id;
    }

    await db.addEmployee(answers.fname, answers.lname, roleID, managerID);
}

const updateEmployeeRole = async db => {
    const empID = await chooseEmployee(db);
    const newRoleID = await chooseRole(db); 

    await db.updateEmployeeRole(empID, newRoleID);
}

const updateEmployeeManager = async db => {
    console.log("Choose which employee to update: ");
    const empID = await chooseEmployee(db);

    console.log("Choose their new manager: ");
    const mgrID = await chooseEmployee(db);

    if (empID === mgrID) {
        console.log("An employee cannot be their own manager");
        updateEmployeeManager(db);
    }
    else {
        db.updateEmployeeManager(empID, mgrID);
    }
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