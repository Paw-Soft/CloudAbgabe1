'use strict'

//Hilfsfunktionen

// extract ElementFrom XMLTag
const extractTextFromXML = (XMLString) => {
    let xmlTagOpenStr = `<ToDos>`;
    let xmlTagCloseStr = `</ToDos>`;

    return XMLString.slice(
        XMLString.indexOf(tag) + xmlTagOpenStr.length,
        XMLString.indexOf(xmlTagCloseStr))
        .trim();
}

// extract PropertiesArray From XMLTag
// <ToDo dateCreate = "17.12.2001" dateDeadline = "19.12.2001" prio = "1">
const extractPropertiesFromXML = (XMLString, tag) => {

    // prepare tagStrings
    let xmlTagOpenStr = `<${tag}`;
    let xmlTagCloseStr = `>`;


    // get String describing all properties
    let posTextOpen = XMLString.search(xmlTagOpenStr);
    let posTextOpenEnd = XMLString.indexOf(xmlTagCloseStr, posTextOpen);
    let propertiesString = XMLString.slice(
        posTextOpen + xmlTagOpenStr.length + 1,
        posTextOpenEnd);

    // extrat properties from String and return as an Array of properties                          
    return propertiesString.split(" ")
        .map(element => element.trim())
        .map(element => element.slice(
            element.indexOf('"') + 1,
            element.lastIndexOf('"'))
            .trim());
}

class MyToDos {
    constructor(name = "Nha-Dan Tran", description = "Nhani's ToDo List", user = 'nhani', toDos = []) {
        this._name = name;
        this._description = description;
        this._user = user;
        this._toDos = toDos;
    }
    get toDos() { return this._toDos };
    get name() { return this._name };
    get description() { return this._description };
    get user() { return this._user };

    set toDos(toDos) { this._toDos = toDos };
    set name(name) { this._name = name };
    set description(description) { this._description = description };
    set user(user) { this._user = user };

    add(toDo) {
        this._toDos.push(toDo);
    }
    remove(toDo) {
        this._toDos.splice(this._toDos.indexOf(toDo), 1);
    }

    filterToDos(priorityNumber) {
        const filteredToDos = this._toDos.filter(toDo => toDo.priority === priorityNumber);
        return filteredToDos;
    }

    sortToDos(criterium) {
        switch (criterium) {
            case "text":
                this.toDos.sort((a, b) => a.text > b.text);
                break;
            case "created":
                this.toDos.sort((a, b) => a.created.valueOf() - b.created.valueOf());
                return 0;
                break;
            case "deadline":
                this.toDos.sort((a, b) => a.deadline.valueOf() - b.deadline.valueOf());
                break;
            case 'priority':
                this.toDos.sort((a, b) => a.priority - b.priority);
                return 0;
                break;
            default:
                console.log("Entry not valid.");
        }
    }

    toXML() {
        const toDoListAsXML = function (result, curToDo, index, toDos) {
            return result + curToDo.toXML()
        };
        return `<ToDos name = "${this._name}" description = "${this._description}"  user = "${this._user}" >${this._toDos.reduce(toDoListAsXML, "")}</ToDos>`;
    }

    static fromXML(xmlString) {

        let properties = extractPropertiesFromXML(xmlString);
        let [name, description, user] = properties;

        let toDos = [];
        let remainingStr = xmlString;

        let nextToDoPosEnd;
        let nextToDoPosStart;

        nextToDoPosStart = remainingStr.indexOf('<ToDo');
        while (nextToDoPosStart != -1) {

            nextToDoPosEnd = remainingStr.indexOf('/ToDo>') + '/ToDo>'.length;
            let nextToDoXMLStr = remainingStr.slice(nextToDoPosStart, nextToDoPosEnd);
            let toDo = ToDo.fromXML(nextToDoXMLStr);
            toDos.push(toDo);
            remainingStr = remainingStr.slice(nextToDoPosEnd)
            nextToDoPosStart = remainingStr.indexOf('<ToDo');
        }

        let newToDos = new MyToDos(name, description, user, toDos);

        return newToDos;
    }

    toString() {
        let l = 0;
        return `
        Name of ToDoList: ${this._name},
        Description: ${this._description},
        User: ${this._user},
        ToDos: 
        ╭━ ⋅𖥔⋅ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ✶ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ⋅𖥔⋅ ━╮
        ${this._toDos.reduce(
            (result, toDo, index, toDos) => result + toDo.toString(),
            ""
        )},
        ╰━ ⋅𖥔⋅ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ✶ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ⋅𖥔⋅ ━╯`
    }
}

class ToDo {
    constructor(text = "New Task", created = Date.now(), deadline = new Date(), priority = 1) {
        this._text = text;
        this._created = created;
        this._deadline = deadline;
        this._priority = priority;


    }

    get created() { return this._created; }
    get deadline() { return this._deadline; }
    get priority() { return this._priority; }
    get text() { return this._text; }

    set deadline(deadline) { this._deadline = deadline; }
    set priority(priority) { this._priority = priority; }

    toXML() {
        return `\n<ToDo created="${this._created.valueOf()}" deadline="${this._deadline.valueOf()}" priority="${this._priority}"><Text>${this._text}</Text></ToDo>\n        `;
    }

    toString() {
        return `
        Created: ${this._created},
        Deadline: ${this._deadline},
        Priority: ${this._priority},
        Text: ${this._text}\n`
    }
}

//CLass End

//Testobjekte

let myToDos = new MyToDos(
    'Nha-Dan Tran',
    'Things I have to do',
    'nhani',
    [
        new ToDo('learn', new Date('2020 June 20'), new Date('2020 June 24'), 3),
        new ToDo('eat', new Date('2020 June 21'), new Date('2020 September 22'), 1),
        new ToDo('learn', new Date('2020 June 23'), new Date('2020 October 21'), 2),
        new ToDo('cry', new Date('2020 June 22'), new Date('2020 November 28'), 2),
        new ToDo('sleep on my desk', new Date('2020 June 25'), new Date('2020 December 25'), 3),
        new ToDo('repeat', new Date('2020 June 24'), new Date('2020 January 26'), 1)
    ]);


drawTableFn();
// Test Ende

let textInputEl = document.getElementById('textInput');
let createdInputEl = document.getElementById('createdInput');
let deadlineInputEl = document.getElementById('deadlineInput');
let priorityInputEl = document.getElementById('priorityInput');



function validateFn(textEl, createdEl, deadlineEl, priorityEl) {
    let createdDate = new Date(createdEl.value);
    let deadlineDate = new Date(deadlineEl.value);
    let priorityInt = parseInt(priorityEl.value);
    let textStr = textInputEl.value;

    if (isNaN(createdDate.valueOf())) {
        alert('Invalid Date Format for created date.');
        return false;
    }
    if (isNaN(deadlineDate.valueOf())) {
        alert('Invalid Date Format for deadline date.')
        return false;
    }
    if (priorityInt > 3 || priorityInt < 1 || isNaN(priorityInt)) {
        alert("Priority should be a number between 1 - 3.");
        return false;
    }
    if (!textStr) //@toDo - keine doppelte Namen 
    {
        alert("Taskname shouldn't be empty.");
        return false;
    }
    let confirmation = confirm(
    `Created Date: ${createdDate}
    Deadline Date: ${deadlineDate}
    Priority: ${priorityInt.toString()}
    To Do: ${textStr}
    
    Is this correct? `);
    if (confirmation) {
        createToDoFn(textStr, createdDate, deadlineDate, priorityInt);
    }
    return true;
}

function createToDoFn(text, created, deadline, priority) {
    let newToDo = new ToDo(text, created, deadline, priority);
    myToDos.add(newToDo);
    console.log(newToDo);
    newToDo.toXML();
}

function drawTableFn(filteredToDoList = myToDos.toDos) {
    let htmlString = "";
    for (let iToDo = 0; iToDo < filteredToDoList.length; iToDo++) {
        let curToDo = filteredToDoList[iToDo];
        htmlString += `<tr>
                        <td>
                            ${curToDo.text}
                        </td>
                        <td>
                            ${ curToDo.created.getFullYear()}-${curToDo.created.getMonth() + 1}-${curToDo.created.getDate()}
                        </td>
                        <td>
                            ${ curToDo.deadline.getFullYear()}-${curToDo.deadline.getMonth() + 1}-${curToDo.deadline.getDate()}
                        </td>
                        <td>
                            ${curToDo.priority}
                        </td>
                        <td>
                        <button type="button" todo-index="${iToDo}" onclick="deleteToDoFn()">Delete</button>
                        </td>
                     </tr>`;
        document.getElementById('toDoList').innerHTML = htmlString;
    }
}

function getToDosFromString(userInput, userList) {
    let splitString = userInput.split(",");
    try {
        let newToDo = new ToDo(
            splitString[0],
            new Date(splitString[1]),
            new Date(splitString[2]),
            splitString[3]);
        if (newToDo.isValid()) {
            userList.add(newToDo);
        }

    }
    catch (error) {
        if (error instanceof RangeError) {
            alert(error);
        }
    }
}

function submitToDoFn() {
    let textStr = document.getElementById('textInput').value;
    validateFn(textInputEl, createdInputEl, deadlineInputEl, priorityInputEl);
    saveToDoListFn();
    drawTableFn();
}

function saveToDoListFn() {
    let curToDoList = myToDos.toXML();
    localStorage.setItem('savedToDoLists', curToDoList);
}

function deleteToDoFn() {//toDoIndex) {
    let curEl = event.currentTarget;
    let indexOfToDo = curEl.getAttribute('todo-index');
    myToDos.remove(myToDos.toDos[indexOfToDo]);
    saveToDoListFn();
    drawTableFn();
}

function filterToDosFn() {
    let filterByPriorityEl = document.getElementById('filterPriorityInput');
    let filterByPriorityValue = filterByPriorityEl.value;


    if (isNaN(filterByPriorityValue)) {
        alert('Please enter valid number.');
        return;
    }
    let filterByPriorityInt = parseInt(filterByPriorityValue);

    if (filterByPriorityInt > 3 || filterByPriorityInt < 1) {
        alert('Please enter valid number between 1-3');
        return;
    }  
    let filteredToDoList = myToDos.filterToDos(filterByPriorityInt);
    drawTableFn(filteredToDoList);
}
function sortToDos() {
    let sortingValueEl = document.getElementById('sortSelect');
    let sortingValue = sortingValueEl.value;
    myToDos.sortToDos(sortingValue);
    drawTableFn();
}

function clearFn() {
    myToDos.sortToDos('created');
    drawTableFn();
}


//Show toDos
// console.log(myToDos);

// Filter by priority = 1 
// console.log('My filtered ToDos (3)');
// console.log(myToDos.filterToDos(3));

// Sort toDos
// console.log('My sorted ToDos');
// console.log(myToDos.sortToDos('deadline'));
