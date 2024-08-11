const net = require("net");
const files_handler = require("fs");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        let Request = data.toString().split("\r\n")
        let Request_Info = Request[0].split(" ");
        let Request_Header = Request[1].split(": ");
        
        let RequestData = {
            "method" : Request_Info[0].toString(),
            "url_path" : Request_Info[1].toString(),
            "HTTP_version" : Request_Info[2].toString(),
            "User-agent" : Request_Header[1].toString(),
        }
        
        if (RequestData['url_path'] == "/") {
            let message = "HTTP/1.1 200 OK\r\n\r\n";
            
            console.log(message);
            socket.write(message);

        } else if (RequestData['url_path'].toString().includes("/echo/")){
            let echoMessage = RequestData['url_path'].toString().split("/echo/")[1].toString();
            
            let message = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${echoMessage.length}\r\n\r\n${echoMessage}`

            console.log(message);
            socket.write(message);

        } else if (RequestData['url_path'] == "/user-agent"){
            let UserAgent = RequestData['User-agent'];
            let message = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${UserAgent.length}\r\n\r\n${UserAgent}`;


            console.log(message);
            socket.write(message);

        } else if (RequestData['url_path'].toString().startsWith('/files/')){
            let File_Path = RequestData['url_path'].split("/files/")[1]
            
            files_handler.readFile(`j:/projects/JSProjects/9.HTTP_server_from_scratch/codecrafters-http-server-javascript/app/${File_Path}`, (err, content) => {
                if (err){
                    let message = "HTTP/1.1 404 Not Found\r\n\r\n";
            
                    console.log(message);
                    socket.write(message);
                } else {
                    let message = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${data.length}\r\n\r\n${content}`;

                    console.log(content.toString());
                    socket.write(message);
                }
            });


        } else {
            let message = "HTTP/1.1 404 Not Found\r\n\r\n";
            
            console.log(message);
            socket.write(message);
        }
       
        console.log(RequestData);
    });

    socket.on("close", () => {
        socket.end();
    });
});

server.listen(4221, "localhost");
