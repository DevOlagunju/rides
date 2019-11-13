const signIn = event => {
    event.preventDefault();
    console.log(document.getElementById('email').value)
    console.log(document.getElementById('password').value)
    fetch('/auth/signin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      })
    }).then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.token) {
          console.log(res.token)
          fetch('/me', {
              headers:{
                  'x-access-token': res.token,
              }
          })
          .then(res => res.json())
          .then(data => {
            console.log(data)
              if (data.role === 'member'){
                  localStorage.setItem('token', res.token);
                  localStorage.setItem('userId', data.id);
                  localStorage.setItem('firstname', data.first_name);
                  window.location.href = "./userprofile.html";
                  //alert("logged in successfully!");
              } else {
                  toastr.error('Sorry, only a MEMBER can log in to this page');
              }
          })
          .catch(err => console.log('err occured', err));
      } else if (res.msg) {
          toastr.error(res.msg)
      }
  }).catch(err => console.log('err occured', err));
  }
  
  document.getElementById('login-form').addEventListener('submit', signIn);
  