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
    .sortKeys(d3.ascending)
    .entries(data);

  const namedArray = Array.from(rolledUp, (d) => ({
    year: d.key,
    adjustedCosts: d.value,
  }));

  return namedArray;
}

// Main function
function ready(movies) {
  // Data prep.
  const moviesClean = filterData(movies);
  const barChartData = prepareBarCharData(moviesClean);

  console.log(barChartData);
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
