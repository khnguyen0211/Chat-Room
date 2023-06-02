// yếu cầu server kết nối với client
const socket = io();

document.getElementById("form-messages").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = document.getElementById("input-messages").value;
  const acknowledgement = (error) => {
    if (error) {
      alert("Không được chửi bậy ở đây");
    } else {
      console.log("Gửi tin nhắn thành công");
      
    }
  }
  document.getElementById('input-messages').value = '';
  //B1: gửi message lên cho server
  socket.emit('client chat', messageText, acknowledgement);
});


//B4: các client khác nhận được message
socket.on('send message to all client', (mess) => {
  const oldMessage = document.getElementById('listMessage').innerHTML;

  const listChat = ` <div class="message-item">
  <div class="message__row1">
    <p class="message__name">${mess.username}</p>
    <p class="message__date">${mess.time}</p>
  </div>
  <div class="message__row2">
    <p class="message__content">
      ${mess.text}
    </p>
  </div>
</div>`
  let newMessage = oldMessage + listChat;
  document.getElementById('listMessage').innerHTML = newMessage;
})


document.getElementById('btn-share-location').addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Trình duyệt đang dùng không hỗ trợ");
  }
  navigator.geolocation.getCurrentPosition((pos) => {
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;

    socket.emit('send client location', { latitude, longitude });
  });
})

socket.on('server send location', (data) => {
  const oldMessage = document.getElementById('listMessage').innerHTML;

  const listChat = ` <div class="message-item">
  <div class="message__row1">
    <p class="message__name">${data.username}</p>
    <p class="message__date">${data.time}</p>
  </div>
  <div class="message__row2">
    <p class="message__content">
    <a href=${data.text} target=”_blank”>${data.username}'s Location</a>
      
    </p>
  </div>
</div>`
  let newMessage = oldMessage + listChat;
  document.getElementById('listMessage').innerHTML = newMessage;
})

socket.on("welcome to cyberchat", (welcomeMessage) => {
  console.log(welcomeMessage);
})
socket.on("send notification message", (notificationMessage) => {
  console.log(notificationMessage);
})

//sử lý querystring
const querystring = location.search;

const { room, username } = Qs.parse(querystring, { ignoreQueryPrefix: true });

socket.emit('join room', { room, username });

socket.on('server send userlist in a room', (userList) => {
  let content = '';
  let i = 1;
  for (const user of userList) {
    content += `<li class="app__item-user">${i}. ${user.username}</li>`;
    i++;
  }
  document.getElementById('list_user').innerHTML = content;
  document.getElementById('roomName').innerHTML = room;
  console.log(content);
})