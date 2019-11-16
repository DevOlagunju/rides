//getting items stored into local storage during login and registration
const firstname = localStorage.getItem("firstname");
const token = localStorage.getItem("token");

//preventing unauthorised users from accessing the page
if (!token) {
  window.location.href = "./signin.html";
}

//handling logout
const logout = document.getElementById("logout");

logout.addEventListener("click", function() {
  localStorage.clear();
  window.location.href = "./sign-in.html";
});

document.querySelector("#nameBar").innerHTML = `${firstname.toUpperCase()}`;

//fetch request to render all user rides into the table
const userId = localStorage.getItem("userId");
fetch(`/users/${userId}/rides`, {
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
        "You do not have any Ride Offer yet";
    } else {
      data.sort((a, b) => a.id - b.id);
      renderTableData(data, ridesTable);

      document.getElementById("ridesLength").innerHTML = `${data.length}`;

      fetch(`/rides/requests/${userId}`, {
        method: "GET",
        headers: {
          Authorization: token
        }
      })
        .then(res => res.json())
        .then(data => {
          const requestsTable = document.querySelector(".requestDetails");
          if (!data.length) {
            document.querySelector("#error-msg2").innerHTML =
              "You do not have any Request  yet";
  
          } else {
            
            data.sort((a, b) => a.id - b.id);
            renderRequesteData(data, requestsTable);
          }
        });
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
                          <td><a href="rides/edit/${ride.rideid}"><i class="fas fa-edit"></i></a></td>
                          <td><a href="/delete/${ride.rideid}" ><i class="fas fa-trash-alt"></i></a></td>
                          `;
    ridesTable.append(rideRow);
  });
};

const renderRequesteData = (data, requestsTable) => {
  data.forEach(request => {
    let rideRow = document.createElement("tr");
    rideRow.innerHTML = `<th scope="row">${request.ride_id}</th>
                          <td>${request.passenger_name}</td>
                          <td>${request.phone_no}</td>
                          <td>${request.status}</td>

                           `;
    requestsTable.append(rideRow);
  });
};

// let fetchMyRequests = async () => {
//   let res = await fetch(`/requests/${userId}`, {
//     headers: {
//       Authorization: token
//     }
//   });

//   let data = await res.json();

//   data.forEach(req => {
//     let tr = `<tr>
//                 <td>${req.requestid}</td>
//                 <td>${req.passenger_name}</td>
//                 <td>${req.phone_no}</td>
//                 <td>${req.status}</td>
//               </tr>`;

//     requestDetails.appendChild(tr);
//   });
// };

// fetchMyRequests();
