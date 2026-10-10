let histTooltip; // Global reference for histogram tooltip

const drawHistogram = (data) => {
  // Clear any existing chart elements
  d3.select("#histogram").selectAll("*").remove();

  // Set the dimensions and margins of the chart area
  const svg = d3.select("#histogram")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Histogram of TV energy consumption");

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const bins = binGenerator(data);

  const minEng = bins[0].x0;
  const maxEng = bins[bins.length - 1].x1;
  const binsMaxLength = d3.max(bins, d => d.length);

  xScale
    .domain([minEng, maxEng])
    .range([0, innerWidth]);

  yScale
    .domain([0, binsMaxLength])
    .range([innerHeight, 0])
    .nice();

  // 1. Draw histogram bars first
  innerChart.selectAll("rect.hist-bar")
    .data(bins)
    .join("rect")
      .attr("class", "hist-bar")
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0)))
      .attr("height", d => innerHeight - yScale(d.length))
      .attr("fill", barColor)
      .attr("stroke", bodyBackgroundColor)
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseenter", (e, d) => {
        d3.select(e.currentTarget).attr("fill", "#E9A63C");

        if (histTooltip) {
          // Bring tooltip to front above all bars
          histTooltip.raise();

          histTooltip.select("text").text(`Count: ${d.length}`);

          const barW = Math.max(0, xScale(d.x1) - xScale(d.x0));
          const barX = xScale(d.x0) + barW / 2;
          const barY = yScale(d.length);

          const tooltipW = 100;
          const tooltipH = 30;

          // Boundary checks: keep inside left and right edges
          let posX = Math.max(4, Math.min(innerWidth - tooltipW - 4, barX - tooltipW / 2));

          // Boundary checks: if bar is too tall, show tooltip inside top of the bar
          let posY = (barY < 36) ? barY + 10 : barY - tooltipH - 6;

          histTooltip
            .attr("transform", `translate(${posX}, ${posY})`)
            .transition().duration(150)
            .style("opacity", 1);
        }
      })
      .on("mouseleave", (e) => {
        d3.select(e.currentTarget).attr("fill", barColor);
        if (histTooltip) {
          histTooltip.transition().duration(150).style("opacity", 0);
        }
      });

  // 2. Add Axes
  const xAxis = d3.axisBottom(xScale);
  innerChart.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale);
  innerChart.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

  // Axis Labels
  innerChart.append("text")
    .attr("class", "axis-label")
    .attr("x", innerWidth)
    .attr("y", innerHeight + 40)
    .attr("text-anchor", "end")
    .text("Labeled Energy Consumption (kWh/year)");

  innerChart.append("text")
    .attr("class", "axis-label")
    .attr("x", 0)
    .attr("y", -15)
    .attr("text-anchor", "start")
    .text("Frequency");

  // 3. Create Histogram Tooltip AFTER bars and axes so it always renders on top
  histTooltip = innerChart.append("g")
    .attr("class", "hist-tooltip")
    .style("opacity", 0)
    .style("pointer-events", "none");

  histTooltip.append("rect")
    .attr("width", 100)
    .attr("height", 30)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", "#3A2C18")
    .attr("fill-opacity", 0.95);

  histTooltip.append("text")
    .attr("x", 50)
    .attr("y", 19)
    .attr("text-anchor", "middle")
    .attr("fill", "#ffffff")
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "12px")
    .style("font-weight", "600");
};