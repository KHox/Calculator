function DrawCanvas(options) {
  /*Создаёт объект с методами для рисования на элементе canvas.
   * options = {
   *   width: <canvas width>,
   *   height: <canvas height>,
   *   parent: <parentElement of canvas>
   * };
   */

  //Создаём элемент canvas
  var canvas = document.createElement("canvas");
  var div = document.createElement('div');
  canvas.width = options.width;
  canvas.height = options.height;
  canvas.className = 'canvas-schedule';
  div.className = 'div-canvas';
  div.appendChild(canvas);
  options.parent.appendChild(div);

  var self = this;
  var cStep = 50;
  var markupLineColor = '#89f4fb';
  var markupLineWidth = '1';
  var horizontalLinesCoords = [];
  var verticalLinesCoords = [];
  var numbersCoords = [];
  var k, indentX, indentY;

  //Получаем контекст.
  var ctx = canvas.getContext("2d");

  function drawMarkup(options) {
    /*Рисует разметку.
     * options = {
     *   color: <line color>,
     *   width: <line width>,
     *   step: <line frequency>,
     *   indent:
     *     h: <horizontal indent>,
     *     v: <vertical indent>
     * };
     */

    if (!options) options = {};

    //Сохраняем текущее состояние контекста.
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    //Если есть свойства, ставим их.
    ctx.strokeStyle = options.color ? markupLineColor = options.color : markupLineColor;
    ctx.lineWidth = options.width ? markupLineWidth = '' + options.width : markupLineWidth;

    var step = parseInt(options.step);
    if (step) cStep = step;
    else step = cStep;

    if (!options.indent) options.indent = {};

    var h = options.indent.h;
    var v = options.indent.v;

    horizontalLinesCoords = [];
    verticalLinesCoords = [];

    //Создаём разметку.
    //createVerticalMarkup(step, v);
    //createHorizontalMarkup(step, h);
    createMarkup({
      step: step,
      indent: h,
      horizontal: true
    });
    createMarkup({
      step: step,
      indent: v
    })

    ctx.stroke();
    ctx.restore();
  }

  function createMarkup(options) {
    var indent = options.indent || 0;
    var step = options.step;
    var o = Object.defineProperty;
    if (options.horizontal) {
      var length = canvas.height;

      var arg1 = {
        first: 0
      };
      o(arg1, "last", {
        get: function() {
          return i * step;
        }
      });

      var arg2 = {
        first: canvas.width
      };
      o(arg2, "last", {
        get: function() {
          return i * step;
        }
      });

      var arg3 = {
        first: 0,
        last: indent - step
      };
      indentY = indent;
    } else {
      length = canvas.width;
      arg1 = {
        last: 0
      };
      o(arg1, "first", {
        get: function() {
          return i * step;
        }
      });

      arg2 = {
        last: canvas.height
      };
      o(arg2, "first", {
        get: function() {
          return i * step;
        }
      });

      arg3 = {
        first: indent - step,
        last: 0
      };
      indentX = indent;
    }

    if (indent) {
      ctx.save();
      ctx.translate(arg3.first, arg3.last);
    }

    for (var i = 1; i < ((length - indent) / step); i++) {
      ctx.moveTo(arg1.first, arg1.last);
      ctx.lineTo(arg2.first, arg2.last);
    }

    if (indent) {
      ctx.moveTo(arg1.first, arg1.last);
      ctx.lineTo(arg2.first, arg2.last);
      ctx.restore();
    }


  }

  function drawMiddleLine(options) {
    /*Рисует среднюю линию.
     * options = {
     *   color: <middle line color>,
     *   width: <middle line width>,
     *   horizontal: <true/false>,
     *   vertical: <true/false>,
     *   coords: <coord/array of coords>
     *     coord
     *     vertical
     *     horizontal
     * };
     */

    ctx.save();
    ctx.beginPath();

    if (options.color) ctx.strokeStyle = options.color;
    if (options.width) ctx.lineWidth = '' + options.width;

    if (options.horizontal) createLine(Math.round(canvas.height / cStep / 2) * cStep, true);
    if (options.vertical) createLine(Math.round(canvas.width / cStep / 2) * cStep, false);

    var coords = options.coords;
    if (coords) {
      if (Array.isArray(coords)) {
        for (var i = 0; i < coords.length; i++) {
          var c = coords[i];
          if (c.horizontal) createLine(c.coord, true);
          if (c.vertical) createLine(c.coord, false);
        }
      } else {
        if (coords.horizontal) createLine(coords.coord, true);
        if (coords.vertical) createLine(coords.coord, false);
      }
    }

    ctx.stroke();
    ctx.restore();
  }

  function createLine(coord, position) {
    if (coord > 0) {
      if (position && horizontalLinesCoords.indexOf(coord) == -1 && coord < canvas.height) {
        ctx.moveTo(0, coord);
        ctx.lineTo(canvas.width, coord);
        horizontalLinesCoords.push(coord);
      } else if (verticalLinesCoords.indexOf(coord) == -1 && coord < canvas.width) {
        ctx.moveTo(coord, 0);
        ctx.lineTo(coord, canvas.height);
        verticalLinesCoords.push(coord);
      }
    }
  }

  function drawGraph(options) {
    /*Рисует график функции из настроек
     * options
     *   topBorder
     *   buttomBorder
     *   leftBorder
     *   rightBorder
     *   color
     *   width
     *   f
     */

    var top = options.topBorder;
    var bottom = options.bottomBorder;

    var graph = getGraphOptions(top, bottom);

    k = canvas.height * 0.9 / graph.range; //pixPerValue
    var horizontalLine = Math.round(canvas.height * 0.05 + k * graph.middleLine);
    /*k = (canvas.height - 2 * cStep) / graph.range;
    var middleLine = cStep + k * graph.middleLine;*/
    var pixPerValueHor = canvas.width * 0.9 / (options.rightBorder - options.leftBorder); //pixPerValue
    var verticalLine = Math.round(canvas.width * 0.05 - options.leftBorder * pixPerValueHor);

    var hlc = horizontalLinesCoords;
    var vlc = verticalLinesCoords;

    //if (hlc.length > 1 || hlc.indexOf(horizontalLine) == -1 || vlc.length > 1 || vlc.indexOf(verticalLine) == -1) {
    console.log('Перерисовка');
    opts = {
      width: 3,
      coords: [{
        coord: horizontalLine,
        horizontal: true
      }]
    };
    var indH = horizontalLine % cStep;
    if (verticalLine > 0 && verticalLine < canvas.width) {
      opts.coords.push({
        coord: verticalLine,
        vertical: true
      });
      var indV = verticalLine % cStep
    }
    drawMarkup({
      indent: {
        v: indV,
        h: indH
      }
    });
    drawMiddleLine(opts);
    //};

    ctx.save();
    ctx.beginPath();
    ctx.translate(0, horizontalLine);
    ctx.lineJoin = 'round';

    if (options.color) ctx.strokeStyle = options.color;
    if (options.width) ctx.lineWidth = '' + options.width;

    createGraph({
      f: options.f,
      left: options.leftBorder,
      right: options.rightBorder
    });

    ctx.stroke();
    ctx.restore();

    drawCoords({
      values: options
    });
  };

  function getGraphOptions(max, min) {
    var options = {};
    if (max <= 0) {
      options.range = -min;
      options.middleLine = 0;
      return options;
    }

    options.middleLine = max;
    options.range = min >= 0 ? max : max - min;
    return options;
  }

  function createGraph(options) {
    var f = options.f;
    var valuePerPix = (options.right - options.left) / (canvas.width * 0.9);
    var step = canvas.width * 0.05;
    var move = true;
    for (var i = 0; i <= canvas.width; i++) {
      var value = f(options.left + valuePerPix * (i - step));
      if (!isNumeric(value)) {
        move = true;
        continue;
      }
      if (move) {
        ctx.moveTo(i, -k * value);
        move = false;
      } else {
        //ctx.moveTo(i, -k * f(options.left + step * (i - 50)));
        //ctx.lineTo(i + 1, -k * f(options.left + step * (i - 50)));
        ctx.lineTo(i, -k * value);
      }
    }
  }

  function drawCoords(options) {
    /* options = {
      borders + function

    }*/
    var values = options.values;

    for (var key in values) {
      if (typeof values[key] == 'function') continue;
      if (values[key] && (values[key] % Math.PI) == 0) {
        var prefix = values[key] / Math.PI;
        if (prefix == 1) prefix = '';
        else if (prefix == -1) prefix = '-';
        values[key] = prefix + 'π';
      }
    }


    createCoords({
      x: canvas.width * 0.05,
      y: horizontalLinesCoords[0]
    }, values.leftBorder);
    createCoords({
      x: canvas.width * 0.95,
      y: horizontalLinesCoords[0]
    }, values.rightBorder);

    /*if (verticalLinesCoords[0]) {
      createCoords({
        x: verticalLinesCoords[0],
        y: canvas.height * 0.05
      }, values.topBorder, 4);
      createCoords({
        x: verticalLinesCoords[0],
        y: canvas.height * 0.95
      }, values.bottomBorder, 4);
      createCoords({
        x: verticalLinesCoords[0] - canvas.width * 0.013,
        y: horizontalLinesCoords[0],
      }, 0, 3, true);
    } else {*/
    createCoords({
      x: 0,
      y: canvas.height * 0.05
    }, values.topBorder, 4);
    createCoords({
      x: 0,
      y: canvas.height * 0.95
    }, values.bottomBorder, 4);
    createCoords({
      x: 0 - canvas.width * 0.02,
      y: horizontalLinesCoords[0],
    }, 0, 3, true);
    //}
  }

  function createCoords(coords, value, pos, m) {
    var span = document.createElement('span');
    span.innerHTML = value;
    span.className = 'coord';
    span.style.font = '35px Arial';
    div.appendChild(span);

    var x, y,
      width = span.offsetWidth,
      height = span.offsetHeight,
      halfW = width / 2,
      halfH = height / 2;

    if (pos == 2 || pos == 4) {
      x = coords.x - halfW + (-pos + 3) * (halfW + 5);
      y = coords.y - halfH;
      if (!m) {
        ctx.beginPath();
        ctx.moveTo(coords.x + canvas.width / 150, coords.y);
        ctx.lineTo(coords.x - canvas.width / 150, coords.y);
        ctx.stroke();
      }
    } else if (pos == 1 || pos == 3 || (pos = 3)) {
      x = coords.x - halfW;
      y = coords.y - halfH + (pos - 2) * (halfH + 5);
      if (!m) {
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y + canvas.height / 70);
        ctx.lineTo(coords.x, coords.y - canvas.height / 70);
        ctx.stroke();
      }
    } else {
      div.removeChild(span);
      return null;
    }

    var r = x + width;
    var b = y + height;
    console.log(x + ':' + y + ":" + r + ':' + b);

    if (r > canvas.width || b > canvas.height) {
      div.removeChild(span);
      return;
    }

    var sum = 0;

    for (var i = 0; i < numbersCoords.length; i++) {
      var c = numbersCoords[i];
      if (((x >= c.l && x <= c.r) || (r <= c.r && r >= c.l)) && ((y >= c.t && y <= c.b) || (b >= c.t && b <= c.b)) || (y < horizontalLinesCoords[0] && b > horizontalLinesCoords[0]) || (verticalLinesCoords[0] && x < verticalLinesCoords[0] && r > verticalLinesCoords[0])) {
        div.removeChild(span);
        return;
      }
      sum += c.r - c.l;
    }

    numbersCoords.push({
      t: y,
      l: x,
      r: r,
      b: b
    });

    span.style.top = y - canvas.offsetHeight - 5 + 'px';
    span.style.left = x - sum + 'px';
  }

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  this.drawMarkup = drawMarkup;
  this.drawMiddleLine = drawMiddleLine;
  this.drawGraph = drawGraph;
  this.drawCoords = drawCoords;
}

var canvas = new DrawCanvas({
  width: 1000,
  height: 400,
  parent: document.querySelector('.graph')
});

//canvas.drawMarkup();

canvas.drawMiddleLine({
  width: 3,
  horizontal: true,
  vertical: true
});

canvas.drawGraph({
  topBorder: 1,
  bottomBorder: -1,
  leftBorder: -2 * Math.PI,
  rightBorder: 2 * Math.PI,
  f: Math.sin
});