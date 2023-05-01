const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // get the file path from the request URL
  const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

  // check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.statusCode = 404;
      res.end('404 - Page not found');
      return;
    }

    // read the file and serve it
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('500 - Internal server error');
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', getContentType(filePath));
      res.end(data);
    });
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// function to get the content type based on file extension
function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
      return 'image/jpg';
    case '.gif':
      return 'image/gif';
    default:
      return 'text/plain';
  }
}