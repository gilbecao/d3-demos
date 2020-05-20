// Data preparation
function filterData(data) {
  return data.filter((d) => {
    return d.year > 1999 && d.year < 2010;
  });
}

function prepareBarCharData(data) {
  const rolledUp = d3
    .nest()
    .key((d) => d.year)
    .rollup((d) => d3.sum(d, (r) => r.adjustedCosts))
    .sortKeys(d3.descending)
    .entries(data);

  const namedArray = Array.from(rolledUp, (d) => ({
    year: +d.key,
    adjustedCosts: +d.value,
  }));

  return namedArray;
}

// Main function
function ready(movies) {
  const moviesClean = filterData(movies);
  const barChartData = prepareBarCharData(moviesClean);

  // Margin conventions
  const margin = { top: 80, right: 40, bottom: 40, left: 40 };
  const width = 400 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Draw base
  const svg = d3
    .select(".bar-chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Draw header
  const header = svg
    .append("g")
    .attr("class", "bar-header")
    .attr("transform", `translate(0,${-margin.top / 2})`)
    .append("text");

  header.append("tspan").text("Total adjusted cost by year in $US");
  header
    .append("tspan")
    .text("Films adjusted cost figures, 2003 - 2009")
    .attr("x", 0)
    .attr("dy", "1.5em")
    .style("font-size", ".8em")
    .style("fill", "#555");

  // Scales
  //const xExtent = d3.extent(barChartData, (d) => d.adjustedCosts);
  const xMax = d3.max(barChartData, (d) => d.adjustedCosts);

  const xScales = d3.scaleLinear().domain([0, xMax]).range([0, width]);

  const yScales = d3
    .scaleBand()
    .domain(barChartData.map((d) => d.year))
    .rangeRound([0, height])
    .paddingInner(0.25);

  // Draw bars
  const bars = svg
    .selectAll(".bar")
    .data(barChartData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", (d) => yScales(d.year))
    .attr("width", (d) => xScales(d.adjustedCosts))
    .attr("height", yScales.bandwidth())
    .style("fill", "lightblue");

  function formatTicks(d) {
    return d3.format("~s")(d);
    /*.replace("M", " mil")
      .replace("G", " bil")
      .replace("T", " tril");*/
  }
  // Draw axes
  const xAxis = d3
    .axisTop(xScales) // Need to know position of the axis and the scale that represents.
    .tickFormat(formatTicks)
    .tickSize(-height);

  const xAxisDraw = svg.append("g").attr("class", "x axis").call(xAxis);

  const yAxis = d3.axisLeft(yScales).tickSize(0);

  const yAxisDraw = svg.append("g").attr("class", "y axis").call(yAxis);

  yAxisDraw.selectAll("text").attr("dx", "-0.6em"); // Separation from the axis
}

// Parse costs
const parseCost = (string) => string.replace(/[$,.]/g, "");

// Type conversion
function type(data) {
  return {
    adjustedCosts: +parseCost(data["Adjusted Costs"]),
    description: data["Description"],
    image: data["Image"],
    movie: data["Movie"],
    movieWikipediaProfile: data["Movie Wikipedia Profile"],
    nominalCosts: +parseCost(data["Nominal Costs"]),
    year: +data["Year"],
  };
}

// Load data
d3.csv("data/movie.csv", type).then(ready);
