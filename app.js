document.getElementById('graphForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const startNode = document.getElementById('startNode').value.trim().toLowerCase();
    const distanceAB = parseInt(document.getElementById('distanceAB').value);
    const distanceAC = parseInt(document.getElementById('distanceAC').value);
    const distanceAD = parseInt(document.getElementById('distanceAD').value);
    const distanceBC = parseInt(document.getElementById('distanceBC').value);
    const distanceBD = parseInt(document.getElementById('distanceBD').value);
    const distanceCD = parseInt(document.getElementById('distanceCD').value);

    // Actualizar el grafo con los valores ingresados por el usuario
    graph.a.b = distanceAB;
    graph.a.c = distanceAC;
    graph.a.d = distanceAD;
    graph.b.c = distanceBC;
    graph.b.d = distanceBD;
    graph.c.d = distanceCD;

    if (graph[startNode]) {
        const path = findShortestPath(startNode, 'd');
        visualizeGraph(path);
    } else {
        alert('Nodo inicial no válido. Introduzca a, b o c.');
    }
});

const graph = {
    a: { b: 0, c: 0, d: 0 },
    b: { c: 0, d: 0 },
    c: { d: 0 },
    d: {} // Agregar el nodo "d" vacío
};

// Porcentajes para cada nodo
const percentages = {
    a: 0.4, // Nodo A con el porcentaje más alto SI TENIA
    b: 1.5, // Nodo B con el segundo porcentaje más alto ALCOHOL
    c: 0.5, // Nodo C con el tercer porcentaje más alto ESTADO ANIMO
    d: 0.2  // Nodo D con el porcentaje más bajo CLASES
};

// Calcular las heurísticas en función de los porcentajes
const heuristics = {};
for (let node in graph) {
    heuristics[node] = Object.keys(graph[node]).reduce((sum, neighbor) => sum + graph[node][neighbor], 0) * percentages[node];
}

// El resto del código permanece igual

function findShortestPath(start, goal) {
    const openSet = new Set([start]);
    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    for (let node in graph) {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
    }

    gScore[start] = 0;
    fScore[start] = heuristics[start];

    while (openSet.size > 0) {
        let current = [...openSet].reduce((a, b) => fScore[a] < fScore[b] ? a : b);

        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        openSet.delete(current);

        for (let neighbor in graph[current]) {
            let tentative_gScore = gScore[current] + graph[current][neighbor];

            if (tentative_gScore < gScore[neighbor]) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentative_gScore;
                fScore[neighbor] = gScore[neighbor] + heuristics[neighbor];
                openSet.add(neighbor);
            }
        }
    }

    return [];
}

function reconstructPath(cameFrom, current) {
    const totalPath = [current];
    while (current in cameFrom) {
        current = cameFrom[current];
        totalPath.unshift(current);
    }
    return totalPath;
}

function visualizeGraph(path) {
    const svg = d3.select('svg');
    svg.selectAll('*').remove();

    const nodes = Object.keys(graph).map(node => ({ id: node }));
    const links = [];

    for (let node in graph) {
        for (let neighbor in graph[node]) {
            links.push({ source: node, target: neighbor, value: graph[node][neighbor] });
        }
    }

    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.value * 50))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(300, 200));

    const color = d3.scaleOrdinal(d3.schemeCategory10); // Define a color scale

    const link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('class', 'link')
        .attr('stroke-width', 2)
        .attr('stroke', d => path.includes(d.source.id) && path.includes(d.target.id) ? 'red' : '#999');

    // Añadir etiquetas de texto para los pesos de las aristas
    svg.selectAll('.linkLabel')
        .data(links)
        .enter().append('text')
        .attr('class', 'linkLabel')
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2)
        .text(d => d.value)
        .attr('fill', 'black')
        .attr('font-size', '10px')
        .attr('text-anchor', 'middle');

    const node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('class', 'node')
        .attr('r', 10)
        .attr('fill', d => path.includes(d.id) ? 'red' : color(d.id)) // Use the color scale
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    node.append('title')
        .text(d => d.id);

    simulation
        .nodes(nodes)
        .on('tick', ticked);

    simulation.force('link')
        .links(links);

    function ticked() {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        // Actualizar la posición de las etiquetas de texto de los pesos de las aristas
        svg.selectAll('.linkLabel')
            .attr('x', d => (d.source.x + d.target.x) / 2)
            .attr('y', d => (d.source.y + d.target.y) / 2);
            
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    }

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

// Agregar la funcionalidad del botón Mostrar Tabla
document.getElementById('showTable').addEventListener('click', function() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    for (let node in graph) {
        for (let neighbor in graph[node]) {
            if (graph[node][neighbor] > 0) {
                const row = document.createElement('tr');
                const cellFrom = document.createElement('td');
                const cellTo = document.createElement('td');
                const cellDistance = document.createElement('td');

                cellFrom.textContent = node.toUpperCase();
                cellTo.textContent = neighbor.toUpperCase();
                cellDistance.textContent = graph[node][neighbor];

                row.appendChild(cellFrom);
                row.appendChild(cellTo);
                row.appendChild(cellDistance);

                tableBody.appendChild(row);
            }
        }
    }

    document.getElementById('graphTable').style.display = 'block';
});
