document.querySelector('.menu-buttons').addEventListener('click', function(e) {
  if (!e.target.classList.contains('menu-button')) return;
  let active = this.querySelector('.active-button');
  if (e.target != active) {
    active.classList.remove('active-button');
    document.querySelector(`#${active.dataset.id}`).style.display = 'none';
    e.target.classList.add('active-button');
    document.querySelector(`#${e.target.dataset.id}`).style.display = '';
    if (e.target.dataset.id == 'graph' && !graph) {
      graph = new Graph(document.querySelector('#graph'));
      graph.setCoordPlane({
        bottom: -1,
        top: 1,
        left: -4,
        right: 4,
        gridStep: 40
      });
      graph.drawGrid(40);
    }
  }
})

let calculator = new Calculator(document.querySelector('#calculator'));
let graph;