//getting items stored into local storage during login and registration
const firstname = localStorage.getItem("firstname");
const token = localStorage.getItem("token");

//preventing unauthorised users from accessing the page
if (!token) {
  window.location.href = "/signin";
}

//handling logout
const logout = document.getElementById("logout");

logout.addEventListener("click", function() {
  localStorage.clear();
  window.location.href = "/signin";
});

document.querySelector("#nameBar").innerHTML = firstname.toUpperCase();

//fetch request to render all user rides into the table
const userId = localStorage.getItem("userId");
fetch(`/rides/${userId}`, {
  method: "GET",
  headers: {
    Authorization: token
  }
})
  .then(res => res.json())
  .then(data => {
    const ridesTable = document.querySelector(".rideDetails");
    if (!data.length) {
      document.querySelector("#error-msg").innerHTML =
        "No Available Ride Offer yet";
    } else {
      data.sort((a, b) => a.id - b.id);
      renderTableData(data, ridesTable);
    }
  });

const renderTableData = (data, ridesTable) => {
  data.forEach(ride => {
    let rideRow = document.createElement("tr");
    rideRow.innerHTML = `<th scope="row">${ride.rideid}</th>
                          <td>${ride.car_name}</td>
                          <td class="remove-second">${ride.available_seats}</td>
                          <td>${ride.location}</td>
                          <td>${ride.phone_no}</td>
                          <td>${ride.time}</td>
                          <td>${ride.destination}</td>
                          <td><button onclick="window.location.href = 'view.html?rideid=${ride.rideid}';">request</button></td>
                           `;
    ridesTable.append(rideRow);
  });
};
