const { username, role } = (JSON.parse(atob(document.cookie.split('.')[1])));
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

const settingsButton = document.querySelector('.settings');

async function settingsProfile() {
  try {
    await fetch('http://localhost:8080/api/users/me', {
      method: 'GET',
    })
      .then(() => {
        window.location.href = 'http://localhost:8080/settings.html';
      });
  } catch (err) {
    console.log(err);
  }
}

settingsButton.addEventListener('click', settingsProfile);

async function detailsTruck(e) {
  try {
    await fetch(`http://localhost:8080/api/trucks/${e.target.id}`, {
      method: 'GET',
    })
      .then((res) => res.json().then((data) => {
        document.cookie = `truck_dataId=${data.truck._id}; path=/`;
      }));
    window.location.href = 'http://localhost:8080/truckdetails.html';
  } catch (err) {
    console.log(err);
  }
}

async function getUserTrucks() {
  try {
    await fetch('http://localhost:8080/api/trucks', {
      method: 'GET',
    })
      .then((res) => res.json().then((data) => {
        const status = document.querySelector('.status');
        status.innerHTML = '';
        const createdTruck = document.createElement('table');
        createdTruck.innerHTML = `
          <thead>
            <tr>
              <th>Type</th>
              <th>Assigned to</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody class="body">
        `;
        (data.trucks).forEach((e) => {
          const assignedName = e.assigned_to;
          createdTruck.innerHTML += `
            <tr>
              <td>${e.type}</td>
              <td>${assignedName}</td>
              <td>${e.status}</td>
              <td><button class="btn details" id="${e._id}">Details</button></td>
            </tr>
          `;
        });
        createdTruck.innerHTML += `
          </tbody>
        `;
        status.appendChild(createdTruck);

        const detailsButton = document.querySelectorAll('.details');
        detailsButton.forEach((e) => e.addEventListener('click', detailsTruck));
      }));
  } catch (err) {
    console.log(err);
  }
}

async function changeLoadState() {
  try {
    await fetch('http://localhost:8080/api/loads/active/state', {
      method: 'PATCH',
    })
      // eslint-disable-next-line no-use-before-define
      .then(getAssignedLoads());
    window.location.href = 'http://localhost:8080/home.html';
  } catch (err) {
    console.log(err);
  }
}

async function getAssignedLoads() {
  try {
    await fetch('http://localhost:8080/api/loads/active', {
      method: 'GET',
    })
      .then((res) => res.json().then((data) => {
        if (data.load !== null) {
          const activeLoad = document.querySelector('.activeload');
          activeLoad.innerHTML = `
          <h5> Active load:</h5>
          <p>Load ID: ${data.load._id}</p>
          <p>Load name: ${data.load.name}</p>
          <p>Payload, kg: ${data.load.payload}</p>
          <p>Load width, cm: ${data.load.dimensions.width}</p>
          <p>Load length, cm: ${data.load.dimensions.length}</p>
          <p>Load height, cm: ${data.load.dimensions.height}</p>
          <p>Load pick-up address: ${data.load.pickup_address}</p>
          <p>Load delivery address: ${data.load.delivery_address}</p>
          <p>Load state: ${data.load.state}</p>
          <p>Load status: ${data.load.status}</p>
          <p>Load created at: ${data.load.created_date}</p>
          <p>Load logs:</p>
          `;
          if (data.load.logs.length) {
            data.load.logs.forEach((mes) => {
              activeLoad.innerHTML += `${mes.message} at: ${mes.time}<br>`;
            });
          } else {
            activeLoad.innerHTML += '-';
          }
          activeLoad.innerHTML += `
          <button class="btn changestate" id="${data.load._id}">Change state</button>
          `;
          const changeStateButton = document.querySelector('.changestate');
          changeStateButton.addEventListener('click', changeLoadState);
        }
      }));
  } catch (err) {
    console.log(err);
  }
}

async function createTruck(e) {
  e.preventDefault();
  try {
    await fetch('http://localhost:8080/api/trucks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: e.target.innerText.toUpperCase(),
      }),
    })
      .then(() => {
        getUserTrucks();
      });
  } catch (err) {
    console.log(err);
  }
}

async function detailsLoad(e) {
  try {
    await fetch(`http://localhost:8080/api/loads/${e.target.id}`, {
      method: 'GET',
    })
      .then((res) => res.json().then((data) => {
        document.cookie = `load_dataId=${data.load._id}; path=/`;
      }));
    window.location.href = 'http://localhost:8080/loaddetails.html';
  } catch (err) {
    console.log(err);
  }
}

async function getUserLoads() {
  try {
    await fetch('http://localhost:8080/api/loads', {
      method: 'GET',
    })
      .then((res) => res.json().then((data) => {
        const status = document.querySelector('.status');
        status.innerHTML = '';
        const createdLoads = document.createElement('table');
        createdLoads.classList.add = 'responsive-table';
        createdLoads.innerHTML = `
          <thead>
            <tr>
              <th>Load name</th>
              <th>Pick-up address</th>
              <th>Delivery address</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody class="body">
        `;
        (data.loads).forEach((e) => {
          createdLoads.innerHTML += `
            <tr>
              <td>${e.name}</td>
              <td>${e.pickup_address}</td>
              <td>${e.delivery_address}</td>
              <td>${e.status}</td>
              <td><button class="btn details" id="${e._id}">Details</button></td>
            </tr>
          `;
        });
        createdLoads.innerHTML += `
          </tbody>
        `;
        status.appendChild(createdLoads);

        const detailsButton = document.querySelectorAll('.details');
        detailsButton.forEach((e) => e.addEventListener('click', detailsLoad));
      }));
  } catch (err) {
    console.log(err);
  }
}

async function submitLoad(e) {
  e.preventDefault();
  document.querySelectorAll('.message').forEach((el) => {
    el.style.display = 'none';
  });

  const name = document.getElementById('name');
  const payload = document.getElementById('payload');
  const pickup = document.getElementById('pickup');
  const delivery = document.getElementById('delivery');
  const width = document.getElementById('width');
  const length = document.getElementById('length');
  const height = document.getElementById('height');
  const inputData = [name,
    payload,
    pickup,
    delivery,
    width,
    length,
    height,
  ];

  inputData.forEach((el) => {
    if (!el.value) {
      el.parentElement.innerHTML += `
      <p class="error message">Empty field</p>
      `;
    }
  });
  if (name.value
    && payload.value
    && pickup.value
    && delivery.value
    && width.value
    && length.value
    && height.value) {
    try {
      await fetch('http://localhost:8080/api/loads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.value,
          payload: payload.value,
          pickup_address: pickup.value,
          delivery_address: delivery.value,
          dimensions: {
            width: width.value,
            length: length.value,
            height: height.value,
          },
        }),
      })
        .then(() => {
          const loadDiv = document.querySelector('.loaddiv');
          loadDiv.style.display = 'none';
          getUserLoads();
        });
    } catch (err) {
      console.log(err);
    }
  }
}

function displayStatus(userRole) {
  if (userRole === 'DRIVER') {
    const dropdown = document.createElement('form');
    dropdown.innerHTML = `
      <a class='dropdown-trigger btn' href='#' data-target='dropdown1'>Create truck</a>
      <ul id='dropdown1' class='dropdown-content'>
        <li class='truck'><a>Sprinter</a></li>
        <li class='truck'><a>Small straight</a></li>
        <li class='truck'><a>Large straight</a></li>
      </ul>
    `;
    const buttonsDiv = document.querySelector('.buttons');
    buttonsDiv.appendChild(dropdown);

    // eslint-disable-next-line no-undef
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));

    const truck = document.querySelectorAll('.truck');
    truck.forEach((e) => e.addEventListener('click', createTruck));

    getUserTrucks();
    getAssignedLoads();
  }
  if (userRole === 'SHIPPER') {
    const createLoad = document.createElement('button');
    createLoad.classList.add('btn');
    createLoad.innerHTML = 'Create load';

    const loadDiv = document.createElement('form');
    loadDiv.style.display = 'none';
    loadDiv.classList.add('col', 's12', 'loaddiv');
    loadDiv.innerHTML = `
      <div class="row">
        <div class="input-field col s12">
        <label for="name">Load name</label>
          <input placeholder="Load name" name="name" id="name" type="text" class="validate">
        </div>
      </div>
      <div class="row">
        <div class="input-field col s3">
        <label for="payload">Payload, kg:</label>
          <input placeholder="Payload" name="payload" id="payload" type="number" class="validate">
        </div>
        <div class="col s3">
        <p class="dimensions">Dimensions:</p>
        </div>
        <div class="input-field col s2">
        <label for="width">Width, cm:</label>
          <input placeholder="Width" name="width" id="width" type="number" class="validate">
        </div>
        <div class="input-field col s2">
        <label for="length">Length, cm:</label>
          <input placeholder="Length" name="length" id="length" type="number" class="validate">
        </div>
        <div class="input-field col s2">
        <label for="height">Height, cm:</label>
          <input placeholder="Height" name="height" id="height" type="number" class="validate">
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
        <label for="pickup">Pickup address</label>
          <input placeholder="Pickup address" name="pickup" id="pickup" type="text" class="validate">
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
        <label for="delivery">Delivery address</label>
          <input placeholder="Delivery address" name="delivery" id="delivery" type="text" class="validate">
        </div>
      </div>
      <button type="submit" class="btn submitload">Submit load</button>
    `;

    const buttonsDiv = document.querySelector('.buttons');
    buttonsDiv.appendChild(createLoad);
    buttonsDiv.appendChild(loadDiv);
    createLoad.onclick = () => {
      if (loadDiv.style.display !== 'none') {
        loadDiv.style.display = 'none';
      } else {
        loadDiv.style.display = 'block';
      }
    };

    const submitLoadButton = document.querySelector('.submitload');
    submitLoadButton.addEventListener('click', submitLoad);

    getUserLoads();
  }
}

displayStatus(role);
