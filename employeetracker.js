// insert package files to file
const mysql= require("mysql");
const inquirer= require("inquirer");
const consoleTable= require("console.table");

// connection to sql database
const connection= mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'Khanshome1!',
        database: 'employee_db'
      });

    connection.connect(function(err) {
        if (err) throw err;
        employeePage();
    },
    
function employeePage() {
       inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like to do? ",
      name: "functions",
      choices: [
        "View all employees",
        "View all departments",
        "View all roles",
        "Add an employee",
        "Add a department",
        "Add a role",
        "Update employee role",
        "exit"

    ]}])})

.then(function (answer) {})
switch (answer.action) {
    case "View all employees":
            viewEmployees();
             break;
        case "View all departments":
            viewDepartments();
            break;
        case "View all roles":
            viewRoles();
            break;
        case "Add an employee":
            addEmployee();
            break;
        case "Add department":
            addDepartment();
            break;
        case "Add a role":
            addRole();
            break;
        case "Update employee role": 
            updateRole();
            break;
         case "EXIT": 
            endPage();
            break;
        default:
            break;
    }

    function viewEmployees() {
        var query = "SELECT * FROM employees";
        connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(res.length + " employees found!");
        console.table('All Employees:', res); 
        employeePage();
        })
    }

    function viewDepartments() {
        var query = "SELECT * FROM department";
        connection.query(query, function(err, res) {
        if (err) throw err;
        console.table('All Departments:', res); 
        employeePage();
        })
    }

    function viewRoles() {
        var query = "SELECT * FROM role";
        connection.query(query, function(err, res) {
        if (err) throw err;
        console.table('All Roles:', res); 
        employeePage();
        })
    }

    function addEmployee() {
        var query = "SELECT * FROM department";
        connection.query(query, function(err, res) {
            inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input", 
                    message: "Employee's fist name: ",
                },
                {
                    name: "last_name",
                    type: "input", 
                    message: "Employee's last name: "
                },
                {
                    name: "role", 
                    type: "list",
                    choices: function() {
                    var roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                    },
                    message: "What is this employee's role? "
                }
                ]).then(function (answer) {
                    let roleID;
                    for (let j = 0; j < res.length; j++) {
                    if (res[j].title == answer.role) {
                        roleID = res[j].id;
                        console.log(roleID)
                    }                  
                    }  
                    connection.query(
                    "INSERT INTO employees SET ?",
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: roleID,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Your employee has been added!");
                        employeePage();
                    }
                    )
                })
        })
    }

    function addDepartment() {
        inquirer
        .prompt([
            {
                name: "new_dept", 
                type: "input", 
                message: "add a new Department?"
            }
        ]).then(function (answer) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.new_dept
                }
            );
              var query = "SELECT * FROM department";
            connection.query(query, function(err, res) {
            if(err)throw err;
            console.table('All Departments:', res);
            employeePage();
            })
        })
    }

    function addRole() {
        connection.query("SELECT * FROM department", function(err, res) {
            if (err) throw err;
            
            inquirer
            .prompt([
                {
                     name: "new_role",
                    type: "input", 
                    message: "What is the Title of the new role?"
                },

                {
                    name: "deptChoice",
                    type: "rawlist",
                    choices: function() {
                        var deptArry = [];
                        for (let i = 0; i < res.length; i++) {
                        deptArry.push(res[i].name);
                        }
                        return deptArry;
                    },
                }
            ]).then(function (answer) {
                let deptID;
                for (let j = 0; j < res.length; j++) {
                    if (res[j].name == answer.deptChoice) {
                        deptID = res[j].id;
                    }
                }
        
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.new_role,
                        salary: answer.salary,
                        department_id: deptID
                    },
                    function (err, res) {
                        if(err)throw err;
                        console.log("new role has been added!");
                        employeePage();
                    }
                )
            })
            })
            
        }

        function updateRole() {
        console.log('Updating employee role');
  inquirer
    .prompt({
      name: "id",
      type: "input",
      message: "Enter employee id",
    })
    .then(function (answer) {
      var id = answer.id;

      inquirer
        .prompt({
          name: "roleId",
          type: "input",
          message: "Enter role id",
        })

        .then(function (answer) {
          var roleId = answer.roleId;

          var query = "UPDATE employee SET role_id=? WHERE id=?";
          connection.query(query, [roleId, id], function (err, res) {
            if (err) {
              console.log(err);
            }
            employeePage();
          });
        });
    });
}

        function endPage () {
            connection.end();
        }