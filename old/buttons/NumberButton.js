class NumberButton extends Button {
  constructor(value) {
    super('' + value);
    this.htmlElem.classList.add('num');
  }
}