class OperatorButton extends Button {
  constructor(value) {
    super(value);
    this.htmlElem.innerHTML = this.htmlStr = toClient(value);
    this.htmlElem.classList.add('oper');
  }
}