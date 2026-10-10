const drawScatterplot = (data) => {
  d3.select("#scatterplot").selectAll("*").remove();

  const svg = d3.select("#scatterplot")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Scatterplot of Energy Consumption vs Star Rating");

  innerChartS = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const maxStar = d3.max(data, d => d.star);
  const maxEnergy = d3.max(data, d => d.energyConsumption);

  xScaleS
    .domain([0, maxStar])
    .range([0, innerWidth])
    .nice();

  yScaleS
    .domain([0, maxEnergy])
    .range([innerHeight, 0])
    .nice();

  colorScale
    .domain(data.map(d => d.screenTech))
    .range(["#E9A63C", "#C9832A", "#5A4527"]);

  innerChartS.selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", 4.5)
      .attr("cx", d => xScaleS(d.star))
      .attr("cy", d => yScaleS(d.energyConsumption))
      .attr("fill", d => colorScale(d.screenTech))
      .attr("opacity", 0.6);

  const xAxis = d3.axisBottom(xScaleS);
  innerChartS.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(yScaleS);
  innerChartS.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

  innerChartS.append("text")
    .attr("class", "axis-label")
    .attr("x", innerWidth)
    .attr("y", innerHeight + 40)
    .attr("text-anchor", "end")
    .text("Star Rating");

  innerChartS.append("text")
    .attr("class", "axis-label")
    .attr("x", 0)
    .attr("y", -15)
    .attr("text-anchor", "start")
    .text("Labeled Energy Consumption (kWh/year)");

  // Color legend
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - 100}, ${margin.top})`);

  colorScale.domain().forEach((screenTech, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendRow.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", colorScale(screenTech));

    legendRow.append("text")
      .attr("x", 18)
      .attr("y", 10)
      .attr("text-anchor", "start")
      .style("alignment-baseline", "middle")
      .style("font-size", "11px")
      .style("fill", "#3A2C18")
      .text(screenTech);
  });
};