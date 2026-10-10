// Load CSV relative to Data Exercise 6/index.html
d3.csv("data/Ex6_TVdata_withStar.csv", d => {
  return {
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize,
    screenTech: d.screenTech,
    energyConsumption: +d.energyConsumption,
    star: +d.star
  };
}).then(data => {
  console.log("Ex6 TV data loaded successfully:", data.length, "rows");

  drawHistogram(data);
  populateFilters(data);
  drawScatterplot(data);
  createTooltip();
  handleMouseEvents();
}).catch(error => {
  console.error("Error loading data/Ex6_TVdata_withStar.csv:", error);
});