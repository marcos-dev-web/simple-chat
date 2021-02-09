let inputName = document.querySelector('#name');
let form = document.querySelector('form');

const alertMsg = (msg) => {
  let divMainMsg = document.createElement('div');
  let textMsg = document.createElement('p');

  divMainMsg.classList.add('box_alert');
  textMsg.classList.add('text_alert');

  textMsg.textContent = msg;

  divMainMsg.appendChild(textMsg);

  document.body.appendChild(divMainMsg);
  setTimeout(() => {
    document.body.removeChild(document.querySelector('.box_alert'));
  }, 3000);
}

const verify = (event) => {
  event.preventDefault();

  let name = inputName.value;

  if (name.length === 0) {
    alertMsg('field name is empty!');
    return;
  }

  if (name.length > 10) {
    alertMsg('max length name is 10');
    return;
  }

  let xhr = new XMLHttpRequest();
  xhr.open('POST', 'verifylogin');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = () => {
    let response = JSON.parse(xhr.responseText);
    if (response['msg'] === 'ok') {
      form.submit()
    } else {
      alertMsg(response['msg'])
    }
  }
  xhr.send(JSON.stringify({
    name: name
  }))
}

form.addEventListener('submit', verify);