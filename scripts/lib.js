function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isValidFunction(func) {
  let x = 0;
  if (func.trim() == '') return false;
  try {
    eval(func);
  } catch (err) {
    return false;
  }
  return true;
}

let operators = {
  '*': '×',
  '/': '÷',
  '-': '−',
  '+': '+',
  '.': ','
};

let toCode = {
  '×': '*',
  '÷': '/',
  '−': '-',
  ',': '.',
  '^': '**',
  '([^a-zA-Z]\\d)([a-z\\(])': '$1*$2',
  '(^\\d)([a-z\\(])': '$1*$2',
  '\\)(\\d)': ')*$1',
  'π': 'Math.PI',
  'e': 'Math.E',
  '([^a-z])tan': '$1MathPlus.tg',
  'ctg': 'MathPlus.ct',
  '\\|([\\w\\(\\)\\-\\+\\*\\/\\.]*[\\d\\)x])\\|': 'Math.abs($1)',
  '([^a-z\\.])([a-z]+\\()': '$1Math.$2',
  '(^[a-z][a-z]*\\()': 'Math.$1'
};

let MathPlus = {
  tg(x) {
    return Math.sin(x) / Math.cos(x).toFixed(`${graph.accuracy}`.length - 2);
  },
  ct(x) {
    return Math.cos(x) / Math.sin(x).toFixed(`${graph.accuracy}`.length - 2);
  }
}

let isFuncSymb = s => isNaN(s) && !toCode(s) && s != '(' && s != ')';

function getTextWidth(text) {
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = "Arial 60px";
  var metrics = context.measureText(text);
  return metrics.width;
}

function replaceByFunc(str, func) {
  let newStr = '';
  for (char of str) {
    newStr += func(char);
  }
  return newStr;
}

function replaceAll(str, options) {
  for (let [key, value] of Object.entries(options)) {
    let r;
    if (key.length == 1) r = new RegExp(`\\${key}`, 'g');
    else r = new RegExp(key, 'g');
    while (r.test(str)) {
      str = str.replace(r, value);
      console.log(str);
    }
  }
  return str;
}