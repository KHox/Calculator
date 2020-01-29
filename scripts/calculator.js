class Calculator {
  constructor(elem) {
    this.elem = elem;
    this.display = new Display(elem.querySelector('.calculator__display'));

    let display = elem.querySelector('.calculator__display');
    let handler = e => {
      if (window.innerWidth <= 550 && !this.isPhoneMod) {
        this.isPhoneMod = true;
        display.setAttribute('colspan', 3);
        this.toggleHidebleButtons();
        this.hideMenu();
      } else if (window.innerWidth > 550 && this.isPhoneMod) {
        this.isPhoneMod = false;
        display.setAttribute('colspan', 5);
        this.toggleHidebleButtons();
        this.replaceButtons('mobile');
        this.hideMenu();
      }
      if (this.menu && this.menu.classList.contains('open')) {
        this.menu.style.width = this.elem.querySelector('td.changeMenu').clientWidth + 'px';
      }
    }

    handler();
    window.addEventListener('resize', handler);

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
          case 'log-func':
            this.display.printLogFunc();
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
        if (this.isPhoneMod) this.display.blur();
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
    if (!this.menu || this.menu.isMobile != this.isPhoneMod) this.createMenu(e);
    this.menu.style.width = e.target.clientWidth + 'px';
    this.menu.style.top = e.target.offsetTop + 'px';
    this.menu.classList.add('open');
  }

  hideMenu() {
    if (this.menu) this.menu.classList.remove('open');
  }

  createMenu() {
    let menu = document.createElement('div');
    menu.className = 'calculator-menu';
    menu.isMobile = this.isPhoneMod;
    if (this.isPhoneMod) {
      menu.innerHTML = `<ul>
      <li data-buttons="mobile">basic</li>
      <li data-buttons="othfunc">other-f</li>
    </ul>`;
    } else {
      menu.innerHTML = `<ul>
      <li data-buttons="base">basic</li>
      <li data-buttons="arcfunc">arc-f</li>
    </ul>`;
    }
    this.menu = menu;
    menu.onclick = e => {
      if (e.target.tagName == 'LI') {
        this.hideMenu();
        this.replaceButtons(e.target.dataset.buttons);
      }
    }
    this.elem.append(menu);
  }

  replaceButtons(type) {
    let buttons = this.elem.querySelectorAll(`td[data-${type}]`);
    for (let button of buttons) {
      let [content, cls] = button.dataset[type].split(' ');
      button.innerHTML = content;
      if (cls) {
        button.className = cls;
      }
    }
  }

  toggleHidebleButtons() {
    let buttons = this.elem.querySelectorAll('[data-hideble]');
    for (let button of buttons) {
      button.hidden = !button.hidden;
    }
  }
}