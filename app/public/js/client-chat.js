// yếu cầu server kết nối với client
const socket = io();

document.getElementById("form-messages").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = document.getElementById("input-messages").value;
  const acknowledgement = (error) => {
    if(error) { 
      alert("Không được chửi bậy");
    } else {
      console.log("Gui tin nhan thanh cong");
    }
  }
  
  //B1: gửi message lên cho server
  socket.emit('client chat', messageText, acknowledgement);
});

//B4: các client khác nhận được message
socket.on('send message to all client', (mess) => {
  console.log(mess);
})