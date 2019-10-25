"use strict";

//getting items stored into local storage during login and registration
var firstname = localStorage.getItem("firstname");
var token = localStorage.getItem('token'); //preventing unauthorised users from accessing the page

if (!token) {
  window.location.href = './signin.html';
} //handling logout


var logout = document.getElementById('logout');
logout.addEventListener('click', function () {
  localStorage.clear();
  window.location.href = './sign-in.html';
});
document.querySelector("#nameBar").innerHTML = firstname.toUpperCase(); //fetch request to render all user rides into the table

var userId = localStorage.getItem("userId");
fetch("/rides", {
  method: "GET",
  headers: {
    Authorization: token
  }
}).then(function (res) {
  return res.json();
}).then(function (data) {
  var ridesTable = document.querySelector(".rideDetails");

  if (!data.length) {
    document.querySelector("#error-msg").innerHTML = "No Available Ride Offer yet";
  } else {
    data.sort(function (a, b) {
      return a.id - b.id;
    });
    renderTableData(data, ridesTable);
  }
});

var renderTableData = function renderTableData(data, ridesTable) {
  data.forEach(function (ride) {
    var rideRow = document.createElement("tr");
    rideRow.innerHTML = "<th scope=\"row\">".concat(ride.rideid, "</th>\n                          <td>").concat(ride.car_name, "</td>\n                          <td class=\"remove-second\">").concat(ride.available_seats, "</td>\n                          <td>").concat(ride.location, "</td>\n                          <td>").concat(ride.phone_no, "</td>\n                          <td>").concat(ride.time, "</td>\n                          <td>").concat(ride.destination, "</td>\n                          <td><button onclick=\"window.location.href = 'view.html?rideid=").concat(ride.rideid, "';\">request</button></td>\n                           ");
    ridesTable.append(rideRow);
  });
};