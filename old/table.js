class Table {
  constructor(table, sect) {
    this.htmlElem = table;
    table.obj = this;

    table.onmousedown = function(e) {
      if (e.target.closest('td') && !e.target.closest('td').classList.contains('disp'))
        return false
    };

    if (sect) {
      this.setButtons(sect);
    }
  }

  setButtons(sections) {
    Array.prototype.forEach.call(this.htmlElem.rows, str => {
      while (str.children.length > 0) {
        str.removeChild(str.lastElementChild);
      }
    });
    let self = this;
    self.buttons = sections.map((arr, i) => {
      arr = arr.map(value => {
        let button = createButton(value);
        self.htmlElem.rows[i].appendChild(button.htmlElem);
        return button;
      });
    });
  }
}