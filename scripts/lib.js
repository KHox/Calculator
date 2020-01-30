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
  'log(.*)\\((.*)\\)': 'MathPlus.lgrfm($1, $2)',
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
  },

  lgrfm(base, val) {
    return Math.log(val) / Math.log(base);
  }
}

function replaceAll(str, options) {
  for (let [key, value] of Object.entries(options)) {
    let r;
    if (key.length == 1) r = new RegExp(`\\${key}`, 'g');
    else r = new RegExp(key, 'g');
    while (r.test(str)) {
      str = str.replace(r, value);
    }
  }
  return str;
}