const firstname = localStorage.getItem("firstname");
const token = localStorage.getItem("token");

//preventing unauthorised users from accessing the page
if (!token) {
  window.location.href = "./signin.html";
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
      if (data.requestId) {
        alert("request created successfully!");
        window.location.href = "./userprofile.html";
      } else if (data.msg) {
        toastr.error(data.msg);
      } else {
        data.errors.forEach(err => {
          toastr.error(err.msg);
        });
      }
    })
    .catch(err => console.log("error occured", err));
};

document
  .getElementById("registration-form")
  .addEventListener("submit", createRequest);
