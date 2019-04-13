const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

const server = http.createServer((req, res) => {
    let contentType = 'text/html';
    let myUrl = url.parse(req.url, true);

    //console.log(myUrl.pathname);

    let filePath = path.join(
        __dirname,
        'public',
        myUrl.pathname === '/' ? 'index.html' : myUrl.pathname.slice(1)
    );
    //console.log(req.url.slice(1));
    let extname = myUrl.pathname.split('.')[1];

    switch (extname) {
        case 'js':
            contentType = 'text/javascript';
            break;
        case 'css':
            contentType = 'text/css';
            break;
        case 'json':
            contentType = 'application/json';
            break;
        case 'jpg':
            contentType = 'image/jpeg';
            break;
    }

    if (contentType === 'text/html' && extname === '') {
        filePath += '.html';
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') {
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf8');
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            if (extname === 'json' && myUrl.query.q) {
                content = dataHandler(content, myUrl.query.q, myUrl.query.search);
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });
});

const dataHandler = (content, qValue1 = '', qvalue2 = '') => {
    let result = null;

    if (qValue1 === 'from') {
        if (qvalue2 !== '') {
            result = JSON.stringify(
                JSON.parse(content).filter(
                    flight =>
                        flight.to.toLowerCase() === 'tel-aviv' &&
                        qvalue2.toLowerCase() === flight.from.toLowerCase().slice(0, qvalue2.length)
                )
            );
        } else {
            result = JSON.stringify(
                JSON.parse(content).filter(flight => flight.to.toLowerCase() === 'tel-aviv')
            );
        }
    } else {
        if (qvalue2 !== '') {
            result = JSON.stringify(
                JSON.parse(content).filter(
                    flight =>
                        flight.to.toLowerCase() !== 'tel-aviv' &&
                        qvalue2.toLowerCase() === flight.to.toLowerCase().slice(0, qvalue2.length)
                )
            );
        } else {
            result = JSON.stringify(
                JSON.parse(content).filter(flight => flight.to.toLowerCase() !== 'tel-aviv')
            );
        }
    }
    return result;
};

const PORT = 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
