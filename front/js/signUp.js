const signUp = event => {
    event.preventDefault();
  
    fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        first_name: document.getElementById('firstname').value,
        last_name: document.getElementById('lastname').value,
        email: document.getElementById('email').value,
        phone_no: document.getElementById('phone-no').value,
        password: document.getElementById('password').value
      })
    }).then(res => res.json())
      .then(res => {
        if (res.token) {
          //console.log(res.token);
          fetch('/me', {
            headers: {
              'x-access-token': res.token
            }
          }).then(res => res.json())
            .then(data => {
              if (data.role === 'member') {
                localStorage.setItem('token', res.token);
                localStorage.setItem('userId', res.userId);
                localStorage.setItem('firstname', data.first_name);
                window.location.href = "./sign-in.html";
                alert("Account created successfully!")
              }
            })
            .catch(err => console.log('err occured', err));
        } else if (res.err) {
          toastr.error(res.err);
        } else {
          res.errors.forEach(err => {
            toastr.error(`${err.param}: ${err.msg}`);
          });
          console.log(res.errors);
        }
      }).catch(err => console.log('err occured', err));
  }
  

  document.getElementById('registration-form').addEventListener('submit', signUp);