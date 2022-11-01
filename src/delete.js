const inquirer = require('inquirer');

const {checkConsistency, confirm} = require('./util');

const deleteDepartment = async db => {
    const departments = await db.getDepartments();
    const choices = [];
    departments.forEach(e => choices.push(e.department_name));

    const question = [
        {
            type: "list",
            name: "department",
            message: "Which department do you want to delete?",
            choices: choices
        }
    ];

    const answers = await inquirer.prompt(question);

    console.log('');

    
    if (await confirm()){
        const deptID = departments.find(e => e.department_name === answers.department).id;
        await db.deleteDepartment(deptID);
        checkConsistency(db);
    }
    else {
        console.log(`User aborted... ${answers.department} was not deleted`)
    }

}

const deleteRole = async db => {
    const roles = db.getRoles();
    const choices = [];
    roles.forEach(e => choices.push(e.title));

    const question = [
        {
            type: "list",
            name: "role",
            message: "Which role do you want to delete? ",
            choices: choices
        }
    ];

    const answers = await inquirer.prompt(question);

    if (await confirm()){
        const roleID = roles.find(e => e.title === answers.role).role_id;
        await db.deleteRole(roleID);
        checkConsistency(db);
    }
    else {
        console.log(`User aborted... ${answers.role} has not been deleted`);
    }
}

const deleteEmployee = async db => {
    const employees = await db.getEmployees();
    const choices = []; 
    employees.forEach(e => choices.push(`ID:${e.employee_id} ${e.first_name} ${e.last_name}`));

    const question = [
        {
            type: "list",
            name: "employee",
            message: "Which employee do you want to delete? ",
            choices: choices
        }
    ];

    const answers = await inquirer.prompt(question);

    if (await confirm()){
        const empID = answers.employee.split(" ")[0].split(":")[1];
        await db.deleteEmployee(empID);
    }
    else {
        console.log(`User aborted... ${answers.employee} was not deleted`);
    }
}

exports.deleteDepartment = deleteDepartment;
exports.deleteRole = deleteRole;
exports.deleteEmployee = deleteEmployee;

