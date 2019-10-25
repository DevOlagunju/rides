"use strict";

var firstname = localStorage.getItem("firstname");
var token = localStorage.getItem('token'); //preventing unauthorised users from accessing the page

if (!token) {
  window.location.href = './signin.html';
}

document.querySelector("#nameBar").innerHTML = firstname.toUpperCase();
var userId = localStorage.getItem("userId");

var createRequest = function createRequest(event) {
  event.preventDefault();
  fetch("rides/requests", {
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
  }).then(function (res) {
    return res.json();
  }).then(function (data) {
    console.log(data);

    if (data.requestId) {
      alert("request created successfully!");
      window.location.href = "./userprofile.html";
    } else if (data.msg) {
      toastr.error(data.msg);
    } else {
      data.errors.forEach(function (err) {
        toastr.error(err.msg);
      });
    }
  })["catch"](function (err) {
    return console.log("error occured", err);
  });
};

document.getElementById("registration-form").addEventListener("submit", createRequest);