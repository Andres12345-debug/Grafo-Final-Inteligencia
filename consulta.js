document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/consultaEncuestados')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const encuestadosBody = document.getElementById('encuestadosBody');
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.documento}</td>
                    <td>${item.nombre}</td>
                    <td>${item.nivelAlcohol}</td>
                    <td>${item.nivelAnimo}</td>
                    <td>${item.responsabilidades}</td>
                `;
                encuestadosBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
            document.getElementById('encuestadosBody').innerHTML = '<tr><td colspan="5">Error loading data</td></tr>';
        });
});
document.getElementById('showEncuestados').addEventListener('click', function() {
    var table = document.getElementById('encuestadosTable');
    table.style.display = (table.style.display === 'none' || table.style.display === '') ? 'block' : 'none';
});


