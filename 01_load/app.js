d3.csv("data/movie.csv").then((response) =>
  console.log("Local csv:", response)
);

d3.json("data/movie.json").then((response) =>
  console.log("Local json:", response)
);

const csv = d3.csv("data/movie.csv");
const json = d3.json("data/movie.json");

Promise.all([csv, json]).then((response) => {
  console.log("Multiple requests:", response);
  console.log("Multiple requests concats:", [...response[0], ...response[1]]);
});
