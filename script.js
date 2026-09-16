const input = document.querySelector('.input');
const result = document.querySelector('.result');
const realTimeResult = document.querySelector('.real-time-result');

// const Btns = document.querySelectorAll('.btn');

const actionBtn = document.querySelectorAll('.btn-action');
const operatorBtn = document.querySelectorAll('.btn-operator');
const numberBtn = document.querySelectorAll('.btn-number');

actionBtn.forEach(e => {
    e.addEventListener("click", () => {
        if(e.dataset.action === "clear") {
            input.textContent = "";
        } else if(e.dataset.action === "parenthesis") {
            Parenthesis();
        } else if(e.dataset.action === "del") {
            input.textContent = input.textContent.slice(0, -1);
        } else if(e.dataset.action === "equal") {
            calculate();
        }
    })
});

operatorBtn.forEach(e => {
    e.addEventListener("click", () => {
        const symbol = e.textContent;
        const isEmpty = input.textContent.length === 0;

        if(isEmpty) {
            if(symbol === "-") {
                input.textContent += symbol;
            }
        } else if(!isLastCharOperator()) {
            input.textContent += e.textContent;
        }
    })
});

numberBtn.forEach(e => {
    e.addEventListener("click", () => {
        input.textContent += e.textContent;
    })
});

const precedence = {
    '+': 2,
    '-': 2,
    '*': 3,
    '/': 3,
    '**': 4, 
};

/* Shunting-yard algorithm */
function calculate() {

    // Converting Infix Notation to Postfix Notation https://habr.com/ru/articles/489744/
    const expression = input.textContent.match(/\d+|[\+\-\*\/]|[\(\)]/g) || [];
    let stack = [];
    let queue = [];

    for(const token of expression) {
        if(!isNaN(token) && token.trim() !== "") {
            queue.push(token);
        } else if(token === "(") {
            stack.push(token);
        } else if(token === ")") {
            while(stack.length > 0 && stack[stack.length - 1] !== "(") {
                queue.push(stack.pop());
            }
            stack.pop();
        } else if(precedence[token]) {
            while(stack.length > 0 && precedence[stack[stack.length - 1]] >= precedence[token] && stack[stack.length - 1] !== "(") {
                queue.push(stack.pop());
            }
            stack.push(token);
        }
    }

    while(stack.length > 0) {
        queue.push(stack.pop());
    }

    console.log(queue);
    console.log(stack);

    let prevNumber = null;
    let currentNumber = null;
    let operator = null;

    for(const token of queue) {
        if(!isNaN(token)) {
            stack.push(token);
        } else if(precedence[token]) {
            currentNumber = stack.pop();
            prevNumber = stack.pop();
            operator = token;

            switch(operator) {
                case "+":
                    stack.push(prevNumber + currentNumber);
                    break;
                case "-":
                    stack.push(prevNumber - currentNumber);
                    break;
                case "*":
                    stack.push(prevNumber * currentNumber);
                    break;
                case "÷":
                    stack.push(prevNumber / currentNumber);
                    break;
                case "**":
                    stack.push(prevNumber ** currentNumber);
                    break;
                default:
                    break;
            }
        }
    }

}

function Parenthesis() {
    const openParen = input.textContent.split("(").length - 1;
    const closeParen = input.textContent.split(")").length - 1;

    if(openParen > closeParen) {
        input.textContent += ")";
    } else {
        input.textContent += "(";
    }
}

function isLastCharOperator() {
    const operatorSymbolsList = Array.from(operatorBtn).map(btn => btn.textContent);
    const text = input.textContent;
    if (text.length === 0) return false;

    const lastChar = text[text.length - 1];
    return operatorSymbolsList.includes(lastChar);
}

function displayLength() {
    const text = input.textContent;
    if(text.length > 20) {
        input.textContent = text.slice(0, -1);
    }
}

/*нельзя ставить точки подряд и не больше одном в одном числе*/
