const inquirer = require('inquirer');
const {validateName} = require('./util');

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

    await db.addDepartment(answer.deptName);
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

    const roleID = roles.find(e => e.title === answers.role).role_id;

    let managerID = null;

    if(answers.manager != "None"){
        const names = answers.manager.split(' ');
        managerID = employees.find(e => e.first_name === names[0] && e.last_name === names[1]).employee_id;
    }

    await db.addEmployee(answers.fname, answers.lname, roleID, managerID);
}


exports.addDept = addDept;
exports.addRole = addRole;
exports.addEmployee = addEmployee;