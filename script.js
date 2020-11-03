/* global d3 */

import BarChart from './BarChart.js';
import ScatterPlot from './ScatterPlot.js';

d3.csv("cleaned_2.csv", d3.autoType).then(data => {
  console.log(data);
  
  const scatterPlot = ScatterPlot(".scatterplot");
  const barChart = BarChart(".barchart");
  
  scatterPlot.update(data);

  // compute viewdata for a bar chart
  let region = d3.rollups(data, v=>v.length, d=>d.REGION_CODE);  
  barChart.update(region); //update the bar chart
  
  scatterPlot.on("brush", (dataRange)=>{
    console.log(dataRange);
    
    const filtered = data.filter(d=>
      dataRange[0][0] <= d.EQ_PRIMARY && 
      d.EQ_PRIMARY < dataRange[1][0] &&
      dataRange[0][1] <= d.EQ_PRIMARY && 
      d.DEATHS < dataRange[1][1]
    );
    
    // compute viewdata for a bar chart
    let region = d3.rollups(filtered, v=>v.length, d=>d.REGION_CODE);  
    barChart.update(region); //update the bar chart
  });
  
  
  

});
