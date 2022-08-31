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

const usernameProfile = (JSON.parse(atob(document.cookie.split('.')[1])));

const accountId = document.querySelector('.accountid');
const accountName = document.querySelector('.accountname');
const accountRole = document.querySelector('.accountrole');
const accountEmail = document.querySelector('.accountemail');
const accountCreatedDate = document.querySelector('.accountcreated-date');

accountId.innerHTML += usernameProfile._id;
accountName.innerHTML += usernameProfile.username;
accountRole.innerHTML += usernameProfile.role;
accountEmail.innerHTML += usernameProfile.email;
accountCreatedDate.innerHTML += usernameProfile.created_date;

const changePassword = document.querySelector('.changepassword');

async function userChangePassword(e) {
  e.preventDefault();
  const oldPassword = document.querySelector('.oldpassword');
  const newPassword = document.querySelector('.newpassword');

  if (!oldPassword.value) {
    oldPassword.parentElement.innerHTML += `
    <p class="error message">Enter current password</p>
    `;
  }
  if (!newPassword.value) {
    newPassword.parentElement.innerHTML += `
    <p class="error message">Enter new password</p>
    `;
  }
  if (oldPassword.value && newPassword.value) {
    document.querySelectorAll('.message').forEach((el) => {
      el.style.display = 'none';
    });
    try {
      await fetch('http://localhost:8080/api/users/me/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: oldPassword.value,
          newPassword: newPassword.value,
        }),
      })
        .then((res) => {
          if (res.status === 400) {
            res.json().then((data) => {
              oldPassword.parentElement.innerHTML += `
              <p class="error message">${data.message}</p>
              `;
            });
          } else if (res.status === 200) {
            oldPassword.value = '';
            res.json().then((data) => {
              newPassword.parentElement.innerHTML += `
              <p class="success message">${data.message}</p>
              `;
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
  }
}

changePassword.addEventListener('click', userChangePassword);

const deleteAccount = document.querySelector('.deleteaccount');

async function userDeleteAccount(e) {
  e.preventDefault();
  // eslint-disable-next-line no-alert, no-restricted-globals
  if (confirm('Do you really want to delete account?')) {
    try {
      await fetch('http://localhost:8080/api/users/me', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(() => {
          window.location.href = 'http://localhost:8080/';
        });
    } catch (err) {
      console.log(err);
    }
  }
}

deleteAccount.addEventListener('click', userDeleteAccount);
