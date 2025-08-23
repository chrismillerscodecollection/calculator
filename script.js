// Functions for performing basic arithmetic
function add(a, b) { return a + b };

function subtract(a, b) { return a - b };

function multiply(a, b) { return a * b };

function divide(a, b) { return b > 0 ? a / b : "Cannot divide by zero." };

function updateDisplay(input) {
    calcState.display = input;
    calcDisplay.textContent = calcState.display;
}

// When a user clicks 'AC' on the keyboard or presses the escape key on the keyboard
function resetCalcState() {
    calcState.display = "0",
    calcDisplay.textContent = calcState.display,
    calcState.buildingFirstNumber = false,
    calcState.buildingSecondNumber = false,
    calcState.firstNumber = "0",
    calcState.secondNumber = "0",
    calcState.operator = null,
    calcState.decimalPointEntered = false
};


function operate(firstNumber, operator, secondNumber) {
    
    firstNumber = parseFloat(firstNumber);
    secondNumber = parseFloat(secondNumber)
    let result;

    switch (operator) {
        case "+":
            result = add(firstNumber, secondNumber);
            break;
        case "-":
            result = subtract(firstNumber, secondNumber);
            break;
        case "/":
            result = divide(firstNumber, secondNumber);
            break;
        case "*":
            result = multiply(firstNumber,secondNumber);
            break;
        }
    
    resetCalcState();

    roundedResult = result.toFixed(2);

    if (validOperators.includes(calcState.lastInput)) {
        calcState.buildingFirstNumber = false;
        calcState.buildingSecondNumber = true;
        calcState.operator = calcState.lastInput;
    
    } else {
        calcState.buildingFirstNumber = true;   
    }

    calcState.firstNumber = roundedResult;

    return roundedResult;
}

function handleInput(input) {
    let result = null;
    let inputType = null;

     if (input === "AC" || input === "Escape") {
        resetCalcState();
    
    } else if (validNumbers.includes(input)) {
        inputType = "number";
    
    } else if (validOperators.includes(input)) {
        inputType = "operator";
    
    }

    // We have multiple start cases we need to account for as well as multiple edge cases
    
    // Start case 1: user starts with a decimal point (e.g. ".")
    if (!calcState.buildingFirstNumber && !calcState.buildingSecondNumber && input === ".") {
        calcState.decimalPointEntered = true;
        calcState.buildingFirstNumber = true;
        calcState.firstNumber = input;
        updateDisplay(input);

    // Start case 2: user starts with a number (e.g. "1")
    } else if (!calcState.buildingFirstNumber && !calcState.buildingSecondNumber && inputType === "number") {
        calcState.buildingFirstNumber = true;
        calcState.firstNumber = input;
        updateDisplay(calcState.firstNumber);
    
    // Edge case 1: an operator is set and the user has entered another operator (e.g. ["+", "+"], ["+", "-""])
    } else if (calcState.operator !== null && calcState.lastInput === validOperators.includes(input)) {
        return;
    
    // Edge case 2: user enters a decimal point after a decimal point has already been entered (e.g. [".", "."] or  ["." , "2", "4", "."])
    } else if (calcState.decimalPointEntered && input === ".") {
        return; 
    
    } else if (!calcState.buildingFirstNumber && !calcState.buildingSecondNumber && inputType === "operator") {
        return;
    
    // Happy case 1: user enters a decimal
    } else if (input === ".") {
        calcState.decimalPointEntered = true;
        
        if (calcState.buildingFirstNumber) {
            calcState.firstNumber += input;
            updateDisplay(calcState.firstNumber);
        
        } else if (calcState.buildingSecondNumber) {
            calcState.secondNumber += input;
            updateDisplay(calcState.secondNumber);
         } 
    
    } else if (inputType === "number") {
    
        if (calcState.buildingFirstNumber) {
            calcState.firstNumber += input;
            updateDisplay(calcState.firstNumber);
        
        } else if (calcState.buildingSecondNumber) {
            calcState.secondNumber += input;
            updateDisplay(calcState.secondNumber);
        }

    } else if (inputType === "operator") {
        
        if (calcState.buildingFirstNumber) {
            calcState.buildingFirstNumber = false;
            calcState.buildingSecondNumber = true;
            calcState.operator = input;
            calcState.decimalPointEntered = false;
            updateDisplay(input);
        
         } else if (calcState.buildingSecondNumber) {
            calcState.lastInput = input;
            result =  operate(calcState.firstNumber, calcState.operator, calcState.secondNumber);
            updateDisplay(result);
        }
       
    }

    calcState.lastInput = input;
}

// In order to implement the logic for the calculator, we need to track certain values
// We track these important values in calcState
const calcState = {
    display: "0",
    operator: null,
    buildingFirstNumber: false,
    buildingSecondNumber: false,
    firstNumber: "0",
    secondNumber: "0",
    decimalPointEntered: false
}

const validNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const validOperators = ["+", "-", "*", "/", "=", "Escape", "AC", "."];

const body = document.querySelector("body");
let calcDisplay = document.querySelector(".calc-display");
const calcButtons = document.querySelector(".calc-buttons");
const calcButtonsChildren = calcButtons.children;
const equalSignButton = document.getElementById("=");

calcButtons.addEventListener("click", (e) => {
    handleInput(e.target.textContent);
});

// To add keyboard functionality, we add an event listener to the keydown event
// The event is added to the body of the page so the user can click anywhere on the page and still press a key
body.addEventListener("keydown", (e) => {
    console.log(e.key);
    // For proper keyboard functionality, we need to check if the user pressed a valid key
    // We can do this by checking if the button the user pressed Enter, Backspace, or is a child of the of the .calc-buttons class
    if (e.key === "Enter") {
        //equalSignButton.toggle('active');
        equalSignButton.classList.toggle('active');
        handleInput(e.key);
        setTimeout(() => {
            equalSignButton.classList.remove('active');
        }, 50);
    }

    // The calcButtonChildren variable is an object, so we need to loop through the values
    for (let button of calcButtonsChildren) {
        if (button.textContent === e.key) {
            button.classList.toggle('active'); // When the user presses a valid key, we need to toggle the styling for a key press
            console.log(e.key);
            handleInput(e.key);
            setTimeout(() => {
                button.classList.remove('active');
            }, 50); // Pressed key animation is time bound
        }
    }
});