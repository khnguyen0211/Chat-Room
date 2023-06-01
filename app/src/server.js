//require packages
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
//set up express app
const app = express();
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

//create server based on app
const server = http.createServer(app);

const io = socketio(server);

io.on("connection", (socket) => {

    //B2: server bắt sự kiện, và nhận được message
    socket.on('client chat', (messageText, callback) => {
        const filter = new Filter();
        filter.addWords("cc", "dm", "vcl");
        //Kiểm tra tin nhắn có hợp lệ hay k
        if(filter.isProfane(messageText)) {
            return callback("error");
        }
        //B3: server gửi message đó cho các client khác
        io.emit('send message to all client', messageText);
        callback();
    })

    socket.on("disconnect", () => {
        console.log("client left");
    })
}
)

const port = 3456;
server.listen(port, () => {
    console.log('App is listening on port ' + port);
});