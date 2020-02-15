var arrHead = new Array();
arrHead = [''];

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // document.getElementById("notif").style.visibility = "hidden";
    hideErrorExpression();
    document.getElementById("workspace").value = "";

    createTable();

    document.getElementById("workspace").onkeypress = function (e) {
        return processInputValues(event.key, 'input');
    };
});

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

function processInputValues(value, source) {

    var digitsOnly = /[1234567890.]/g;
    var operatorsOnly = /[+|-|/|*|%|(|)|%]/g;

    const inputValue = value.toLowerCase();
    var result;

    if (source == 'input') {
        if (inputValue.match(digitsOnly) != null || inputValue.match(operatorsOnly) != null) {
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

function removeSpaces(arrayValues) {
    for (var i = 0; i < arrayValues.length; i++) {
        if (arrayValues[i] === "") {
            arrayValues.splice(i, 1);
        }
    }

    return arrayValues;
}

function checkNumeric(value) {

    return !isNaN(parseFloat(value)) && isFinite(value);

}

function showErrorExpression(message){
    document.getElementById("notif").innerHTML = message;
    document.getElementById("notif").style.visibility = "visible";  
}

function hideErrorExpression(){
    document.getElementById("notif").style.visibility = "hidden"; 
}

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
                resultStack.push(sub(parseFloat(b), parseFloat(a)));
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

function add(a, b) {
    return a + b;
}

function sub(a, b) {
    return b - a;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function square(a) {
    return a * a;
}

function sRoot(a) {
    return Math.sqrt(a);
}

function mod(a,b) {
    return a % b;
}

function clearMemory() {
   
    var historyTable = document.getElementById('historyTable');

    while (historyTable.rows.length > 0) {
        historyTable.deleteRow(0);
    }
}

function clearArea() {
    document.getElementById("workspace").value = '';
}

