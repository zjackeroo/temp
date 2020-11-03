/* global d3 */
export default function ScatterPlot(container){
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const width = 450 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
  
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
  
    const svg = d3
      .select(".scatterplot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg.append("g")
       .attr("class", "x-axis")
       .attr("transform", `translate(0, ${height})`);
  
    svg.append("g")
       .attr("class", "y-axis");
    
    const brush = d3.brush()
      .extent([[0,0], [width, height]])
      .on("brush", brushed);
    
    svg.call(brush);
    
    const listeners = { "brush": null};
    
    function brushed(event){
      // convert pixel range to data range
      // [[x0, y0], [x1, y1]], where x0 is the minimum x-value,
      // y0 is the minimum y-value, x1 is the maximum x-value, and 
      // y1 is the maximum y-value
      const dataRange = event.selection.map(d=>[ x.invert(d[0]), y.invert(d[1]) ]);
      
      // take in to account that the y-scale range is [height, 0]
      const temp = dataRange[1][1];
      dataRange[1][1] = dataRange[0][1];
      dataRange[0][1] = temp;
      
      if (listeners["brush"]){
        listeners["brush"](dataRange);
      }
      
    }
    
    function update(data) {
        x.domain(d3.extent(data, d => d.EQ_PRIMARY));
        y.domain(d3.extent(data, d => Math.log(d.DEATHS)));
        
        svg
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("fill", "none")
        .attr("stroke", "lightcoral")
        .attr("stroke-width", 1)
        .attr("cx", d => x(d.EQ_PRIMARY))
        .attr("cy", d => y(Math.log(d.DEATHS)))
        .attr("r", 2);

        const xAxis = d3.axisBottom(x);
        svg.select(".x-axis").call(xAxis)
            .append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height+margin.top)
            .text("X axis title");

        const yAxis = d3.axisLeft(y);
        svg.select(".y-axis").call(yAxis)
            .append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left+20)
            .attr("x", -margin.top)
            .text("Y axis title")

    }
    
    function on(eventname, callback){
      listeners[eventname] = callback;
    }

    return { // public methods
      update,
      on
    }
  }
  