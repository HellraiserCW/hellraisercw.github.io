const { username } = (JSON.parse(atob(document.cookie.split('.')[1])));

const helloUser = document.querySelector('.hello-user');
helloUser.innerHTML += `
  <h5>Hello, ${username}!</h5>
`;

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-undef
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
});

const logoutButton = document.querySelectorAll('.logout');

async function logoutProfile() {
  document.cookie.split(';').forEach((c) => {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires= ${new Date().toUTCString()} ;path=/`);
  });
  try {
    await fetch('http://localhost:8080/logout', {
      method: 'GET',
    })
      .then(() => {
        window.location.href = 'http://localhost:8080/';
      });
  } catch (err) {
    console.log(err);
  }
}

logoutButton.forEach((b) => b.addEventListener('click', logoutProfile));

const assignTruckButton = document.querySelector('.assign');
const deleteTruckButton = document.querySelector('.deletetruck');
const dropdown = document.createElement('form');
dropdown.innerHTML = `
<a class='dropdown-trigger btn' href='#' data-target='dropdown1'>Update truck</a>
<ul id='dropdown1' class='dropdown-content'>
<li class='truck'><a>Sprinter</a></li>
<li class='truck'><a>Small straight</a></li>
<li class='truck'><a>Large straight</a></li>
</ul>
`;

const updateDiv = document.querySelector('.updateform');
updateDiv.appendChild(dropdown);

// eslint-disable-next-line no-undef
M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));

const cookieList = {};
document.cookie.split(';').forEach((cookie) => {
  // eslint-disable-next-line prefer-const
  let [name, ...rest] = cookie.split('=');
  name = name?.trim();
  if (!name) return;
  const value = rest.join('=').trim();
  if (!value) return;
  cookieList[name] = decodeURIComponent(value);
});

async function renderTruck(e) {
  try {
    await fetch(`http://localhost:8080/api/trucks/${e}`, {
      method: 'GET',
    }).then((res) => res.json().then((data) => {
      const truckId = document.querySelector('.truckid');
      const truckType = document.querySelector('.trucktype');
      const truckStatus = document.querySelector('.truckstatus');
      const truckAssigned = document.querySelector('.truckassigned');
      const truckCreatedDate = document.querySelector('.truckcreated-date');
      truckId.innerHTML = data.truck._id;
      truckType.innerHTML = data.truck.type;
      truckStatus.innerHTML = data.truck.status;
      truckAssigned.innerHTML = data.truck.assigned_to || 'null';
      truckCreatedDate.innerHTML = data.truck.created_date;
    }));
  } catch (err) {
    console.log(err);
  }
}

renderTruck(cookieList.truck_dataId);

async function updateTruck(e) {
  e.preventDefault();
  document.querySelectorAll('.message').forEach((el) => {
    el.style.display = 'none';
  });
  try {
    await fetch(`http://localhost:8080/api/trucks/${cookieList.truck_dataId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: e.target.innerText.toUpperCase(),
      }),
    })
      .then((res) => {
        if (res.status === 400) {
          res.json().then((data) => {
            const updateForm = document.querySelector('.deletetruck');
            updateForm.innerHTML += `
            <p class="error message">${data.message}</p>
            `;
          });
        } else if (res.status === 200) {
          res.json().then((data) => {
            const updateForm = document.querySelector('.deletetruck');
            updateForm.innerHTML += `
            <p class="success message">${data.message}</p>
            `;
          });
        }
      })
      .then(() => {
        renderTruck(cookieList.truck_dataId);
      });
  } catch (err) {
    console.log(err);
  }
}

const truck = document.querySelectorAll('.truck');
truck.forEach((e) => e.addEventListener('click', updateTruck));

async function assignTruck(e) {
  e.preventDefault();
  document.querySelectorAll('.message').forEach((el) => {
    el.style.display = 'none';
  });
  try {
    await fetch(`http://localhost:8080/api/trucks/${cookieList.truck_dataId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 400) {
          res.json().then((data) => {
            deleteTruckButton.innerHTML += `
            <p class="error message">${data.message}</p>
            `;
          });
        } else if (res.status === 200) {
          renderTruck(cookieList.truck_dataId);
        }
      });
  } catch (err) {
    console.log(err);
  }
}

assignTruckButton.addEventListener('click', assignTruck);

async function deleteTruck(e) {
  e.preventDefault();
  document.querySelectorAll('.message').forEach((el) => {
    el.style.display = 'none';
  });
  // eslint-disable-next-line no-alert, no-restricted-globals
  if (confirm('Do you really want to delete truck?')) {
    try {
      await fetch(`http://localhost:8080/api/trucks/${cookieList.truck_dataId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.status === 400) {
            res.json().then((data) => {
              deleteTruckButton.innerHTML += `
              <p class="error message">${data.message}</p>
              `;
            });
          } else if (res.status === 200) {
            window.location.href = 'http://localhost:8080/home.html';
          }
        });
    } catch (err) {
      console.log(err);
    }
  }
}

deleteTruckButton.addEventListener('click', deleteTruck);
