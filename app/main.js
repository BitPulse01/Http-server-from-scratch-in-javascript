const net = require("net");
const { measureMemory } = require("vm");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        let message = "HTTP/1.1 200 OK\r\n\r\n";
        
        data = data.toString().split("\r\n")[0].split(" ");
        
        const ENDPOINTS = ["/", "/index.html"];
        
        let RequestData = {
            "method":data[0],
            "url_path":data[1],
            "HTTP_version":data[2]
        }
        
        if (ENDPOINTS.includes(RequestData['url_path'])) {
            message = "HTTP/1.1 200 OK\r\n\r\n";
            console.log('sent');
        } else{
            message = "HTTP/1.1 404 Not Found\r\n\r\n";
        }
        
        console.log(RequestData);
        console.log(message);
        socket.write(message);
    });

    socket.on("close", () => {
        socket.end();
    });
});

server.listen(4221, "localhost");
