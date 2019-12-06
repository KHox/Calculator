function createButton(value) {
  return isNumeric(value) ? new NumberButton(value) :
    value.length > 1 ? new FunctionButton(value) :
    toClient(value) ? new OperatorButton(value) :
    isFuncSymb(value) ? new VariableButton(value) :
    new Button(value);
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

let toClient = (function() {
  let o = {
    '*': '×',
    '/': '÷',
    '-': '−',
    '+': '+',
    '.': ','
  };
  return v => o[v];
})();

let toCode = (function() {
  let o = {
    '×': '*',
    '÷': '/',
    '−': '-',
    '+': '+',
    ',': '.'
  };
  return v => o[v];
})();

let isFuncSymb = s => isNaN(s) && !toCode(s) && s != '(' && s != ')';

function getTextWidth(text) {
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = "Arial 60px";
  var metrics = context.measureText(text);
  return metrics.width;
}

function replace(str, func) {
  let newStr = '';
  for (char of str) {
    let c = func(char);
    newStr += c || char;
  }
  return newStr;
}