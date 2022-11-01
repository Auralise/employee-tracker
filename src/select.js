const inquirer = require('inquirer');

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

    return departments.find(e => e.department_name === answer.department).id;
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

    const answer = await inquirer.prompt(question);

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

    const answer = await inquirer.prompt(question);

    return roles.find(e => e.title === answer.role).role_id;
}


exports.chooseDepartment = chooseDepartment;
exports.chooseRole = chooseRole;
exports.chooseEmployee = chooseEmployee;
exports.chooseManager = chooseManager;