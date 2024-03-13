const http = require('http');
const fs = require('fs');
const path = require('path');

const host = '0.0.0.0';
const port = 80;

var visCount = 0;

const server = http.createServer((req, res) => {

    console.log('Req::' + req.socket.remoteAddress + ':: ' + req.url);

    // Extract the URL path
    const urlPath = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(__dirname, urlPath);

    // Add a new visit to the counter
    if(req.url == '/') {

        fs.readFile(path.join(__dirname, '/src/count.js'), 'utf8', (err, data) => {
            if(err) {
                console.error(err);
            }
            else {
                visCount =  Number(data.substring(15).slice(0, -1)); // Rubbish stripping TODO: make better?
                visCount = visCount + 1;

                fs.writeFile(path.join(__dirname, '/src/count.js'), 'var visCount = ' +  String(visCount) + ';', err =>{
                    if(err) {
                        console.error(err);
                    }
                    else {
                        console.log('Visitor Count:: ' + visCount);
                    }
                });
            }
        });

    }

    // Check if the file exists
    fs.stat(filePath, (err, stats) => {
        if (err) {
            // If the file does not exist, send a 404 response
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('File not found');
        } else {
            // If the file exists, serve it
            res.writeHead(200, {'Content-Type': 'text/html'}); // You might need to adjust the content type based on the file
            const readStream = fs.createReadStream(filePath);
            readStream.pipe(res);
        }
    });
});

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});
