const sendEmailBtn = document.querySelector('.send-email');

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-undef
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
});

async function resetPassword(e) {
  e.preventDefault();
  const email = document.getElementById('email');
  if (!email.value && !email.nextElementSibling) {
    email.parentElement.innerHTML += `
    <p class="error message">Enter Email</p>
    `;
  }
  if (email.value) {
    document.querySelectorAll('.message').forEach((el) => {
      el.style.display = 'none';
    });
    try {
      await fetch('http://localhost:8080/api/auth/forgot_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
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
              email.parentElement.innerHTML += `
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

sendEmailBtn.addEventListener('click', resetPassword);
