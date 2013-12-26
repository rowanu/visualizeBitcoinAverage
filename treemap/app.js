/*globals d3, colorbrewer */
var margin = {top: 40, right: 10, bottom: 10, left: 10},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var color = d3.scale.category20();

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

d3.json('https://api.bitcoinaverage.com/exchanges/USD', function (err, exchanges) {
  if (err) { console.error(err); }
  // var timestamp = exchanges.timestamp;
  var volumes = volumesObjectToArray(exchanges);

  var node = div.datum(volumes).selectAll(".node")
    .data(treemap.nodes)
  .enter().append("div")
    .attr("class", "node")
    .call(position)
    .style("background", function (d) { return color(d.volume); })
    .text(function(d) { return d.name; });
});
