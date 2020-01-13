class Button {
  constructor(value) {
    this.htmlElem = document.createElement('td');
    this.htmlElem.obj = this;
    this.htmlElem.innerHTML = this.value = value;
  }

  click(disp) {
    disp.insert(this);
    disp.input.htmlElem.focus();
    disp.input.htmlElem.dispatchEvent(new Event('input', {
      bubbles: true,
      cancelable: true
    }));
  }
}

class NumberButton extends Button {
  constructor(value) {
    super('' + value);
    this.htmlElem.classList.add('num');
  }
}

class OperatorButton extends Button {
  constructor(value) {
    super(value);
    this.htmlElem.innerHTML = this.htmlStr = toClient(value);
    this.htmlElem.classList.add('oper');
  }
}

class FunctionButton extends Button {
  constructor(func) {
    super(func + '()');
    this.htmlElem.classList.add('func');
  }
}

class VariableButton extends Button {
  constructor(value) {
    super(value);
    this.htmlElem.classList.add('var');
  }
}

class EraseButton extends Button {
  constructor(elem) {
    super();
    this.htmlElem = elem;
    elem.obj = this;
    elem.classList.add('del');
    elem.innerHTML = '<span>←</span>';
  }

  click(disp) {
    disp.erase();
  }

  static create(wrap) {
    let erase = new EraseButton(document.createElement('div'));
    wrap.append(erase.htmlElem);
    return erase;
  }
}

class GetAnswerButton extends Button {
  constructor(elem) {
    super();
    this.htmlElem = elem;
    elem.obj = this;
    elem.classList.add('answ');
    elem.innerHTML = '<span>=</span>';
  }

  click(disp) {
    disp.getAnswer(disp.input);
  }

  static create(wrap) {
    let answ = new GetAnswerButton(document.createElement('div'));
    wrap.appendChild(answ.htmlElem);
    return answ;
  }
}