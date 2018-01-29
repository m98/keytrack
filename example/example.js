var demoDiv = document.querySelector('.demo-div');
var demoPrependCounter = 0;
var ulElement = document.createElement('ul');
var liElement = [];

document.querySelector('.submited-text').appendChild(ulElement);
var prepend = function (e) {
    if (e) {
        e.preventDefault();
    }

    liElement[demoPrependCounter] = document.createElement('li');
    ulElement.appendChild(liElement[demoPrependCounter]);
    liElement[demoPrependCounter].innerHTML = document.querySelector('input').value;
    document.querySelector('input').value = '';
    demoPrependCounter++;

};
var form = document.querySelector('.demo-form');
form.addEventListener('submit', prepend);
