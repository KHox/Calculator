class Calculator {
  constructor(elem, sect) {
    this.elem = elem;
    let wrapper = document.querySelector('#calcTempl').content.querySelector('.wrapper').cloneNode(true);
    this.display = new Display(wrapper.querySelector('.disp'), this);
    this.table = new Table(wrapper.querySelector('table'), sect);
    this.erase = EraseButton.create(wrapper.querySelector('.buttons'));
    this.answer = GetAnswerButton.create(wrapper.querySelector('.buttons'));
    this.canvas = new Canvas(wrapper.querySelector('.canv-area'), this);

    wrapper.addEventListener('click', (e => {
      let trgt = e.target;
      if (trgt.tagName == 'SPAN') trgt = trgt.parentElement;
      if (trgt.tagName == 'TD' || trgt.classList.contains('del') || trgt.classList.contains('answ')) {
        trgt.obj.click(this.display)
      }
    }).bind(this));

    wrapper.onmousedown = function(e) {
      if (e.target.tagName != 'INPUT') return false
    }
    elem.append(wrapper);
    this.canvas.setMetrix()
    this.canvas.drawCoordPlane({
      left: -3,
      right: 3,
      top: 7,
      bottom: -7
    });
    this.accuracy = 0.0001;
  }

  createButtons(sections) {
    this.table.setButtons(sections);
  }
}