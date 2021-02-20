const box = document.querySelector(".box_message");
const socket = io();
var nmsg = 0;

let input = document.querySelector('input[type="text"]');

function getCookieName() {
  const cookies = document.cookie;
  let t1 = cookies.split(' ');
  let t2 = t1.map(item => item.split('='));
  let name = t2.find(item => item[0] === 'token-name')[1];
  return name;
}

function setTitle(title="Chat") {
  document.title = title;
}

function tratHour(value) {
  return value < 10 ? `0${value}` : value;
}

function newTime() {
  let time = new Date();
  let hours = time.getHours();
  let minutes = time.getMinutes();

  return `${tratHour(hours)}:${tratHour(minutes)}`;
}

const message = {
  create(msg, cls, time, name, fg = undefined) {
    const boxMain = document.createElement("li");
    const leftContainer = document.createElement('div');
    const rightContainer = document.createElement('div');
    const spanHour = document.createElement("span");
    const contentMessage = document.createElement("p");
    const spanNameId = document.createElement('span');

    leftContainer.classList.add('user_name_id');
    rightContainer.classList.add('content_box_message');
    spanNameId.classList.add('name_indentifier');
    spanHour.classList.add("hour");
    boxMain.classList.add("msg");
    contentMessage.classList.add("msg_text");

    if (fg) {
      spanNameId.style.color = fg;
    }

    spanNameId.textContent = name;
    spanHour.textContent = time;
    contentMessage.textContent = msg;

    leftContainer.appendChild(spanNameId);
    boxMain.classList.add(cls);
    rightContainer.appendChild(contentMessage)
    rightContainer.appendChild(spanHour)
    boxMain.appendChild(leftContainer);
    boxMain.appendChild(rightContainer);

    return boxMain;
  },
  render(containerMessage) {
    box.appendChild(containerMessage);
    let scrollHeight = box.scrollHeight
    box.scroll(0, scrollHeight);
  }
}

function send() {
  if (input.value.length > 0) {
    const name = document.querySelector('#user_name_field').textContent;
    const time = newTime();
    const valueMessage = input.value;

    let messageDiv = message.create(valueMessage, "me", time, 'me', 'springgreen');
    message.render(messageDiv);

    input.value = "";
    socket.emit("message", valueMessage, time, name);
    setTitle()
    nmsg = 0;
  }
}

function alertNewUser(name, logout=false) {
  let spanContainer = document.createElement('span');
  let textMsg = document.createElement('p');

  spanContainer.classList.add('new_user_container');
  textMsg.classList.add('msg_new_user');

  if (logout) {
    if (name.indexOf('<') === -1 && name.indexOf('>') === -1) {
      textMsg.innerHTML = `user <b>[${name}]</b> disconected from chat`;
    } else {
      return
    }
  } else {
    if (name.indexOf('<') === -1 && name.indexOf('>') === -1) {
      textMsg.innerHTML = `user <b>[${name}]</b> join in the chat`;
    } else {
      return
    }
  }

  spanContainer.appendChild(textMsg);
  document.body.appendChild(spanContainer);

  setTimeout(() => {
    document.body.removeChild(document.querySelector('.new_user_container'));
  }, 3000)
}

document.querySelector(".send").addEventListener("click", () => {
  send();
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    send();
  }
});

socket.on('connect', () => {
  let name = getCookieName();
  socket.emit('my_name', name)
})

socket.on('new_user', (name) => {
  alertNewUser(name)
})

socket.on("new_message", (msg, time, name) => {
  let divMessage = message.create(msg, "he", time, name);
  message.render(divMessage);
  nmsg++;
  if (!document.hasFocus()) {
    setTitle(`(${nmsg}) Chat`);
  }
});

socket.on('user_disconnected', (name) => {
  alertNewUser(name, logout=true)
})
