var arrHead = new Array();
arrHead = [''];

// preps the space on page load
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    hideErrorExpression();
    document.getElementById("workspace").value = "";

    createTable();

    document.getElementById("workspace").onkeypress = function (e) {
        return processInputValues(event.key, 'input');
    };
});

// creates table for calculation history
function createTable() {
    var historyTable = document.createElement('table');
    historyTable.setAttribute('id', 'historyTable');
    historyTable.setAttribute('class', 'history-table');

    var tr = historyTable.insertRow(-1);

    for (var h = 0; h < arrHead.length; h++) {
        var th = document.createElement('th');
        th.innerHTML = arrHead[h];
        tr.appendChild(th);
    }

    var div = document.getElementById('history');
    div.appendChild(historyTable);
}

// adds new row to calculation history table
function addRow(calculation) {
    var historyTable = document.getElementById('historyTable');

    var count = historyTable.rows.length;
    var tr = historyTable.insertRow(count);
    tr = historyTable.insertRow(count);

    for (var c = 0; c < arrHead.length; c++) {
        var td = document.createElement('td');
        td = tr.insertCell(c);

        var ele = document.createElement('input');
        ele.setAttribute('type', 'text');
        ele.setAttribute('value', calculation);
        ele.setAttribute('readonly', true);
        ele.setAttribute('id', 'calc' + c);
        ele.setAttribute('class', 'calc' + c + ' history-item');
        td.appendChild(ele);

    }
}

// processes value when button is clicked
function buttonClick(value) {

    var funcOnly = /['sqrd'|sqrt]/g;
    var calculation = '', answer = '';
    var inputValidation;

    if (value.match(funcOnly) == null) {
        if (value != '=') {
            document.getElementById("workspace").value = (value == '^' ? (document.getElementById("workspace").value + (value+'2')):(document.getElementById("workspace").value + value));
        }
        else {
            hideErrorExpression();

            calculation = document.getElementById("workspace").value;
            if(calculation.includes('^')){
                calculation = calculation.replace('^2','^');
            }
            inputValidation = processInputValues(calculation, 'input');
            
            if (inputValidation !== 'invalid') {

                postFixNotation = processCalculation(calculation);
                answer = (postFixNotation != null ? solvePostFixNotation(postFixNotation) : 'error');
                
                if(checkNumeric(answer)){
                    if(calculation.includes('^')){
                        calculation = calculation.replace('^','^2');
                    }
                    addRow(calculation + ' = ' + (answer % 1 != 0 ? answer.toFixed(2) : answer.toFixed()));
                    document.getElementById("workspace").value = '';
                }
                else{
                    showErrorExpression('Malformed Expression');
                }
                
            }
        }
    }
}

// validates input value
function processInputValues(value, source) {

    var digitsOnly = /[1234567890.]/g;
    var operatorsOnly = /[+|-|/|*|%|(|)]/g;

    const inputValue = value.toLowerCase();
    var result;

    if (source == 'input') {
        if (inputValue.match(digitsOnly) != null || inputValue.match(operatorsOnly) != null || inputValue == '-') {
            result = true;
        } else {
            result = false;
        }

        if ((value.includes('(') && !value.includes(')')) || (!value.includes('(') && value.includes(')'))) {
            showErrorExpression('Invalid input value');
            result = 'invalid';
        }
        return result;
    }
    return '';
}

// removes spaces from the inputted values
function removeSpaces(arrayValues) {
    for (var i = 0; i < arrayValues.length; i++) {
        if (arrayValues[i] === "") {
            arrayValues.splice(i, 1);
        }
    }
    return arrayValues;
}

// validates if numeric value
function checkNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

// show error notification
function showErrorExpression(message){
    document.getElementById("notif").innerHTML = message;
    document.getElementById("notif").style.visibility = "visible";  
}

// hide  error notification
function hideErrorExpression(){
    document.getElementById("notif").style.visibility = "hidden"; 
}

// processes input value and generates postfix order
function processCalculation(value) {
    var outputQueue = "";
    var operatorStack = [];
    
    var digitsOnly = /[1234567890.]/g;
    var operatorsOnly = "^*/+-√%";

    var operators = {
        "√": { precedence: 4, associativity: "Right" },
        "^": { precedence: 4, associativity: "Left" },
        "%": { precedence: 3, associativity: "Left" },
        "/": { precedence: 3, associativity: "Left" },
        "*": { precedence: 3, associativity: "Left" },
        "+": { precedence: 2, associativity: "Left" },
        "-": { precedence: 2, associativity: "Left" }
    }

    val = value.replace(/\s+/g, "");
    value = val.split(/([\+\-\*\/\^\(\)\√\%])/);
    value = removeSpaces(value);

    for (var i = 0; i < value.length; i++) {
        var token = value[i];

        if (checkNumeric(token)) {
            outputQueue += token + " ";
        } else if (operatorsOnly.indexOf(token) !== -1) {

            if(token == '√' && value[i-1].match(digitsOnly)){
                outputQueue = null;
                break;
            }
            
            if(token == '^' && value[i+1] != null){
                if(value[i+1].match(digitsOnly)){
                    outputQueue = null;
                    break;
                }
            }
            
            if(outputQueue != null){
                var o1 = token;
                var o2 = operatorStack[operatorStack.length - 1];
                
                while (operatorsOnly.indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
                    outputQueue += operatorStack.pop() + " ";
                    o2 = operatorStack[operatorStack.length - 1];
                }
                
                operatorStack.push(o1); 
            }
        
        } else if (token === "(") {
            operatorStack.push(token);
        } else if (token === ")") {
            
            while (operatorStack[operatorStack.length - 1] !== "(") {
                outputQueue += operatorStack.pop() + " ";
            }
            operatorStack.pop();
        }
    }
    while (operatorStack.length > 0) {
        outputQueue += operatorStack.pop() + " ";
    }
    return outputQueue;
}

// evaluates postfix notation
function solvePostFixNotation(postfix) {

    var resultStack = [];
    postfix = postfix.split(" ");

    for (var i = 0; i < postfix.length; i++) {
        if (postfix[i] === "") {
            postfix.splice(i, 1);
        }
    }

    for (var i = 0; i < postfix.length; i++) {
        
        if (checkNumeric(postfix[i])) {
            resultStack.push(postfix[i]);
        } else {
            
            var a = resultStack.pop();
            var b = resultStack.pop();
            
            if (postfix[i] === "+") {
                resultStack.push(add(parseFloat(a), parseFloat(b)));
            } else if (postfix[i] === "-") {
                resultStack.push(sub(parseFloat(a), parseFloat(b)));
            } else if (postfix[i] === "*") {
                resultStack.push(multiply(parseFloat(a), parseFloat(b)));
            } else if (postfix[i] === "/") {
                resultStack.push(divide(parseFloat(b), parseFloat(a)));
            } else if (postfix[i] === "^") {
                resultStack.push(square(parseFloat(a)));
                if(b != null){resultStack.push(parseFloat(b))};
            } else if (postfix[i] === "√") {
                resultStack.push(sRoot(parseFloat(a)));
                if(b != null){resultStack.push(parseFloat(b))};
            }else if (postfix[i] === "%") {
                resultStack.push(mod(parseFloat(b), parseFloat(a)));
            }
        }
    }

    if (resultStack.length > 1) {
        return "error";
    } else {
        return resultStack.pop();
    }
}

// adds input values a and b
function add(a, b) {
    return a + b;
}

// subtracts input values b from a
function sub(a, b) {
    return b - a;
}

// multiplies input values a and b
function multiply(a, b) {
    return a * b;
}

// divides input values a by b
function divide(a, b) {
    return a / b;
}

// returns the square of value a
function square(a) {
    return a * a;
}

// returns the square root of a
function sRoot(a) {
    return Math.sqrt(a);
}

// returns the remainder value when a is divided by b
function mod(a,b) {
    return a % b;
}

// clears calculation history table
function clearMemory() {
   
    var historyTable = document.getElementById('historyTable');

    while (historyTable.rows.length > 0) {
        historyTable.deleteRow(0);
    }
}

// clears calculation area 
function clearArea() {
    document.getElementById("workspace").value = '';
}

