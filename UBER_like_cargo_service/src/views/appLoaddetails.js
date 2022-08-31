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

const updateLoadButton = document.createElement('button');
updateLoadButton.classList.add('btn');
updateLoadButton.innerHTML = 'Update load';

const updateLoadDiv = document.createElement('form');
updateLoadDiv.style.display = 'none';
updateLoadDiv.classList.add('col', 's12');
updateLoadDiv.innerHTML = `
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
  <button type="submit" class="btn updateload">Submit update</button>
`;

const updateDiv = document.querySelector('.updateform');
updateDiv.appendChild(updateLoadButton);
updateDiv.appendChild(updateLoadDiv);
updateLoadButton.onclick = () => {
  if (updateLoadDiv.style.display !== 'none') {
    updateLoadDiv.style.display = 'none';
  } else {
    updateLoadDiv.style.display = 'block';
  }
};

async function shippingInfo(e) {
  try {
    await fetch(`http://localhost:8080/api/loads/${e}/shipping_info`, {
      method: 'GET',
    })
      .then((res) => res.json().then((data) => {
        const truckInfo = document.createElement('div');
        truckInfo.innerHTML = `
        <h5>Truck info</h5>
        <p>Truck ID: ${data.truck._id}</p>
        <p>Type: ${data.truck.type}</p>
        `;
        const div = document.querySelector('.container');
        div.appendChild(truckInfo);
      }));
  } catch (err) {
    console.log(err);
  }
}

async function renderLoad(e) {
  try {
    await fetch(`http://localhost:8080/api/loads/${e}`, {
      method: 'GET',
    })
      .then((res) => res.json().then((data) => {
        const loadId = document.querySelector('.loadid');
        const loadName = document.querySelector('.loadname');
        const payload = document.querySelector('.payload');
        const width = document.querySelector('.width');
        const length = document.querySelector('.length');
        const height = document.querySelector('.height');
        const pickup = document.querySelector('.pickup');
        const delivery = document.querySelector('.delivery');
        const loadAssigned = document.querySelector('.loadassigned');
        const loadState = document.querySelector('.loadstate');
        const loadStatus = document.querySelector('.loadstatus');
        const loadCreatedDate = document.querySelector('.loadcreated-date');
        const loadLogs = document.querySelector('.loadlogs');
        loadId.innerHTML = data.load._id;
        loadName.innerHTML = data.load.name;
        payload.innerHTML = data.load.payload;
        width.innerHTML = data.load.dimensions.width;
        length.innerHTML = data.load.dimensions.length;
        height.innerHTML = data.load.dimensions.height;
        pickup.innerHTML = data.load.pickup_address;
        delivery.innerHTML = data.load.delivery_address;
        loadAssigned.innerHTML = data.load.assigned_to || '-';
        loadState.innerHTML = data.load.state || '-';
        loadStatus.innerHTML = data.load.status;
        loadCreatedDate.innerHTML = data.load.created_date;
        if (data.load.logs.length) {
          loadLogs.innerHTML = '';
          data.load.logs.forEach((mes) => {
            loadLogs.innerHTML += `${mes.message} at: ${mes.time}<br>`;
          });
        } else {
          loadLogs.innerHTML = '-';
        }
        if (data.load.status !== 'NEW') {
          document.querySelector('.loadoptions').style.display = 'none';
          shippingInfo(e);
        }
      }));
  } catch (err) {
    console.log(err);
  }
}

renderLoad(cookieList.load_dataId);
const submitUpdateLoadButton = document.querySelector('.updateload');

async function updateLoad(e) {
  document.querySelectorAll('.message').forEach((el) => {
    el.style.display = 'none';
  });
  e.preventDefault();
  const name = document.getElementById('name');
  const payload = document.getElementById('payload');
  const pickup = document.getElementById('pickup');
  const delivery = document.getElementById('delivery');
  const width = document.getElementById('width');
  const length = document.getElementById('length');
  const height = document.getElementById('height');

  try {
    await fetch(`http://localhost:8080/api/loads/${cookieList.load_dataId}`, {
      method: 'PUT',
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
      .then((res) => {
        if (res.status === 400) {
          res.json().then((data) => {
            submitUpdateLoadButton.innerHTML += `
            <p class="error message">${data.message}</p>
            `;
          });
        } else if (res.status === 200) {
          window.location.href = 'http://localhost:8080/loaddetails.html';
        }
      });
  } catch (err) {
    console.log(err);
  }
}

submitUpdateLoadButton.addEventListener('click', updateLoad);

const deleteLoadButton = document.querySelector('.deleteload');

async function deleteLoad(e) {
  e.preventDefault();
  document.querySelectorAll('.message').forEach((el) => {
    el.style.display = 'none';
  });
  // eslint-disable-next-line no-alert, no-restricted-globals
  if (confirm('Do you really want to delete load?')) {
    try {
      await fetch(`http://localhost:8080/api/loads/${cookieList.load_dataId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.status === 400) {
            res.json().then((data) => {
              deleteLoadButton.innerHTML += `
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

deleteLoadButton.addEventListener('click', deleteLoad);

const postLoadButton = document.querySelector('.post');

async function postLoad(e) {
  e.preventDefault();
  document.querySelectorAll('.message').forEach((el) => {
    el.style.display = 'none';
  });
  // eslint-disable-next-line no-alert, no-restricted-globals
  if (confirm('Do you really want to post a load?')) {
    try {
      await fetch(`http://localhost:8080/api/loads/${cookieList.load_dataId}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.status === 400) {
            res.json().then((data) => {
              postLoadButton.innerHTML += `
              <p class="error message">${data.message}</p>
              `;
            });
          } else if (res.status === 200) {
            renderLoad(cookieList.load_dataId);
          }
        });
    } catch (err) {
      console.log(err);
    }
  }
}

postLoadButton.addEventListener('click', postLoad);
