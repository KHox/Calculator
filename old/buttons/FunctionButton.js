class FunctionButton extends Button {
  constructor(func) {
    super(func + '()');
    this.htmlElem.classList.add('func');
  }
}