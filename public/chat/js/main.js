const box = document.querySelector(".box_message");
const socket = io();
var nmsg = 0;

let input = document.querySelector('input[type="text"]');

function tratHour(value) {
  return value < 10 ? `0${value}` : value;
}

function newTime() {
  let time = new Date();
  let hours = time.getHours();
  let minutes = time.getMinutes();

  return `${tratHour(hours)}:${tratHour(minutes)}`;
}

function newMessage(msg, cls, time, name, fg = undefined) {
  let li = document.createElement("li"); //box message

  let divUserId = document.createElement('div'); //box left
  let divContentBoxMessage = document.createElement('div'); // box right

  let spanNameId = document.createElement('span'); // span name to box left

  divUserId.classList.add('user_name_id');
  divContentBoxMessage.classList.add('content_box_message');
  spanNameId.classList.add('name_indentifier');

  spanNameId.textContent = name;
  divUserId.appendChild(spanNameId); //done box left


  let span = document.createElement("span");
  let p = document.createElement("p");
  if (fg) {
    spanNameId.style.color = fg;
  }

  span.classList.add("hour");
  span.textContent = time;

  li.classList.add("msg");
  li.classList.add(cls);
  p.classList.add("msg_text");
  p.textContent = msg;

  divContentBoxMessage.appendChild(p)
  divContentBoxMessage.appendChild(span)

  li.appendChild(divUserId);
  li.appendChild(divContentBoxMessage);
  box.appendChild(li);
  box.scroll(0, box.scrollHeight);
}

function send() {
  if (input.value.length > 0) {
    let name = document.querySelector('#user_name_field').textContent;

    const time = newTime();
    const valueMessage = input.value;
    newMessage(valueMessage, "me", time, 'me', 'springgreen');
    socket.emit("message", valueMessage, time, name);
    input.value = "";
    document.title = "Chat";
    nmsg = 0;
    box.scroll(0, box.scrollHeight);
  }
}

document.querySelector(".send").addEventListener("click", () => {
  send();
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    send();
  }
});

socket.on("new_message", (msg, time, name) => {
  newMessage(msg, "he", time, name);
  nmsg++;
  document.title = `Chat - (${nmsg})`;
});

function alertNewUser(name, logout=false) {
  let msg = ''

  let spanContainer = document.createElement('span');
  let pMsg = document.createElement('p');

  spanContainer.classList.add('new_user_container');
  pMsg.classList.add('msg_new_user');
  if (logout) {
    msg = `user <b>[${name}]</b> disconneted from chat`;
  } else {
    msg = `user <b>[${name}]</b> join in the chat!`;
  }
  pMsg.innerHTML = msg

  spanContainer.appendChild(pMsg);
  
  document.body.appendChild(spanContainer);

  setTimeout(() => {
    document.body.removeChild(document.querySelector('.new_user_container'));
  }, 3000)
}

socket.on('connect', (sock) => {
  let name = document.cookie.split('=')[1]
  socket.emit('my_name', name)
})

socket.on('new_user', (name) => {
  alertNewUser(name, logout=false)
})

socket.on('user_disconnected', (name) => {
  alertNewUser(name, logout=true)
})