/*jslint browser: true */
/*globals d3, Rainbow */
var margin = {top: 40, right: 10, bottom: 10, left: 10},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var rainbow = new Rainbow();
rainbow.setSpectrum('#BDDAFA', '#2C5779');

var treemap = d3.layout.treemap()
  .size([width, height])
  .sort(function (a, b) { return a.volume - b.volume; })
  .value(function(d) { return d.volume; });

var div = d3.select('body').append('div')
  .style('position', 'relative')
  .style('width', (width + margin.left + margin.right) + 'px')
  .style('height', (height + margin.top + margin.bottom) + 'px')
  .style('left', margin.left + 'px')
  .style('top', margin.top + 'px');

// Gets the selected currency from URL params, or defalut to 'USD'
function getSelectedCurrency(path) {
  var parts = path.split('#!');
  var selected = (parts.length > 1) ? parts[1] : 'USD';
  return selected.replace('/', '');
}

function volumesObjectToArray(exchanges) {
  var exchange, volumes = {name: 'volumes'};
  delete exchanges.timestamp;
  volumes.children = [];
  for (exchange in exchanges) {
    if (exchanges.hasOwnProperty(exchange)) {
      volumes.children.push({
        name: exchange,
        volume: exchanges[exchange].volume_btc * 100
      });
    }
  }
  return volumes;
}

function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

var url = 'https://api.bitcoinaverage.com/exchanges/' + getSelectedCurrency(window.location.href);
d3.json(url, function (err, exchanges) {
  if (err) { console.error(err); }
  var timestamp = exchanges.timestamp;
  var i = 0, colors = [], volumes = volumesObjectToArray(exchanges);

  rainbow.setNumberRange(0, volumes.children.length);

  for (i; i < volumes.children.length; i += 1) {
    colors[i] = rainbow.colorAt(i);
  }

  div.datum(volumes).selectAll(".node")
    .data(treemap.nodes)
  .enter().append("div")
    .attr("class", "node")
    .call(position)
    // Ignore 'volumes' parent entry for color calculations
    .filter(function (d) { return typeof d.volume === 'number'; })
    .sort(function (a, b) { return a.volume - b.volume; })
    .style("background", function (d, i) { console.log(d.name + ' ' + d.volume); return '#' + colors[i]; })
    .text(function(d) { return d.name; });

  d3.select('#timestamp')
    .text(timestamp);
});
