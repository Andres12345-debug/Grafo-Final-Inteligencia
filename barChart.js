document.getElementById('showBarChart').addEventListener('click', function() {
    const data = [
        { node: 'A', percentage: 0.4 },
        { node: 'B', percentage: 1.5 },
        { node: 'C', percentage: 0.5 },
        { node: 'D', percentage: 0.2 }
    ];

    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
          width = 600 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    // Clear the previous chart if it exists
    d3.select('#barChart').selectAll('*').remove();

    const svg = d3.select('#barChart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const x = d3.scaleBand()
        .domain(data.map(d => d.node))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.percentage)])
        .nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.node))
        .range(d3.schemeCategory10);  // Use a predefined color scheme

    svg.append('g')
        .selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.node))
        .attr('y', d => y(d.percentage))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.percentage))
        .attr('fill', d => color(d.node));

    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y));

    // Add text labels for each bar
    svg.selectAll('.text')
        .data(data)
        .enter().append('text')
        .attr('class', 'label')
        .attr('x', (d) => x(d.node) + x.bandwidth() / 2)
        .attr('y', (d) => y(d.percentage) - 5)
        .attr('dy', '.75em')
        .attr('text-anchor', 'middle')
        .text((d) => d.percentage);
});