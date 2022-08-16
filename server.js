const inquirer = require("inquirer");
const consoleT = require("console.table");
//import connection.js
const db = require("./db/connection");
//port designation for server.js
const PORT = process.env.PORT || 3001;

db.connect(err => {
    if(err) throw err;
    console.log("Database Connected.");
    initalprompt();
});


const initalprompt = () => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "action",
          message: "What would you like to do?",
          choices: [
            "View all Departments",
            "Add a Department",
            "Delete a Department",
            "View all Roles",
            "Add a Role",
            "Delete a Role",
            "View all Employees",
            "Add an Employee",
            "Delete an Employee",
            "Update an Employee's Role",
            "Update Employee Managers",
            "Exit Employee Tracker",
          ],
          pageSize: 12
        },
      ])
      .then((answers) => {
        switch(answers.action) {
            case "View all Departments":
                viewDepartments();
                break;
            case "Add a Department":
                addDepartment();
                break;
            case "Delete a Department":
                deleteDepartment();
                break;
            case "View all Roles":
                viewRoles();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Delete a Role":
                deleteRole();
                break;
            case "View all Employees":
                viewEmployees();
                break;
            case "Add an Employee":
                addEmployees();
                break;
            case "Delete an Employee":
                deleteEmployee();
                break;
            case "Update an Employee's Role":
                updateRole();
                break;
            case "Update Employee Managers":
                updateManager();
                break;
            case "Exit Employee Tracker":
                console.log("Exiting employee tracker");
                db.end();
        }
      });
};
const viewDepartments = () => {
    const sql = `SELECT* FROM departments`

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        initalprompt();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "newDep",
            message: "Please enter the new department's name"
        }
    ]).then((answers) => {
        const sql = `INSERT INTO departments(name) VALUES (?)`;
        const name = answers.newDep

        db.query(sql, name, (err, result) => {
            if (err) throw err;
            console.log(`${name} department added`)
            initalprompt();
        });
    });
};

const deleteDepartment = () => {
    const sql = `SELECT* FROM departments`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "rmDep",
                message: "Which department would you like to delete?",
                choices: rows
            }
        ]).then((answers) => {
            const sql = `DELETE FROM departments WHERE name = ?`;
            const name = answers.rmDep
    
            db.query(sql, name, (err, result) => {
                if (err) {
                    res.status(400).json({ error: err.message})
                    return;
                }
                console.log(`${name} department was deleted`)
                initalprompt();
            });
        });
    });
};
const viewRoles = () => {
    const sql = `SELECT* FROM roles`

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        initalprompt();
    });
};
const addRole = () => {
    const sql = `SELECT* FROM departments`

    db.query(sql, (err, rows) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "department",
                message: "Which department is the role in?",
                choices: rows
            }
        ]).then((answers) => {
            const sql = `SELECT(departments.id) FROM departments WHERE name = ?`;
            const name = answers.department
    
            db.query(sql, name, (err, result) => {
                if (err) throw err;
                const id = result[0].id
                inquirer.prompt([
                    {
                        type: "input",
                        name: "newRoleName",
                        message: "Please enter the new Role's name",
                        loop: false
                    },
                    {
                        type: "input",
                        name: "newRoleSalary",
                        message: "Please enter the new Role's salary"
                    }
                ]).then((answers) => {
                    const sql = `INSERT INTO roles(title, salary, department_id) VALUES (?, ?, ?)`;
                    const params = [answers.newRoleName, answers.newRoleSalary, id]
                    console.log(params)

                    db.query(sql, params, (err, result) =>{
                        if (err) throw err;
                        initalprompt();
                    })
                })
                
            });
        })
    });
};
const deleteRole = () => {
    const sql = `SELECT roles.title AS name FROM roles`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "rmRole",
                message: "Which role would you like to delete?",
                choices: rows,
                pageSize: rows.length
            }
        ]).then((answers) => {
            const sql = `DELETE FROM roles WHERE title = ?`;
            const role = answers.rmRole
    
            db.query(sql, role, (err, result) => {
                if (err) throw err;
                console.log(`${role} was deleted from the database`)
                initalprompt();
            });
        });
    }); 
};
const viewEmployees = () => {
    const sql = `SELECT* FROM employees`

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows)
        initalprompt();
    });
};
const addEmployees = () => {
    const sql = `SELECT CONCAT(employees.first_name," ", employees.last_name) AS name FROM employees`

    db.query(sql, (err, rows) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "newEmpManag",
                message: "Who is the employee's manager?",
                choices: rows,
                pageSize: rows.length
            }
        ])
        .then((answers) => {
            const fname = answers.newEmpManag.split(" ")[0]
            const lname = answers.newEmpManag.split(" ")[1]
            const sql = `SELECT(employees.id) FROM employees WHERE first_name = "${fname}" AND last_name = "${lname}"`;
        
            db.query(sql, (err, result) => {
                if (err) throw err;
                manId = result[0].id 
            });
        })
        .then(() =>{
            const sql = `SELECT title AS name FROM roles`

            db.query(sql, (err, rows) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: "list",
                        name: "newEmpRole",
                        message: "What is the employee's role?",
                        choices: rows,
                        pageSize: rows.length
                    }
                ])
                .then((answers)=> {
                    console.log(answers)
                    const sql = `SELECT(roles.id) FROM roles WHERE title = ?`
                    const title = answers.newEmpRole
        
                    db.query(sql, title, (err, result) => {
                        if (err) throw err;
                        roleId = result[0].id
                        empinfo(); 
                    });
                }) 
            })
        })

    const empinfo = function() {
        inquirer.prompt([
            {
                type: "input",
                name: "newEmpfName",
                message: "What is the employee's first name?",
            },
            {
                type: "input",
                name: "newEmplName",
                message: "What is the employee's last name?",
            }
        ])
        .then((answers) => {
            const sql = `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
            const params = [answers.newEmpfName, answers.newEmplName, manId, roleId]
    
            db.query(sql, params, (err, result) => {
                if (err) throw err;
                initalprompt();
            })
        }); 
    } 
})};
const deleteEmployee = () => {
    const sql = `SELECT CONCAT(employees.first_name," ", employees.last_name) AS name FROM employees`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "rmEmp",
                message: "Which Employee would you like to delete?",
                choices: rows,
                pageSize: 10
            }
        ]).then((answers) => {
            const fname = answers.rmEmp.split(" ")[0]
            const lname = answers.rmEmp.split(" ")[1]
            const sql = `DELETE FROM employees WHERE first_name = "${fname}" AND last_name = "${lname}"`;
    
            db.query(sql, (err, result) => {
                if (err) throw err;
                console.log(`${name} was deleted from the database`)
                initalprompt();
            });
        });
    });
};

const updateRole = () => {
    const sql = `SELECT CONCAT(employees.first_name," ", employees.last_name) AS name FROM employees`

    db.query(sql, (err, rows) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "empNewRoleName",
                message: "Which employee would you like to update?",
                choices: rows,
                pageSize: rows.length
            }
        ])
        .then((answers)=> {
            newRolefName = answers.empNewRoleName.split(" ")[0]
            newRolelName = answers.empNewRoleName.split(" ")[1]
            const sql = `SELECT CONCAT(roles.id," ", roles.title) AS name FROM roles`
            
            db.query(sql, (err, rows) => {
                if (err) throw err;
                
                inquirer.prompt([
                    {
                        type: "list",
                        name: "empNewRole",
                        message: "What is their new role?",
                        choices: rows,
                        pageSize: rows.length
                    }
                ]).then((answers) =>{
                    const newEmpRoleId = answers.empNewRole.split(" ")[0]
                    const sql = `UPDATE employees SET role_id =?
                                WHERE first_name = "${newRolefName}" 
                                AND last_name = "${newRolelName}"`
                    const params = [newEmpRoleId];
                    db.query(sql, params, (err, rows) =>{
                        if (err) throw err;
                        initalprompt();
                    })
                }) 
            });
        })
    });
};
const updateManager = () => {
    const sql = `SELECT CONCAT(employees.first_name," ", employees.last_name) AS name FROM employees`

    db.query(sql, (err, rows) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "empNewManagName",
                message: "Which employee would you like to update?",
                choices: rows,
                pageSize: rows.length
            }
        ])
        .then((answers)=> {
            newManagfName = answers.empNewManagName.split(" ")[0]
            newManaglName = answers.empNewManagName.split(" ")[1]
            const sql = `SELECT CONCAT(employees.id," ", employees.first_name," ", employees.last_name) AS name FROM employees`
            
            db.query(sql, (err, rows) => {
                if (err) throw err;
                
                inquirer.prompt([
                    {
                        type: "list",
                        name: "empNewManager",
                        message: "Who is their new Manager?",
                        choices: rows,
                        pageSize: rows.length
                    }
                ]).then((answers) =>{
                    const empNewManagerId = answers.empNewManager.split(" ")[0]
                    const sql = `UPDATE employees SET manager_id =?
                                WHERE first_name = "${newManagfName}" 
                                AND last_name = "${newManaglName}"`
                    const params = [empNewManagerId];
                    db.query(sql, params, (err, rows) =>{
                        if (err) throw err;
                        initalprompt();
                    })
                }) 
            });
        })
    });
};


