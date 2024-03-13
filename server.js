// server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const host = '0.0.0.0';
const port = 80; // You can change this to any port you want

var visCount = 0;

const server = http.createServer((req, res) => {

    console.log('Req::' + req.socket.remoteAddress + ':: ' + req.url);

    // Define the root directory for serving files
    const rootDir = path.join(__dirname, ''); // Assuming 'public' is your directory

    // Extract the URL path
    const urlPath = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(rootDir, urlPath);

    // Add a new visit to the counter
    if(req.url == '/') {

        fs.readFile(path.join(rootDir, '/src/count.js'), 'utf8', (err, data) => {
            if(err) {
                console.error(err);
            }
            else {
                console.log(data.substring(15).slice(0, -1));
                visCount =  Number(data.substring(15).slice(0, -1));
                visCount = visCount + 1;

                fs.writeFile(path.join(rootDir, '/src/count.js'), 'var visCount = ' +  String(visCount) + ';', err =>{
                    if(err) {
                        console.error(err);
                    }
                    else {
                        console.log('added 1 to vis count');
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
