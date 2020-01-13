class Display {
  constructor(elem) {
    this.elem = elem;
    this.input = elem.querySelector('.display__input');
    this.output = elem.querySelector('.display__output');
  }

  print(str) {
    let inp = this.input;
    inp.setRangeText(str, inp.selectionStart, inp.selectionEnd, 'end');
    inp.focus();
  }

  printFunction(func, typeArr) {
    let inp = this.input;
    let start = inp.selectionStart;
    let end = inp.selectionEnd;
    let selected = inp.value.slice(start, end);
    inp.setRangeText(`${func}${typeArr[0]}${selected}${typeArr[1]}`);
    let indent = func.length + 1;
    inp.setSelectionRange(start + indent, end + indent);
    inp.focus();
  }

  getAnswer() {
    let str = replaceAll(this.input.value, toCode);
    let answer;
    try {
      answer = eval(str);
    } catch (e) {
      alert('Ошибка в формуле!');
      return;
    }
    if (isNumeric(answer)) {
      this.output.textContent = +answer.toFixed(10);
    }
  }

  erase() {
    let inp = this.input;
    if (inp.selectionStart == inp.selectionEnd && inp.selectionStart > 0) {
      inp.setRangeText('', inp.selectionStart - 1, inp.selectionStart);
    } else {
      inp.setRangeText('');
    }
    inp.focus();
  }

  clear() {
    this.input.value = '';
    this.input.focus();
  }
}