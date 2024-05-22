document.getElementById('downloadBtn').addEventListener('click', function() {
    const svg = document.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngData = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'grafo.png';
        downloadLink.href = pngData;
        downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + window.btoa(svgData);
});