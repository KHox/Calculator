let operators = {
  '*': '×',
  '/': '÷',
  '-': '−',
  '+': '+',
  '.': ','
};
let sections = [
  ['sin', 'cos', 7, 8, 9, '*'],
  ['tg', 'ctg', 4, 5, 6, '/'],
  ['pow', 'sqrt', 1, 2, 3, '+'],
  ['', 'x', '.', 0, '-', '']
];
let calculator = new Calculator(document.querySelector('#calculator'), sections);