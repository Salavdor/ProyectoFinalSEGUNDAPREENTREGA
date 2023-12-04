const socket = io();

let username = null;

const message = document.getElementById("message");
const btn = document.getElementById("send");
const output = document.getElementById("output");
const actions = document.getElementById("actions");
const connected = document.getElementById("usuarios");

if (!username) {
  Swal.fire({
    title: "¡Welcome to chat!",
    text: "Insert your username",
    input: "text",
    inputValidator: (value) => {
      if (!value) return "¡Your username is required!";
    },
  }).then((input) => {
    username = input.value;
    const socketID = socket.id
    socket.emit("newUser", {username,socketID});
    // connected.innerHTML += `<h5>🟢 ${username} </h5>`;
  });
}

btn.addEventListener("click", () => {
  socket.emit("chat:message", {
    username,
    message: message.value,
  });
  message.value = "";
});

socket.on("messages", (data) => {
  console.log(data);
  actions.innerHTML = "";
  const chatRender = data
    .map((msg) => {
      const time = msg.timestamp;
      const hora = time.substring(11, 16);
      return `<p><strong>${hora} -${msg.username} </strong>: ${msg.message}  </p> `;
    })
    .join(" ");
  output.innerHTML = chatRender;
});

message.addEventListener("keypress", () => {
  socket.emit("chat:typing", username);
});

socket.on("chat:typing", (data) => {
  actions.innerHTML = `<p>${data} is writing a message...</p>`;
});

socket.on("usuariosConectados", (data) => {
  connected.innerHTML = ""
    data.forEach((data) => {
      connected.innerHTML += `<h5>🟢 ${data.username} </h5>`;
    });
  
});




