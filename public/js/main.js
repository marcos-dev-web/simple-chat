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

function newMessage(msg, cls, time, bg=undefined) {
  let li = document.createElement("li");
  let span = document.createElement("span");
  let p = document.createElement("p");
  if (bg) {
    li.style.backgroundColor = bg;
  }
  
  span.classList.add("hour");
  span.textContent = time;

  li.classList.add("msg");
  li.classList.add(cls);
  p.classList.add("msg_text");
  p.textContent = msg;
  li.appendChild(p);
  li.appendChild(span);
  box.appendChild(li);
  box.scroll(0, box.scrollHeight);
}

function send(bg=undefined) {
  if (input.value.length > 0) {
    const time = newTime();
    const valueMessage = input.value;
    newMessage(valueMessage, "me", time, bg);
    socket.emit("message", valueMessage, time);
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

socket.on("new_message", (msg, time) => {
  newMessage(msg, "he", time);
  nmsg++;
  document.title = `Chat - (${nmsg})`;
});