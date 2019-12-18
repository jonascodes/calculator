// add on-click event listener for each button
const container = document.querySelector('#grid-container');
let buttons = Array.from(container.childNodes);
buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        ProcessClick(e.target.id);
    });
});


let a = 0;
let b = 0;
let myOperator = "";
let operatorActive = false;
let equalsRepeat = false;
let enterDecimal = false;
let enterDecinalCount = 0;

let displayValue = 0;
UpdateDisplay(displayValue);

// Operation functions
function Operate(a, b, myOperation) {
    if (myOperation == divide && b == 0) {
        return "error";
    } 
    if (myOperation == "") {return b;}
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
    if (value == "error") {
        str = "error";
    } else {
        if (Math.abs(value) >= Math.pow(10,10)) {
                
            // transform to 10th-power-illustration
            if (value > 0) {
                str = getPowerIllustrationPositive(value);
            } else {
                str = "-" + getPowerIllustrationPositive(value * (-1));
            }
            displayFontSize = "60px"; 

        } else if (value > 0 && value <= Math.pow(10,-6)) { 
            // transform to 10th-power-illustration
            str = getPowerIllustrationNegative(value);
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
    }

    // hack: if number has a decimal, remove zeros from right side
    if (str.search("\\.") >= 0)  {
        str = RemoveZeros(str);
    }   
    document.querySelector('#display').style.fontSize = displayFontSize;
    document.querySelector('#display').textContent = str;

};

function ProcessClick(btnID) {
    if (btnID == "btn-equals") {
        enterDecimal = false;
        operatorActive = false;
        deactivateAllOperatorBtns();   
        enterDecinalCount = 0;        
        EqualsClicked();
    }
    if (btnID == "display") {
        CopyToClipBoard();
    }

    if (btnID.search("btn-nr")>=0) {
        NumberClicked(btnID.slice(-1));
        equalsRepeat = false;
        operatorActive = false;
        deactivateAllOperatorBtns();   
    }

    if (btnID.search("btn-op")>=0) {
        deactivateAllOperatorBtns();   
        enterDecimal = false;
        enterDecinalCount = 0;        
        OperatorClicked(btnID.slice(-2), operatorActive);
        document.querySelector("#"+btnID).classList.add("active");
        equalsRepeat = false;
        operatorActive = true;
    }

    if (btnID == "btn-clear") {
        enterDecimal = false;
        enterDecinalCount = 0;
        Clear();
        equalsRepeat = false;
        operatorActive = false;
        deactivateAllOperatorBtns();   
    }
    if (btnID == "btn-sign") {
        enterDecimal = false;
        enterDecinalCount = 0;        
        reverseSign();
    }
    if (btnID == "btn-percent") {
        divideByHundered();
        operatorActive = false;
        deactivateAllOperatorBtns();   
    } 
    if (btnID == "btn-decimal") {
        DecimalClicked();
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
    if (enterDecimal) {
        displayValue = displayValue + n / Math.pow(10, enterDecinalCount + 1);
        enterDecinalCount++;   
    } else {
        if (equalsRepeat) {
            displayValue = parseInt(n);
            equalsRepeat = false;
            myOperator = "";    
        } else {
            if (displayValue == 0) {
                displayValue = parseInt(n);
            } else {
                displayValue = displayValue * 10 + parseInt(n);
            }
        }
    }
    UpdateDisplay(displayValue);
}

function OperatorClicked(op) {
    if (op == "pl") {myOperator = add;}
    if (op == "mi") {myOperator = substract;}
    if (op == "mu") {myOperator = multiply;}
    if (op == "di") {myOperator = divide;}

    if (!operatorActive) {
       a = displayValue;
        displayValue = 0;
    }
}

function EqualsClicked() {
    b = displayValue;
    if (equalsRepeat) {
        displayValue = Operate(a,last_b,myOperator);
    } else {
        displayValue = Operate(a,b,myOperator);
        last_b = b;
    }
    UpdateDisplay(displayValue);
    equalsRepeat = true;
    a = displayValue;
}


function getPowerIllustrationPositive(value) {
    let power = 0;
    while (value >= 10) {
        value = value / 10;
        power++;
    }
    let str_number = (Math.round(1000000*value)/1000000).toString().substr(0,7);
    let str_power = power.toString();
    return str_number + "e" + str_power;  
}

function getPowerIllustrationNegative(value) {
    // java uses e-x illustration as well
    let str = value.toString();
    let pos = str.search("e");
    return str.substr(0,Math.min(pos,7)) + str.slice(-(str.length-pos));    
}

function addDelimiters(str) {
    let result = "";
    if (str.substr(0,1) == "-") {
        return "-" + addDelimiters(str.substr(1,str.length-1));
    } else {
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
}

function reverseSign() {
    displayValue = displayValue * (-1);
    UpdateDisplay(displayValue);
};

function divideByHundered() {
    // from OperatedClicked
    myOperator = divide;
    a = displayValue;
    displayValue = 0;

    // from EqualsClicked
    b = 100;
    displayValue = Operate(a,b,myOperator);
    last_b = b;
    UpdateDisplay(displayValue);
    equalsRepeat = true;
    a = displayValue;
};

function DecimalClicked() {
    enterDecimal = true;
    //document.querySelector('#btn-decimal').style.backgroundColor = "rgb(0,0,0)";
    if (equalsRepeat) {
        equalsRepeat = false;
        myOperator = "";
        displayValue = 0;    
    }
}

function deactivateAllOperatorBtns() {
    document.querySelector("#btn-op-pl").classList.remove("active");
    document.querySelector("#btn-op-mi").classList.remove("active");
    document.querySelector("#btn-op-di").classList.remove("active");
    document.querySelector("#btn-op-mu").classList.remove("active");
}

  
function RemoveZeros(str) {
    while (str.slice(-1) == "0") {
        str = str.substr(0,str.length-1);
    }
    return str;
} 
