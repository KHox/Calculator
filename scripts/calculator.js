class Calculator {
  constructor(elem) {
    this.elem = elem;
    this.display = new Display(elem.querySelector('.calculator__display'));

    elem.addEventListener('click', e => {
      let trgt = e.target;
      if (trgt.tagName == 'TD') {
        switch (trgt.className) {
          case 'num':
          case 'oper':
          case 'spec':
          case 'const':
            this.display.print(trgt.textContent);
            break;
          case 'func':
            this.display.printFunction(trgt.textContent, ['(', ')']);
            break;
          case 'spec-func':
            this.display.printFunction('', ['|', '|']);
            break;
          case 'del':
            this.display.erase();
            break;
          case 'answ':
            this.display.getAnswer();
            break;
          case 'delAll':
            this.display.clear();
            break;
          case 'changeMenu':
            this.toggleMenu(e);
            break;
        }
      }
    });

    elem.onmousedown = e => {
      if (!e.target.closest('.calculator__display')) return false;
    }
  }

  toggleMenu(e) {
    if (this.menu && this.menu.clientHeight) this.hideMenu();
    else this.showMenu(e);
  }

  showMenu(e) {
    if (!this.menu) this.createMenu(e);
    this.menu.classList.add('open');
  }

  hideMenu() {
    this.menu.classList.remove('open');
  }

  createMenu(e) {
    let menu = document.createElement('div');
    menu.className = 'calculator-menu';
    menu.innerHTML = `<ul>
      <li data-buttons="base">basic</li>
      <li data-buttons="arcFunc">arc-f</li>
    </ul>`;
    this.menu = menu;
    menu.onclick = e => {
      if (e.target.tagName == 'LI') {
        this.hideMenu();
        this.replaceButtons(Calculator[e.target.dataset.buttons]);
      }
    }
    e.target.append(menu);
    menu.style.width = e.target.clientWidth + 'px';
  }

  replaceButtons(buttons) {
    let r = this.elem.querySelectorAll('td[data-replaceble]');
    console.log(r);
    for (let i = 0; i < buttons.length; i++) {
      if (r[i]) r[i].outerHTML = buttons[i];
    }
  }
}

Calculator.base = [
  '<td class="func" data-replaceble>sin</td>',
  '<td class="func" data-replaceble>cos</td>',
  '<td class="func" data-replaceble>tan</td>',
]

Calculator.arcFunc = [
  '<td class="func" data-replaceble>asin</td>',
  '<td class="func" data-replaceble>acos</td>',
  '<td class="func" data-replaceble>atan</td>',
]