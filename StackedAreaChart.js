export default function StackedAreaChart(container){

    // ==== Initialization ===
    const margin = { top: 40, right: 20, bottom: 40, left: 90 }
    const width = 700 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom; 

    let type = ""
    let selected = null, xDomain, data;
    let DATA;

    let svg = d3
        .select(".area-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    let clipPath = svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    let group = svg.append('g')

    const tooltip = svg
        .append("text")
        .text(type)
        .attr('x', 10)
        .attr('y', 5)
        .attr('font-size', 14);
    
    //=== Create & Initialize Scales ===

    let xScale = d3
        .scaleTime()
        .range([0,width])

    let yScale = d3
        .scaleLinear()
        .range([height,0])

    //=== Create & Initialize Axes ===

    let xAxis = d3.axisBottom()
        .scale(xScale)

    let yAxis = d3.axisLeft()
        .scale(yScale);

    let xAxisGroup = svg.append("g")
        .attr('class', 'axis x-axis')

    let yAxisGroup = svg.append('g')
        .attr('class', 'axis y-axis');

    //=== Update Main function to be used in click

   function updateMain(selected, data, svg){


        svg.select('axis y-axis').exit().remove()


       let colorScale = d3.scaleOrdinal(d3.schemeTableau10)
       .domain(data.columns.slice(1));

        let margin = { top: 40, right: 20, bottom: 40, left: 90 }
        let width = 710 - margin.left - margin.right
        let height = 400 - margin.top - margin.bottom; 

        let type = ""
        let selection;

       let xScale = d3
           .scaleTime()
           .range([0,width])

       let yScale = d3
           .scaleLinear()
           .range([height,0])

       //=== Create & Initialize Axes ===
       let xAxis = d3.axisBottom()
           .scale(xScale);

       let yAxis = d3.axisLeft()
           .scale(yScale);



        //change data components, instead of date --> year
       xScale.domain(xDomain? xDomain: d3.extent(data, d=>d.date));
       yScale.domain([0, d3.max(data, d=>d[selected])]);

           var area3 = d3.area()
           .x(function(d) { return xScale(d.date); })
           .y0(function() { return yScale(0); })
           .y1(function(d) { return yScale(d[selected]); });

           svg.append("path")
           .attr("class", "area3")
           .attr("fill", d=>colorScale(selected))
           .attr("clip-path", "url(#clip)")
           .on("click", (event, d) => {
               svg.selectAll('.area3').remove()
               update(data)
           })

           d3.select(".area3")
            .datum(data)
            .attr("d",area3)

           xAxisGroup.call(xAxis)
           yAxisGroup.call(yAxis)
           
        }

   //====Update function====
   function update(_data){ 
       console.log(_data)

       svg.selectAll('.area3').exit().remove()
       svg.select('axis y-axis').exit().remove()

       if (DATA == null){
           console.log(DATA)
           DATA = _data
       }

       selected = null
       data = _data;

       const keys = selected? [selected] : data.columns.slice(1)
       console.log(keys)
   
       let stack = d3.stack()
           .keys(data.columns.slice(1))
           .order(d3.stackOrderNone)
           .offset(d3.stackOffsetNone);
   
       let series = stack(data);

       //=== Update scales===

       xScale
           .domain(xDomain? xDomain: d3.extent(data, d=>d.date));
       yScale
           .domain([0, d3.max(data, d=>d.total)]);

       let colorScale = d3.scaleOrdinal(d3.schemeTableau10)
           .domain(data.columns.slice(1));

        //=== Create the new area for stack ===
        
       let area2 = d3.area()
           .x(d=>xScale(d.data.date))
           .y0(d=>yScale(d[0]))
           .y1(d=>yScale(d[1]))

        const areas = group.selectAll('.area2')
            .data(series, (d) => d.key);

       svg.select('.x-axis')
           .call(xAxis)
           .attr("transform", `translate(0, ${height})`);
           
       svg.select('.y-axis')
           .call(yAxis)

        //=== Create the paths ===
        areas.enter()
            .append('path')
            .attr('class', 'area2')
            .attr("fill", d=>colorScale(d.key))
            .attr("clip-path", "url(#clip)")
            .on("mouseover", (event, d, i) => tooltip.text((d.key).replace(/_/g,' ')))
            .on("mouseout", (event, d, i) => tooltip.text(""))
            .on("click", (event, d) => {
                    selected = d.key;
                    svg.selectAll('path').remove()
                    updateMain(selected, DATA, svg)
            })
            .merge(areas)
            .attr("d", area2)  

        areas.exit().remove()
   }

   function filterByDate(range){
       xDomain = range; 

       if (selected != null){
           updateMain(selected, data, svg)
       }
       if (selected == null) {
           update(data); 
       }
   }
   return {
       updateMain,
       update,
       filterByDate
   }
   
};
