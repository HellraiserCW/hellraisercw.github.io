const loginBtn = document.querySelector('.login');

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-undef
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
});

async function loginProfile(e) {
  e.preventDefault();
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  if (!email.value && !email.nextElementSibling) {
    email.parentElement.innerHTML += `
    <p class="error message">Enter Email</p>
    `;
  }
  if (!password.value && !password.nextElementSibling) {
    password.parentElement.innerHTML += `
    <p class="error message">Enter Password</p>
    `;
  }
  if (email.value && password.value) {
    document.querySelectorAll('.message').forEach((el) => {
      el.style.display = 'none';
    });
    try {
      await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      })
        .then((res) => {
          if (res.status === 400) {
            res.json().then((data) => {
              email.parentElement.innerHTML += `
              <p class="error message">${data.message}</p>
              `;
            });
          } else if (res.status === 401) {
            res.json().then((data) => {
              password.parentElement.innerHTML += `
              <p class="error message">${data.message}</p>
              `;
            });
          } else if (res.status === 200) {
            res.json().then((data) => {
              document.cookie = `jwt_token=${data.jwt_token}; path=/`;
            });
            window.location.href = 'http://localhost:8080/home.html';
          }
        });
    } catch (err) {
      console.log(err);
    }
  }
}

loginBtn.addEventListener('click', loginProfile);
