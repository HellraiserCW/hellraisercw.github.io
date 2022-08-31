const registerBtn = document.querySelector('.register');

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-undef
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
});

async function requestRegister(e) {
  e.preventDefault();
  const nickname = document.getElementById('nickname');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const repeatPassword = document.getElementById('repeat-password');
  const role = document.querySelector('input[type=radio][name=role]:checked');
  const noRole = document.querySelector('.role');

  if (!nickname.value && !nickname.nextElementSibling) {
    nickname.parentElement.innerHTML += `
    <p class="error message">Enter Login</p>
    `;
  }
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
  if (!repeatPassword.value && !repeatPassword.nextElementSibling) {
    repeatPassword.parentElement.innerHTML += `
    <p class="error message repeat">Repeat Password</p>
    `;
  }
  if (password.value && repeatPassword.value && password.value !== repeatPassword.value) {
    if (document.querySelector('.repeat')) {
      document.querySelector('.repeat').style.display = 'none';
    }
    repeatPassword.parentElement.innerHTML += `
    <p class="error message">Passwords does not match</p>
    `;
  }
  if (!role && !noRole.nextElementSibling) {
    noRole.parentElement.innerHTML += `
    <p class="error message">Select role</p>
    `;
  }
  if (nickname.value
    && email.value
    && password.value
    && repeatPassword.value
    && (password.value === repeatPassword.value)
    && role) {
    document.querySelectorAll('.message').forEach((el) => {
      el.style.display = 'none';
    });
    try {
      await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname: nickname.value,
          email: email.value,
          password: password.value,
          role: role.value,
        }),
      })
        .then((res) => {
          if (res.status === 400) {
            res.json().then((data) => {
              email.parentElement.innerHTML += `
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

registerBtn.addEventListener('click', requestRegister);
