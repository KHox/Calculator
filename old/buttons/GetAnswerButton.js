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