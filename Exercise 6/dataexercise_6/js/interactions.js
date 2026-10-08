// --- Exercise 6.2: Filter Buttons with Tooltip Support ---
const populateFilters = (data) => {
  d3.select("#filters_screen")
    .selectAll(".filter")
    .data(filters_screen)
    .join("button")
      .attr("class", d => `filter ${d.isActive ? "active" : ""}`.trim())
      .text(d => d.label)
      .on("click", (e, d) => {
        if (!d.isActive) {
          filters_screen.forEach(filter => {
            filter.isActive = d.id === filter.id;
          });

          d3.selectAll("#filters_screen .filter")
            .classed("active", filter => filter.id === d.id);

          updateHistogram(d.id, data);
        }
      });

  const updateHistogram = (filterId, rawData) => {
    const updatedData = filterId === "all"
      ? rawData
      : rawData.filter(tv => tv.screenTech === filterId);

    const updatedBins = binGenerator(updatedData);

    // Hide tooltip during filter transitions
    if (histTooltip) {
      histTooltip.style("opacity", 0);
    }

    // Animate bars and re-bind new bin counts for mouse events
    d3.selectAll("#histogram rect.hist-bar")
      .data(updatedBins)
      .on("mouseenter", (e, d) => {
        d3.select(e.currentTarget).attr("fill", "#E9A63C");

        if (histTooltip) {
          histTooltip.select("text").text(`Count: ${d.length}`);
          const barX = xScale(d.x0) + Math.max(0, xScale(d.x1) - xScale(d.x0)) / 2;
          const barY = yScale(d.length);
          histTooltip
            .attr("transform", `translate(${barX - 50}, ${barY - 36})`)
            .transition().duration(150)
            .style("opacity", 1);
        }
      })
      .on("mouseleave", (e) => {
        d3.select(e.currentTarget).attr("fill", barColor);
        if (histTooltip) {
          histTooltip.transition().duration(150).style("opacity", 0);
        }
      })
      .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));
  };
};

// --- Exercise 6.4: Scatterplot Tooltips ---
const createTooltip = () => {
  const tooltip = innerChartS
    .append("g")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("pointer-events", "none");

  tooltip.append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill", barColor)
    .attr("fill-opacity", 0.85);

  tooltip.append("text")
    .text("NA")
    .attr("x", tooltipWidth / 2)
    .attr("y", tooltipHeight / 2 + 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("fill", "white")
    .style("font-weight", 700);
};

const handleMouseEvents = () => {
  innerChartS.selectAll("circle")
    .on("mouseenter", (e, d) => {
      d3.select(".tooltip text")
        .text(`${d.screenSize}"`);

      const cx = e.target.getAttribute("cx");
      const cy = e.target.getAttribute("cy");

      d3.select(".tooltip")
        .attr("transform", `translate(${cx - 0.5 * tooltipWidth}, ${cy - 1.5 * tooltipHeight})`)
        .transition()
          .duration(150)
          .style("opacity", 1);
    })
    .on("mouseleave", () => {
      d3.select(".tooltip")
        .style("opacity", 0)
        .attr("transform", `translate(0, 500)`);
    });
};