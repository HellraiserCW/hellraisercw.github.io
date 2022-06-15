const statusOK = 200;

function loadUsers() {
    const xhttp = new XMLHttpRequest();

    xhttp.open('GET', 'https://jsonplaceholder.typicode.com/users', true);

    onLoading();

    xhttp.onload = function() {
    if (xhttp.status !== statusOK) {
        alert(`Error ${xhttp.status}!`);
        } else {
            const users = JSON.parse(this.responseText);
            for (let i in users) {
                document.querySelector('.js-container').innerHTML += `<p class='users-card'>${users[i].name}</p>`
            }
        }
        hideLoading();
    }

    xhttp.onerror = function() {
        alert('Error!');
        hideLoading();
    }

    xhttp.send();
}

document.querySelector('.js').addEventListener('click', loadUsers, {once: true});

function fetchUsers() {
    fetch('https://jsonplaceholder.typicode.com/users')
    .then(onLoading())
    .then(response => response.json())
    .then((json) => {
        json.forEach(e => {
            document.querySelector('.fetch-container').innerHTML += `
            <div class='users-card'>
                <p class='name'>${e.name}</p>
                <div class='btn' id='${e.id}'>
                    <button class='edit'>Edit</button>
                    <button class='delete'>Delete</button>
                </div>
            </div>
            `
        });

        hideLoading();
    })
    .catch((error) => alert(error));
}

document.querySelector('.fetch').addEventListener('click', fetchUsers, {once: true});

function editUser(e) {
    if (e.target.classList.contains('edit')) {
        const form = document.createElement('form');
        const input = document.createElement('input');
        const saveButton = document.createElement('button');
        saveButton.setAttribute('type', 'button');
        saveButton.classList.add('save-btn');
        saveButton.innerText = 'Save';
        form.appendChild(input);
        form.appendChild(saveButton);
        const element = e.target.parentElement;

        document.querySelectorAll('.edit').forEach(() => {
            element.nextElementSibling === null ? element.parentElement.appendChild(form) : false;
        });

        saveButton.onclick = () => {
            const xhttp = new XMLHttpRequest();
            
            xhttp.open('PUT', `https://jsonplaceholder.typicode.com/users/${element.id}`, true);

            onLoading();
            
            xhttp.setRequestHeader('Content-Type', 'application/json');

            xhttp.onload = function() {
                if (xhttp.status !== statusOK) {
                    alert(`Error ${xhttp.status}!`);
                } else {
                    const userId = JSON.parse(this.responseText);
                    if (userId.name === '') {
                        alert('Enter new name');
                    } else {
                        e.target.parentElement.previousElementSibling.innerText = userId.name;
                        e.target.parentElement.parentElement.removeChild(form);
                    }
                }

                hideLoading();
            }

            xhttp.onerror = function() {
                alert('Error!');
                hideLoading();
            }

            xhttp.send(JSON.stringify({name: input.value}));
        }
    }
}

document.querySelector('.fetch-container').addEventListener('click', editUser);

function deleteUser(e) {
    document.querySelector('.fetch-container').removeEventListener('click', deleteUser);
    if (e.target.classList.contains('delete')) {
        const xhttp = new XMLHttpRequest();
        xhttp.open('DELETE', `https://jsonplaceholder.typicode.com/users/${e.target.parentElement.id}`, true);

        onLoading();

        xhttp.onload = function() {
            if (xhttp.status !== statusOK) {
                alert(`Error ${xhttp.status}!`);
            } else {
                alert(`User with id – ${e.target.parentElement.id} was deleted`);
                e.target.parentElement.parentElement.remove();
            }

            hideLoading();
        }

        xhttp.onerror = function() {
            alert('Error!');
            hideLoading();
        }

        xhttp.send();
    }
}

document.querySelector('.fetch-container').addEventListener('click', deleteUser);

function onLoading() {
    document.querySelector('.loading').classList.remove('hidden');
}

function hideLoading() {
    document.querySelector('.loading').classList.add('hidden');
}