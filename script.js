
document.addEventListener('DOMContentLoaded', () => { 'use strict';

    document.getElementById("workspace").value = "";

    document.getElementById("workspace").onkeypress = function(e) { 
        return processInputValues(event,'input'); 
    };
});

function buttonClick(value){
    
    var funcOnly = /['sqrd'|sqrt|=]/g;
    
    if(value.match(funcOnly) == null){
        document.getElementById("workspace").value = (document.getElementById("workspace").value + value);
    }    
}

function processInputValues(event,source){
    
    var digitsOnly = /[1234567890]/g;
    var operatorsOnly = /[+|-|/|*|%|(|)]/g;

    const inputValue = event.key.toLowerCase(); 
    
    if(source == 'input'){
        if (inputValue.match(digitsOnly) != null || inputValue.match(operatorsOnly) != null) {
            return true;
        } else {
            return false;
        }
    }

    return '';
    
}

function add(a,b){
    // Addition
    // The addition (sum function) is used by clicking on the "+" button or using the keyboard. The function results in a+b.
    return a+b;
}

function sub(a,b){
    // Subtraction
    // The subtraction (minus function) is used by clicking on the "-" button or using the keyboard. The function results in a-b.
    return a-b;
}

function multiply(a,b){
    // Multiplication
    // The subtraction (minus function) is used by clicking on the "-" button or using the keyboard. The function results in a-b.
    return a*b;
}

function divide(a,b){
    // Division
    // The division (divide function) is used by clicking on the "/" button or using the keyboard "/" key. The function results in a/b.
    return a/b;
}

function negative(a){
    // Sign
    // The sign key (negative key) is used by clicking on the "(-)" button or using the keyboard "m"key. The function results in -1*x.
    return (-1*a);
}

function square(a){
    // Square
    // The square function is used by clicking on the "x^2" button or using the keyboard shortcut "s". The function results in x*x
    return a*a;
}

function sRoot(a){
    // Square Root
    // The square root function is used by clicking on the "x" button or using the keyboard shortcut "r". This function represents x^.5 where the result squared is equal to x.
    return Math.sqrt(a);
}

function mInverse(a){
    // Inverse
    // Multiplicative Inverse (reciprocal function) is used by pressing the "1/x" button or using the keyboard shortcut "i". This function is the same as x^-1 or dividing 1 by the number.
}

function exponent(a){
    // Exponent
    // Numbers with exponents of 10 are displayed with an "e", for example 4.5e+100 or 4.5e-100. This function represents 10^x. Numbers are automatically displayed in the format when the number is too large or too small for the display. To enter a number in this format use the exponent key "EE". To do this enter the mantissa (the non exponent part) then press "EE" or use the keyboard shortcut key "e" and then enter the exponent.
}

function percent(a){
    // Percent
    // The percent function is used by clicking on the "%" or using the keyboard. The percent function is used to add, subtract, multiply, or divide a percent of a number. It's used to calculate the percent of a number. Here are some examples:

    // 73+4.5% = 76.285.

    // 18/80% = 1.25.
}

// Memory Functions
// The memory functions allows you to store and recall calculations using a temporary stack storage element.

function addToMemory(){
    // The memory plus function is used by clicking on the "M+" button. This adds the value to whatever is stored in memory (initially this value is zero).
}

function removeFromMemory(){
    // The memory minus function is used by clicking on the "M-" button. This subtracts the value from whatever is currently stored in memory.
}

function recallCalc(){
    // The memory recall function is used by clicking on the "MR" button. This recalls the value from the memory and places it into the working area. The value is still kept in memory.
}

function clearMemory(){
    // To clear the memory value, click on the "clear" button twice.
}

function clearArea(){

}
    
