/* ========================================================
   Exercise 4.3 - 4.7: D3 Scaled Bar Chart with Labels
   ======================================================== */
const svgWidth = 720;  // Increased from 620 to give room for long brand names
const svgHeight = 700;

// Setup responsive SVG inside container
const svg = d3.select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

const createBarChart = data => {
  if (!data || data.length === 0) {
    console.error("No data provided to createBarChart");
    return;
  }

  // Increased from 110 to 170 to prevent names like "samsung electronics" from cutting off
  const labelMargin = 170; 
  const chartWidth = 430;  // Max bar width

  // 1. Linear Scale for counts (X-axis)
  const maxCount = d3.max(data, d => d.count) || 1000;
  const xScale = d3.scaleLinear()
    .domain([0, maxCount])
    .range([0, chartWidth]);

  // 2. Band Scale for brands (Y-axis)
  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, svgHeight])
    .paddingInner(0.25);

  // 3. Group container for each bar and text labels
  const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  // 4. Bar Rectangles
  barAndLabel
    .append("rect")
    .attr("class", d => `bar bar-${d.count}`)
    .attr("x", labelMargin)
    .attr("y", 0)
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", "#C9832A")
    .attr("rx", 3);

  // 5. Category Text (Brand names, right-aligned)
  barAndLabel
    .append("text")
    .text(d => d.brand)
    .attr("x", labelMargin - 12)          // Positioned just before the bar
    .attr("y", yScale.bandwidth() / 2 + 4) // Centered vertically
    .attr("text-anchor", "end")
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "13px")
    .style("font-weight", "500")
    .style("fill", "#3A2C18");

  // 6. Value Number Text (Counts placed at the end of each bar)
  barAndLabel
    .append("text")
    .text(d => d.count)
    .attr("x", d => labelMargin + xScale(d.count) + 8)
    .attr("y", yScale.bandwidth() / 2 + 4)
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "12px")
    .style("font-weight", "600")
    .style("fill", "#5A4527");
};

// Load data/tvBrandCount.csv
d3.csv("data/tvBrandCount.csv").then(rawData => {
  let processedData = [];

  const hasCountCol = rawData[0].hasOwnProperty("count") || rawData[0].hasOwnProperty("Count");

  if (hasCountCol) {
    processedData = rawData.map(d => ({
      brand: String(d.brand || d.Brand).trim().toLowerCase(),
      count: +(d.count || d.Count)
    })).filter(d => d.brand && !isNaN(d.count) && d.count > 0);
  } else {
    // Dynamic grouping if raw unaggregated data is supplied
    const brandKey = Object.keys(rawData[0]).find(k => k.toLowerCase().includes("brand")) || Object.keys(rawData[0])[0];
    const rolled = d3.rollup(
      rawData,
      v => v.length,
      d => (d[brandKey] ? String(d[brandKey]).trim().toLowerCase() : "unknown")
    );
    processedData = Array.from(rolled, ([brand, count]) => ({ brand, count }))
      .filter(d => d.brand && d.brand !== "unknown");
  }

  processedData.sort((a, b) => b.count - a.count);
  createBarChart(processedData.slice(0, 20));
}).catch(err => {
  console.error("Error reading data/tvBrandCount.csv:", err);
});