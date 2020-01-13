class Calculator {
  constructor(elem) {
    this.elem = elem;
    this.display = new Display(elem.querySelector('.calculator__display'));

    let display = elem.querySelector('.calculator__display');
    let handler = e => {
      if (window.innerWidth <= 550 && !this.isPhoneMod) {
        this.isPhoneMod = true;
        display.setAttribute('colspan', 3);
        this.goToPhoneMod();
      } else if (window.innerWidth > 550 && this.isPhoneMod) {
        this.isPhoneMod = false;
        display.setAttribute('colspan', 5);
        this.goToPCMod();
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
    if (!this.menu || this.menu.isMobile != this.isPhoneMod) this.createMenu(e);
    this.menu.style.width = e.target.clientWidth + 'px';
    this.menu.classList.add('open');
  }

  hideMenu() {
    this.menu.classList.remove('open');
  }

  createMenu() {
    let menu = document.createElement('div');
    menu.className = 'calculator-menu';
    menu.isMobile = this.isPhoneMod;
    if (this.isPhoneMod) {
      menu.innerHTML = `<ul>
      <li data-buttons="MBase">basic</li>
      <li data-buttons="othFunc">other-f</li>
    </ul>`;
    } else {
      menu.innerHTML = `<ul>
      <li data-buttons="base">basic</li>
      <li data-buttons="arcFunc">arc-f</li>
    </ul>`;
    }
    this.menu = menu;
    menu.onclick = e => {
      if (e.target.tagName == 'LI') {
        this.hideMenu();
        this.replaceButtons(Calculator[e.target.dataset.buttons]);
      }
    }
    document.querySelector('.main-element').append(menu);
  }

  replaceButtons(buttons) {
    let r = this.elem.querySelectorAll('td[data-replaceble]');
    console.log(r);
    for (let i = 0; i < buttons.length; i++) {
      if (r[i]) r[i].outerHTML = buttons[i];
    }
  }

  goToPhoneMod() {
    this.clearLast();
    this.elem.insertAdjacentHTML('beforeEnd', Calculator.mobileBase);
  }

  goToPCMod() {
    this.clearLast();
    this.elem.insertAdjacentHTML('beforeEnd', Calculator.PCBase);
  }

  clearLast() {
    if (this.menu) this.hideMenu();
    let rows = this.elem.rows;
    let length = rows.length;
    for (let i = length - 1; i > length - 6; i--) {
      rows[i].remove();
    }
  }
}

Calculator.base = [
  '<td class="func" data-replaceble>sin</td>',
  '<td class="func" data-replaceble>cos</td>',
  '<td class="func" data-replaceble>tan</td>',
];

Calculator.arcFunc = [
  '<td class="func" data-replaceble>asin</td>',
  '<td class="func" data-replaceble>acos</td>',
  '<td class="func" data-replaceble>atan</td>',
];

Calculator.MBase = [
  '<td class="num" data-replaceble>7</td>',
  '<td class="num" data-replaceble>8</td>',
  '<td class="num" data-replaceble>9</td>',
  '<td class="num" data-replaceble>4</td>',
  '<td class="num" data-replaceble>5</td>',
  '<td class="num" data-replaceble>6</td>',
  '<td class="num" data-replaceble>1</td>',
  '<td class="num" data-replaceble>2</td>',
  '<td class="num" data-replaceble>3</td>',
  '<td class="oper" data-replaceble>^</td>',
  '<td class="num" data-replaceble>0</td>'
];

Calculator.othFunc = [
  '<td class="func" data-replaceble>sin</td>',
  '<td class="func" data-replaceble>cos</td>',
  '<td class="func" data-replaceble>tan</td>',
  '<td class="func" data-replaceble>asin</td>',
  '<td class="func" data-replaceble>acos</td>',
  '<td class="func" data-replaceble>atan</td>',
  '<td class="func" data-replaceble>sqrt</td>',
  '<td class="func" data-replaceble>ctg</td>',
  '<td class="spec-func" data-replaceble>|x|</td>',
  '<td class="spec" data-replaceble>(</td>',
  '<td class="spec" data-replaceble>)</td>',
];

Calculator.mobileBase = `<tr>
  <td class="changeMenu">...</td>
  <td class="delAll">C</td>
  <td class="const">π</td>
  <td class="const">e</td>
</tr>
<tr>
  <td class="num" data-replaceble>7</td>
  <td class="num" data-replaceble>8</td>
  <td class="num" data-replaceble>9</td>
  <td class="oper">+</td>
</tr>
<tr>
  <td class="num" data-replaceble>4</td>
  <td class="num" data-replaceble>5</td>
  <td class="num" data-replaceble>6</td>
  <td class="oper">−</td>
</tr>
<tr>
  <td class="num" data-replaceble>1</td>
  <td class="num" data-replaceble>2</td>
  <td class="num" data-replaceble>3</td>
  <td class="oper">×</td>
</tr>
<tr>
  <td class="oper" data-replaceble>^</td>
  <td class="num" data-replaceble>0</td>
  <td class="oper">,</td>
  <td class="oper">÷</td>
</tr>`;

Calculator.PCBase = `<tr>
  <td class="changeMenu">...</td>
  <td class="func">sqrt</td>
  <td class="delAll">C</td>
  <td class="const">π</td>
  <td class="const">e</td>
  <td class="oper">+</td>
</tr>
<tr>
  <td class="func"></td>
  <td class="spec-func">|x|</td>
  <td class="num">7</td>
  <td class="num">8</td>
  <td class="num">9</td>
  <td class="oper">+</td>
</tr>
<tr>
  <td class="func" data-replaceble>sin</td>
  <td class="func" data-replaceble>cos</td>
  <td class="num">4</td>
  <td class="num">5</td>
  <td class="num">6</td>
  <td class="oper">−</td>
</tr>
<tr>
  <td class="func" data-replaceble>tan</td>
  <td class="func">ctg</td>
  <td class="num">1</td>
  <td class="num">2</td>
  <td class="num">3</td>
  <td class="oper">×</td>
</tr>
<tr>
  <td class="spec">(</td>
  <td class="spec">)</td>
  <td class="oper">^</td>
  <td class="num">0</td>
  <td class="oper">,</td>
  <td class="oper">÷</td>
</tr>`;