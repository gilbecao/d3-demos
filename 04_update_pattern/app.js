// Click handler.
function click() {
  const dataset = friends[this.dataset.name];
  update(dataset);
}

// The general update pattern.
function update(data) {
  svg
    .selectAll("text")
    .data(data, (d) => d)
    .join(
      (enter) =>
        enter
          .append("text")
          .text((d) => d)
          .attr("x", 30)
          .attr("y", (d, i) => i * 30 + 50)
          .style("fill", "dodgerblue"),

      (update) => update.attr("y", (d, i) => i * 30 + 50).style("fill", "gray"),

      (exit) => exit.remove()
    );
}

// Data.
const friends = {
  biff: ["Apples", "Oranges", "Lemons"],
  chip: ["Apples", "Oranges"],
  kipper: ["Apples", "Cherries", "Peaches", "Oranges"],
};

// Set up.
const svg = d3.select("svg");

// Listen to clicks.
d3.selectAll("button").on("click", click);
