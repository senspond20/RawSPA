var http = require('http');
var url = require('url');

var querystring = require('querystring'); 

var fs = require('fs')
var path = require('path');
var server = http.createServer(function(request,response){ 

    var urlPath = request.url.path;
    console.log(request.url)
    var parsedUrl = url.parse(request.url);
    console.log(parsedUrl);

    if(urlPath === ""){
        const index = fs.readFileSync(path.join(__dirname,"index.html"),"utf8");
        response.writeHead(200,{'Content-Type':'text/html'});
        response.end(index);
    }
   
    response.end();
});

server.listen(3000, function(){ 
    console.log('Server is running...');
});