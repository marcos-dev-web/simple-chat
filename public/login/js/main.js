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

  form.submit();
}

form.addEventListener('submit', verify);