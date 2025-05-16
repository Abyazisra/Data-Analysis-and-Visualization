const data = [
    { x: 30, y: 20 },
    { x: 85, y: 90 },
    { x: 160, y: 60 },
    { x: 240, y: 120 },
    { x: 290, y: 150 },
    { x: 350, y: 190 },
];

const width = 500;
const height = 400;
const margin = { top: 20, right: 30, bottom: 30, left: 40 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Scales
const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x)])
    .range([0, width - margin.left - margin.right]);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)])
    .range([height - margin.top - margin.bottom, 0]);

// Tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "white")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("font-size", "12px")
    .style("display", "none");

// Initial Color scale
let colorScale = d3.scaleSequential(d3.interpolateViridis)
    .domain([0, d3.max(data, d => d.y)]);

// Circle radius (default size)
let circleRadius = 5;

// Create circles (scatter plot points)
let circles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", circleRadius)
    .attr("fill", d => colorScale(d.y))
    .attr("class", "scatter-point")
    .on("mouseover", function(event, d) {
        tooltip.style("display", "block")
            .html(`x: ${d.x}, y: ${d.y}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        
        d3.select(this).attr("r", 8).attr("stroke", "black").attr("stroke-width", 2);
    })
    .on("mousemove", function(event) {
        tooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", function() {
        tooltip.style("display", "none");
        d3.select(this).attr("r", circleRadius).attr("stroke", "none");
    })
    .on("click", function() {
        circles.classed("highlighted", false);
        d3.select(this).classed("highlighted", true);
        d3.select(this).attr("stroke", "orange").attr("stroke-width", 3);
    });

// Axes
svg.append("g")
    .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
    .call(d3.axisBottom(x));

svg.append("g")
    .call(d3.axisLeft(y));

// Button actions

// Change color scale on button click
d3.select("#colorScaleBtn").on("click", function() {
    // Switch between color scales
    if (colorScale === d3.scaleSequential(d3.interpolateViridis)) {
        colorScale = d3.scaleSequential(d3.interpolateReds)
            .domain([0, d3.max(data, d => d.y)]);
    } else {
        colorScale = d3.scaleSequential(d3.interpolateViridis)
            .domain([0, d3.max(data, d => d.y)]);
    }

    // Transition circles to new color scale
    circles.transition()
        .duration(500)
        .attr("fill", d => colorScale(d.y));  // Ensure the fill is updated properly
});

// Toggle point size on button click
d3.select("#sizeBtn").on("click", function() {
    // Toggle between smaller and larger point size
    circleRadius = (circleRadius === 5) ? 10 : 5;

    // Update circle sizes
    circles.transition()
        .duration(500)
        .attr("r", circleRadius);
});
