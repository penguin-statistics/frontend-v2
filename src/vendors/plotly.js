const Plotly = require('plotly.js/lib/core');

// load only bar chart and line chart
Plotly.register([
  require('plotly.js/lib/bar'),
  require('plotly.js/lib/scatter')
]);

module.exports = Plotly;