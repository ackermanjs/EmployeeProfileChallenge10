const inquirer = require("inquirer");

const fs = require("fs");

const Intern = require("./lib/Intern");
const Engineer = require("./lib/Engineer");
const Manager = require("./lib/Manager");
const employee = require("./lib/Employee")

const HTML = require("./dist/index.html");


function runPrompt() {
  const questionArray = [
    {
      type: "input",
      message: "What is the employee's name?",
      name: "name",
    },
    {
      type: "input",
      message: "What is the employee's ID Number?",
      name: "id",
    },
    {
      type: "input",
      message: "What is the employee's email address?",
      name: "email",
    },
    {
      type: "list",
      message: "What is the employee's position?",
      choices: ["Manager", "Engineer", "Intern"],
      name: "position",
    },
  ];

  return inquirer.prompt(questionArray);
}

function runPromptIfManager() {
  const questionArray = [
    {
      type: "input",
      message: "What is the manager's contact number?",
      name: "managerContact",
    },
  ];

  return inquirer.prompt(questionArray);
}

function runPromptIfEngineer() {
  const questionArray = [
    {
      type: "input",
      message: "Provide the URL to the employee's GitHub.",
      name: "github",
    },
  ];

  return inquirer.prompt(questionArray);
}

function runPromptIfIntern() {
  const questionArray = [
    {
      type: "input",
      message: "Where did the employee attend school?",
      name: "internSchool",
    },
  ];

  return inquirer.prompt(questionArray);
}

async function startInquiry() {
    let teamMemberArray = [];
    const teamSize = 5;
    for (i = 0; i < teamSize; i++) {
        const promise = new Promise((resolve, reject) => {
            runPrompt()
                .then(function ({ name, id, email, position }) {

                    if (position === "Manager") {
                        runPromptIfManager().then(function ({ managerContact }) {
                            this.employee = new Manager(name, id, email, managerContact, position);
                            console.log(managerContact);
                            teamMemberArray.push(employee);
                            resolve("done");
                        });

                    } else if (position === "Engineer") {
                        runPromptIfEngineer().then(function ({ github }) {
                            this.employee = new Engineer(name, id, email, github, position);
                            console.log(github);
                            teamMemberArray.push(employee);
                            resolve("done");
                        });
                    } else if (position === "Intern") {
                        runPromptIfIntern().then(function ({ internSchool }) {
                            this.employee = new Intern(name, id, email, internSchool, position);
                            console.log(internSchool);
                            teamMemberArray.push(employee);
                            resolve("done");
                        });
                    }

                }).catch(function (err) {
                    console.log("Inquirer encountered a problem!");
                    console.log(err);
                });
        });

        const Results = await promise;
        console.log(Results);
    }
    function addPosition(employee) {
        if (employee.position === "Manager") {
            return `office number: ${employee.managerContact}`;
        }

        if (employee.position === "Intern") {
            return `school: ${employee.internSchool}`;
        }

        if (employee.position === "Engineer") {
            return `gitHub: ${employee.github}`;
        }
        function populateHTML() {
            let htmlInsert = HTML;
            for (j = 0; j < teamSize; j++) {
                console.log(teamMemberArray[j])
                html += `<div class="card bg-dark justify-content-center align-items-center" style="width: 18rem;">
                    <div class="col card-header">
                        <h4>${teamMemberArray[j].name}</h4>
                    </div>
                    <div class="col card-header">
                        <h4>${teamMemberArray[j].title}</h4 >
                    </div >
                    <ul class="list-group list-group-flush text">
                        <li class="list-group-item">ID: ${teamMemberArray[j].id}</li>
                        <li class="list-group-item">Email: ${teamMemberArray[j].email}</li>
                        <li class="list-group-item"> ${displayTitle(teamMemberArray[j])}</li>
                    </ul>
                </div > `;
            }
            return html;
        }

        fs.writeFile('newfile.html', html, function (err) {
            if (err) throw err;
            console.log('The profile has been created.');
        });
    }
    startInquiry()
    