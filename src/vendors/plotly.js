const Plotly = require('plotly.js/lib/core');

// load only bar chart and line chart
Plotly.register([
  require('plotly.js/lib/bar'),
  require('plotly.js/lib/scatter')
]);

require('plotly.js/dist/plotly-locale-ja')
require('plotly.js/dist/plotly-locale-ko')
require('plotly.js/dist/plotly-locale-zh-cn')

module.exports = Plotly;