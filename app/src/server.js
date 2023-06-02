//require packages
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { createMessage } = require('./model/Message');
const { getUserList, addUser, deleteUser, findUser } = require('./model/UserList');
//set up express app
const app = express();
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

//create server based on app
const server = http.createServer(app);

const io = socketio(server);

io.on("connection", (socket) => {
    socket.on('join room', ({ room, username }) => {
        socket.join(room);

        const welcomeMessage = `Welcome to room ${room}`;
        const notificationMessage = `${username} vừa tham gia vào đoạn chat`;
        //Gửi message chào mừng
        socket.emit("welcome to cyberchat", createMessage(welcomeMessage));

        //Thông báo khi có một client mới tham gia. (Chỉ gửi cho những client khác)
        socket.broadcast.to(room).emit("send notification message", createMessage(notificationMessage));

        //B2: server bắt sự kiện, và nhận được message. START CHAT
        socket.on('client chat', (messageText, callback) => {
            const filter = new Filter();
            filter.addWords("cc", "dm", "vcl");

            //Kiểm tra tin nhắn có hợp lệ hay k
            if (filter.isProfane(messageText)) {
                return callback("error");
            }

            const id = socket.id;
            const user = findUser(id);

            //B3: server gửi message đó cho các client khác
            io.to(room).emit('send message to all client', createMessage(messageText, user.username));
            callback();
        })

        //Share location
        socket.on('send client location', ({ latitude, longitude }) => {
            const locationUrl = `https://www.google.com/maps/?q=${latitude},${longitude}`;
            io.to(room).emit('server send location', createMessage(locationUrl, user.username));
        })

        //add user
        const user = {
            id: socket.id,
            username, 
            room
        }
        addUser(user);
        //send userlist
        io.to(room).emit('server send userlist in a room', getUserList(room));

        socket.on("disconnect", () => {
            deleteUser(user.id);
            io.to(room).emit('server send userlist in a room', getUserList(room));
            console.log("client left");
        })
    })
}
)

const port = 3456;
server.listen(port, () => {
    console.log('App is listening on port ' + port);
});