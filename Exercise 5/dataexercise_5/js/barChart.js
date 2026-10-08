// Load the 55-inch TV data
d3.csv("data/Data_exercise 5.1-1.csv", d => {
  const tech = (d.Screen_Tech || d.screen_tech || "").trim().toUpperCase();
  const consumptionKey = Object.keys(d).find(k => k.includes("Mean") || k.includes("energy") || k.includes("kWh")) || Object.keys(d)[1];
  return {
    Screen_Tech: tech,
    Energy_Consumption: +d[consumptionKey]
  };
}).then(data => {
  // Sort descending: LED -> OLED -> LCD
  data.sort((a, b) => b.Energy_Consumption - a.Energy_Consumption);
  drawBarChart(data);
}).catch(error => {
  console.error("Error loading bar chart data:", error);
});

const drawBarChart = (data) => {
  const margin = { top: 40, right: 30, bottom: 40, left: 60 };
  const width = 600;
  const height = 400;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.Screen_Tech))
    .range([0, innerWidth])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, 420])
    .range([innerHeight, 0]);

  const bottomAxis = d3.axisBottom(xScale);
  const leftAxis = d3.axisLeft(yScale).ticks(6).tickSize(4);

  innerChart.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis);

  innerChart.append("g")
    .attr("class", "axis y-axis")
    .call(leftAxis);

  innerChart.append("text")
    .attr("class", "axis-label")
    .attr("x", -margin.left + 10)
    .attr("y", -18)
    .attr("text-anchor", "start")
    .text("Energy Consumption (kWh/yr)");

  innerChart.selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.Screen_Tech))
    .attr("y", d => yScale(d.Energy_Consumption))
    .attr("width", xScale.bandwidth())
    .attr("height", d => innerHeight - yScale(d.Energy_Consumption))
    .attr("rx", 3);

  innerChart.selectAll(".bar-label")
    .data(data)
    .join("text")
    .attr("class", "bar-label")
    .attr("x", d => xScale(d.Screen_Tech) + xScale.bandwidth() / 2)
    .attr("y", d => yScale(d.Energy_Consumption) - 8)
    .text(d => `${Math.round(d.Energy_Consumption)} kWh`);
};