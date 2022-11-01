const inquirer = require('inquirer');
const {updateEmployeeNullRole} = require('./update');

const validateName = name => {
    if (name.length < 2)
        return "Name must be 2 or more characters long";
    else if (name.length > 30)
        return "Name must be less than 30 characters long";
    else
        return true;
}

const confirm = async () => {
    const question = [
        {
            type: "confirm",
            name: "confirm",
            message: "Are you sure?"
        }
    ];

    const answer = await inquirer.prompt(question);

    return answer.confirm;

}

const checkConsistency = async db => {
    console.log("Checking for employees without role...")
    const employeesNullRoles = await db.getEmployeesWithoutRole();
    if (employeesNullRoles.length > 0){
        console.log("Employees without role found. Please update them now.")
        for(const employee of employeesNullRoles){
            await updateEmployeeNullRole (db, employee);
        }
    }
    else {
        console.log('No employees found without a role.');
    }
}




exports.validateName = validateName;
exports.confirm = confirm;
exports.checkConsistency = checkConsistency;