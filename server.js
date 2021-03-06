const http = require('http');
const fs = require('fs');
const path = require('path');
const logger = require('pino')();

function sendFileContent(response, fileName, contentType){
  logger.info('file request', fileName);
	fs.readFile(fileName, function(err, data){
		if(err){
      logger.error(err);
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
		response.end();
	});
}

const router = function (request, response) {
  if(request.url === "/"){
  		sendFileContent(response, "index.html", "text/html");
  	} else if(/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString())){
  		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
  	}	else if(/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())){
  		sendFileContent(response, request.url.toString().substring(1), "text/css");
  	}	else if(/^\/[a-zA-Z0-9\/]*.gb/.test(request.url.toString())){
        sendFileContent(response, request.url.toString().substring(1), 'application/octet-stream');
  	} else {
      response.writeHead(404);
      response.write(`Ups nothing found here! Please go to <a href="${request.headers.host}"> http://${request.headers.host}</a>.`);
      response.end();
    }
}

const server = http.createServer(router);
server.listen(process.env.PORT || 8080);

logger.info(`server started [${process.env.npm_package_name}], [${process.env.npm_package_version}]`);
