"use strict";

var userId = localStorage.getItem("userId");
var firstname = localStorage.getItem("firstname");
var token = localStorage.getItem("token"); //preventing unauthorised users from accessing the page

if (!token) {
  window.location.href = "./signin.html";
}

document.querySelector("#nameBar").innerHTML = firstname.toUpperCase();

var createRideOffer = function createRideOffer(event) {
  event.preventDefault();
  fetch("users/rides", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      user_id: userId,
      car_name: document.getElementById("carname").value,
      available_Seats: document.getElementById("seats").value,
      location: document.getElementById("location").value,
      phone_no: document.getElementById("number").value,
      time: document.getElementById("time").value,
      destination: document.getElementById("destination").value
    })
  })
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      console.log(data);

      if (data.rideId) {
        alert("ride created successfully!");
        window.location.href = "./userprofile.html";
      } else if (data.msg) {
        toastr.error(data.msg);
      } else {
        data.errors.forEach(function(err) {
          toastr.error(err.msg);
        });
      }
    })
    ["catch"](function(err) {
      return console.log("error occured", err);
    });
};

document
  .getElementById("registration-form")
  .addEventListener("submit", createRideOffer);
