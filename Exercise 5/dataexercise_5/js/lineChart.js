// Load wholesale electricity spot prices
d3.csv("data/ARE_Spot_Prices.csv", d => {
  return {
    year: +d.Year,
    averagePrice: +d["Average Price (notTas-Snowy)"]
  };
}).then(data => {
  data.sort((a, b) => a.year - b.year);
  drawLineChart(data);
}).catch(error => {
  console.error("Error loading line chart data:", error);
});

const drawLineChart = (data) => {
  const margin = { top: 40, right: 30, bottom: 40, left: 60 };
  const width = 1100;
  const height = 450;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select("#line-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.averagePrice) * 1.1])
    .range([innerHeight, 0])
    .nice();

  const bottomAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(12);
  const leftAxis = d3.axisLeft(yScale).ticks(8).tickSize(4);

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
    .text("Average Price ($ per MWh)");

  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.averagePrice));

  innerChart.append("path")
    .attr("class", "data-line")
    .attr("d", lineGenerator(data));

  // --- Tooltip Setup for Line Chart ---
  const lineTooltip = innerChart.append("g")
    .attr("class", "line-tooltip")
    .style("opacity", 0)
    .style("pointer-events", "none");

  lineTooltip.append("rect")
    .attr("width", 110)
    .attr("height", 34)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", "#5A4527")
    .attr("fill-opacity", 0.9);

  const tooltipText = lineTooltip.append("text")
    .attr("x", 55)
    .attr("y", 21)
    .attr("text-anchor", "middle")
    .attr("fill", "#ffffff")
    .style("font-size", "12px")
    .style("font-weight", "600");

  // Plot data points with hover events
  innerChart.selectAll(".data-circle")
    .data(data)
    .join("circle")
    .attr("class", "data-circle")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.averagePrice))
    .attr("r", 5)
    .style("cursor", "pointer")
    .on("mouseenter", (e, d) => {
      d3.select(e.currentTarget)
        .transition().duration(150)
        .attr("r", 8)
        .attr("fill", "#E9A63C");

      tooltipText.text(`${d.year}: $${d.averagePrice.toFixed(2)}`);

      const cx = xScale(d.year);
      const cy = yScale(d.averagePrice);

      lineTooltip
        .attr("transform", `translate(${cx - 55}, ${cy - 42})`)
        .transition().duration(150)
        .style("opacity", 1);
    })
    .on("mouseleave", (e) => {
      d3.select(e.currentTarget)
        .transition().duration(150)
        .attr("r", 5)
        .attr("fill", "var(--gold-dark, #C9832A)");

      lineTooltip.transition().duration(150)
        .style("opacity", 0);
    });
};