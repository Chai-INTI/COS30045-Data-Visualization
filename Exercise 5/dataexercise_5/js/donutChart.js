// Load the TV screen size distribution data
d3.csv("data/Data_exercise 5.3.csv", d => {
  const cat = (d.Screensize_Category || d.screensize_category || "").trim();
  const countKey = Object.keys(d).find(k => k.toLowerCase().includes("count")) || Object.keys(d)[1];
  return {
    Screensize_Category: cat,
    Count: +d[countKey]
  };
}).then(data => {
  drawDonutChart(data);
}).catch(error => {
  console.error("Error loading donut chart data:", error);
});

const drawDonutChart = (data) => {
  const width = 600;
  const height = 400;
  const radius = Math.min(width, height) / 2 - 35;

  const svg = d3.select("#donut-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const innerChart = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Thematic color scheme matching site palette
  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.Screensize_Category))
    .range(["#E9A63C", "#C9832A", "#5A4527"]);

  const pie = d3.pie()
    .value(d => d.Count)
    .sort(null);

  const arcGenerator = d3.arc()
    .innerRadius(radius * 0.58)
    .outerRadius(radius * 0.98);

  innerChart.selectAll("path")
    .data(pie(data))
    .join("path")
    .attr("d", arcGenerator)
    .attr("fill", d => color(d.data.Screensize_Category))
    .attr("stroke", "#FFFDF6")
    .attr("stroke-width", 2.5);

  innerChart.selectAll(".donut-label")
    .data(pie(data))
    .join("text")
    .attr("class", "donut-label")
    .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
    .style("fill", "#ffffff")
    .style("font-weight", "600")
    .text(d => `${d.data.Screensize_Category} (${d.data.Count})`);
};