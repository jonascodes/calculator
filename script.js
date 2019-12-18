// add on-click event listener for each button
const container = document.querySelector('#grid-container');
let buttons = Array.from(container.childNodes);
buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        ProcessClick(e.target.id);
    });
});
let displayValue = 0;
UpdateDisplay(displayValue);

let a = 0;
let b = 0;
let myOperator = "";

// Operation functions
function Operate(a, b, myOperation) {
    return myOperation(a,b);
}
let add = function (a,b) {
    return a + b;
}
let substract = function(a,b) {
    return a - b;
}
let multiply = function(a,b) {
    return a * b;
}
let divide = function(a,b) {
    return a / b;
}

function UpdateDisplay(value) {

    displayFontSize = "100px";
    let str = 0;
    if (value >= Math.pow(10,10)) {
            
        // transform to 10th-power-illustration
        str = getPowerIllustration(value);
        displayFontSize = "60px"; 

    } else {

        str = addDelimiters(value.toString()); 
    
        if (str.length > 7) {
            
            if (str.length <= 13) {
                // fits in display with smaller font
                displayFontSize = "60px"; 

            } else {
                // does not fit due to decimals => can be rounded/cut
                displayFontSize = "60px";
                str = str.substr(0,12);
                // do not allow the last character to be a dot
                if (str.slice(-1) == ".") {
                    str = str.substr(0,11);
                } 
            }
        }
    }

    document.querySelector('#display').style.fontSize = displayFontSize;
    document.querySelector('#display').textContent = str;

};

function ProcessClick(btnID) {

    if (btnID == "display") {
        CopyToClipBoard();
    }

    if (btnID.search("btn-nr")>=0) {
        NumberClicked(btnID.slice(-1));
    }

    if (btnID.search("btn-op")>=0) {
        OperatorClicked(btnID.slice(-2));
    }
    if (btnID == "btn-equals") {
        EqualsClicked();
    }
    if (btnID == "btn-clear") {
        Clear();
    }
    
}

function Clear() {
    displayValue = 0;
    a = 0;
    b = 0;
    UpdateDisplay(displayValue);
}

function CopyToClipBoard() {
    alert ("Display content copied to clipboard (future feature)");
}

function NumberClicked(n) {
    if (displayValue == 0) {
        displayValue = parseInt(n);
    } else {
        displayValue = displayValue * 10 + parseInt(n);
    }
    UpdateDisplay(displayValue);
}

function OperatorClicked(op) {
    if (op == "pl") {myOperator = add;}
    if (op == "mi") {myOperator = substract;}
    if (op == "mu") {myOperator = multiply;}
    if (op == "di") {myOperator = divide;}

    a = displayValue;
    displayValue = 0;
}

function EqualsClicked() {
    b = displayValue;
    displayValue = Operate(a,b,myOperator);
    UpdateDisplay(displayValue);
}


function getPowerIllustration(value) {
    let power = 0;
    while (value >= 10) {
        value = value / 10;
        power++;
    }
    let str_number = (Math.round(1000000*value)/1000000).toString().substr(0,7);
    let str_power = power.toString();
    return str_number + "e" + str_power;  
}

function addDelimiters(str) {
    let result = "";
    if (str.search("\\.") >= 0) {
        split = str.split(".");
        return addDelimiters(split[0]) + "." + split[1];
    } else {
        while (str.length > 3) {
            result = "," + str.slice(-3) + result;
            str = str.substr(0,str.length - 3);
        } 
        result = str + result;
    }
    return result;
}