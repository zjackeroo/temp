import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

let fields;
//change data to earthquake
d3.csv('unemployment.csv', d3.autoType).then(data => {
    fields = data;
    //print to check
    console.log(fields);


    //create a similar total for total number of earthquakes in the whole world per year
    fields.forEach(
        d=>{
            d.total = d.Agriculture + d.Business_services + d.Construction + d.Education_and_Health + d.Finance + d.Government + d.Information + d.Leisure_and_hospitality + d.Manufacturing + d.Mining_and_Extraction + d.Other + d.Self_employed + d.Transportation_and_Utilities + d.Wholesale_and_Retail_Trade;
            console.log(d.total); 
        return d;}
    );

    //get the stacked chart -- > for countries individual
    let stackedAreaChart = StackedAreaChart(".stacked-area-chart");
    stackedAreaChart.update(fields);


    //get area chart --> for all countries
    let areaChart = AreaChart(".area-chart");
    areaChart.update(fields);
    areaChart.on("brushed", (range)=>{
        stackedAreaChart.filterByDate(range); 
    })

});