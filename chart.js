const projectName = 'bar-chart';

let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

let reqs = new XMLHttpRequest();

let data,
    heightScale,
    xScale,
    xAxisScale,
    yAxisScale;
    
let values = [];

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select('svg')

let div = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .attr('id', 'tooltip')
            .style('opacity', 0);


let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let makeScales = () => {

    heightScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (dot) => {
                        return dot[1]
                    })])
                    .range([0, height - (2 * padding)])

    xScale = d3.scaleLinear()
                .domain([0, values.length - 1])
                .range([padding, width - padding])
                
                
   let datesArray = values.map((dot) => {
       return new Date(dot[0])
   }) 

   //console.log(datesArray);

   xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding, width - padding])

   yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (dot) => {
                        return dot[1]
                    })])
                    .range([height - padding, padding])
                
}
//data bars in the canvas
let drawBars = () => {

    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2 * padding)) / values.length)
        .attr('data-date', (dot) => {
            return dot[0]
        })
        .attr('data-gdp', (dot) => {
            return dot[1]
        })
        .attr('height', (dot) => {
            return heightScale(dot[1])
        })
        .attr('x', (dot, index) => {
            return xScale(index)
        })
        .attr('y', (dot) => {
            return (height - padding) - heightScale(dot[1])
        })
        .style('fill', '#1E90FF')
        .on('mouseover', function(d, ind) {
            div.transition()
                .duration(300)
                .style('opacity', 0.9);
            
            div.html(ind[0].substring(0, 4) + "<br/>" + "$" + ind[1])
                .style('left', d[0] + 'px')
                .style('top', d[0] + 'px')
                .attr('data-date', ind[0]);
        })
        .on('mouseout', (dot) => {
           div.transition()
                .duration(500)
                .style('opacity', 0);           
        }); 
}

//generate x and y axis
let generateAxis = () => {

    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)

    //set xAxis to the bottom of the canvas
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height-padding) + ')')
    //set yAxis to left of canvas
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
}

//async request for data
reqs.open('GET', url, true)
//when response is returned
reqs.onload = () => {
    //console.log(reqs.responseText)
    data = JSON.parse(reqs.responseText);
    values = data.data;
    console.log(values);

    drawCanvas();
    makeScales();
    drawBars();
    generateAxis();
}
reqs.send();