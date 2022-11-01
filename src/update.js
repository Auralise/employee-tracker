const {chooseEmployee, chooseRole} = require ('./select');

const updateEmployeeRole = async db => {
    const empID = await chooseEmployee(db);
    const newRoleID = await chooseRole(db); 

    await db.updateEmployeeRole(empID, newRoleID);
}

const updateEmployeeNullRole = async (db, employee) => {
    console.log('');
    console.log(`Updating null role for employee ID:${employee.id} ${employee.first_name} ${employee.last_name}`);
    console.log('');
    const newRoleID = await chooseRole(db);
    console.log('');
    await db.updateEmployeeRole(employee.id, newRoleID);
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

exports.updateEmployeeRole = updateEmployeeRole;
exports.updateEmployeeManager = updateEmployeeManager;
exports.updateEmployeeNullRole = updateEmployeeNullRole;