




fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(response => response.json())
  .then(data => {
    
    const dataset = data.monthlyVariance;

    
    const margin = { top: 50, right: 50, bottom: 100, left: 100 };
    const width = 1200 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const uniqueYears = Array.from(new Set(dataset.map(d => d.year)));
const numYears = uniqueYears.length;
      const cellWidth = width / numYears;
      const cellHeight = height / 12;

    const svg = d3.select('body')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([d3.min(dataset, d => d.year), d3.max(dataset, d => d.year)])
        .range([0, width])


    const yScale = d3.scaleBand()
      .domain(d3.range(0, 12))
      .range([0, height]);

    

    const colorScale = d3.scaleQuantile()
      .domain([d3.min(dataset, d => d.variance), d3.max(dataset, d => d.variance)])
      .range(['red', 'blueviolet', 'purple', 'green']);

      
    svg.selectAll('.cell')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', d => xScale(d.year))
      .attr('y', d => yScale(d.month))
      
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr('fill', d=>colorScale(d.variance))
      .attr('data-month', d => {
        if(d.month > 0 && d.month <= 11){
            return d.month
        }else{
            return 0
        }
      })
      .attr('data-year', d => {
        if(d.year >= d3.min(dataset, d => d.year) && d.year <= d3.max(dataset, d => d.year)){
            return d.year
        }else{
            return null
        }
      })
      .attr('data-temp', d => d.variance)
      
      
    
    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))

    svg.append('g')
      .attr('id', 'y-axis')
      .call(d3.axisLeft(yScale).tickFormat(month => {
        const date = new Date(2000, month );
        return d3.timeFormat('%B')(date);
       }))
    


    svg.append('text')
      .attr('id', 'title')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('Global Temperature Variance');

    svg.append('text')
      .attr('id', 'description')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom / 2)
      .attr('text-anchor', 'middle')
      .text('Base Temperature: ' + data.baseTemperature);

    
    const legend = svg.append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${width-200},${height + margin.bottom - 50})`);

    const legendScale = d3.scaleLinear()
      .domain([d3.min(dataset, d => d.variance), d3.max(dataset, d => d.variance)])
      .range([0, 200]);

    const legendAxis = d3.axisBottom(legendScale)
        .tickValues(colorScale.domain())
        .tickFormat(d3.format('.1f'));

    legend.append('g')
        .attr('class', 'legend-axis')
        .attr('transform', 'translate(0, 20)')
        .call(legendAxis);

    legend.selectAll('.legend-rect')
    .data(colorScale.range().map(color => {
        const d = colorScale.invertExtent(color);
        if (d[0] === null) d[0] = legendScale.domain()[0];
        if (d[1] === null) d[1] = legendScale.domain()[1];
        return d;
    }))
      .enter()
      .append('rect')
      .attr('class', 'legend-rect')
      .attr('x', d => legendScale(d[0]))
      .attr('y', 0)
      .attr('width', d => legendScale(d[1]) - legendScale(d[0]))
      .attr('height', 20)
      .attr('fill', d => colorScale(d[0]));

      

        const tooltip = d3.select('body')
        .append('div')
        
        .style('opacity', 0)
        .attr('id', 'tooltip')

     svg.selectAll('.cell')
        .on('mouseover',(e, d) => 
            tooltip.style('opacity', 0.9)
            
            .html(
                'Year: ' + d.year + '<br>' +
                'Month: ' + d.month + '<br>' +
                'Temp: ' + (data.baseTemperature + d.variance).toFixed(2) + '<br>'
            )
            .attr('data-year', d.year)
            
            
            
        ) 
        .on('mouseout', (e, d) => 
            tooltip.style('opacity', 0)
        )  
    
    
    
  })
  .catch(error => console.log('Error fetching data:', error));