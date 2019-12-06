class VariableButton extends Button {
  constructor(value) {
    super(value);
    this.htmlElem.classList.add('var');
  }
}