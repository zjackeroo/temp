/* global d3 */
export default function BarChart(container){
    const margin = ({top: 20, right: 30, bottom: 30, left: 50});
    const width = 450 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;
    
    const x = d3.scaleBand()
      .range([0, width])
      .paddingInner(0.1);
    const y = d3.scaleLinear()
     .range([height, 0]);
    
    const svg = d3.select(container)
      .append("svg")
      .attr("width", width+margin.left+margin.right)
      .attr("height", height+margin.top+margin.bottom+50)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`);
    
    svg.append("g")
      .attr("class", "y-axis");
    
    function update(data){
      x.domain(data.map(d => {
        return d[0]
      }));
      y.domain([0, d3.max(data, d => {
        console.log(d[1])
        return d[1]
      })]);
      
      svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("fill", "lightcoral")
        .attr("x", d=>x(d[0]))
        .attr("y", d=>y(d[1]))
        .attr('width', x.bandwidth())
        .attr("height", d=>height-y(d[1]))
      
    //   const xAxis = d3.axisBottom(x);
      const xAxis = d3.axisBottom(x);
      svg.select(".x-axis").call(xAxis)
                            .selectAll("text")
                            .attr("transform", "translate(-5,0)rotate(-25)")
                            .style("text-anchor", "end")
                            .style("font-size", 10)
                            .style("fill", "black")
      
      const yAxis = d3.axisLeft(y).ticks(4);
      svg.select(".y-axis").call(yAxis);
    }
    
    return {
      update
    }
    
  }


//   if (d[0]<=15) {return "Africa"}
//   else if (d[0]==20) {return "Antarctica"}
//   else if (d[0]<=60) {return "Asia"}
//   else if (d[0]==70) {return "Atlantic Ocean"}
//   else if (d[0]==80) {return "Bering Sea"}
//   else if (d[0]==90) {return "Caribbean"}
//   else if (d[0]==100) {return "Central America"}
//   else if (d[0]<=130) {return "Europe"}
//   else if (d[0]==140) {return "Middle East"}
//   else if (d[0]==150) {return "North America and Hawaii"}
//   else if (d[0]==160) {return "South America"}
//   else if (d[0]==170) {return "Central and South Pacific"}
//   else {return "Others"}