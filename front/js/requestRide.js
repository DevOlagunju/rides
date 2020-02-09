const firstname = localStorage.getItem("firstname");
const token = localStorage.getItem("token");

//preventing unauthorised users from accessing the page
if (!token) {
  window.location.href = "/signin";
}

document.querySelector("#nameBar").innerHTML = firstname.toUpperCase();
const userId = localStorage.getItem("userId");
const createRequest = event => {
  event.preventDefault();

  fetch(`rides/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      user_id: userId,
      ride_id: document.getElementById("rideid").value,
      passenger_name: document.getElementById("passenger").value,
      phone_no: document.getElementById("number").value
    })
  })
    .then(res => res.json())
    .then(data => {
      //alert(data.message);
      console.log(data);
      if (data.message) {
        alert(data.message);
        window.location.href = "/dashboard";
      } else {
        data.code.forEach(err => {
          toastr.error(err.code);
        });
      }
    })
    .catch(err => console.log("error occured", err));
};

document
  .getElementById("registration-form")
  .addEventListener("submit", createRequest);
