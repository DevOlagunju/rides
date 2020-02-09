//getting items stored into local storage during login and registration
const firstname = localStorage.getItem("firstname");
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
let dest_reporter = document.getElementById('dest_reporter');

//preventing unauthorised users from accessing the page
if (!token) {
  window.location.href = "/signin";
}

let overlay = document.getElementById("overlay");
let editForm = document.getElementById("editForm");

overlay.onclick = function (evt) {
  let target = evt.target;

  if (target.id === this.id) {
    this.style.display = "none";
    // this.style.display = 'none';
  }
};


editForm.onsubmit = function (e) {
  e.preventDefault();
  dest_reporter.classList.remove("success");

  let rideid = this.elements.rideid.value;
  let destination = this.elements.destination.value;

  fetch(`rides/edit/${rideid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        user_id: userId,
        destination: destination
      })
    })
    .then(res => res.json())
    .then(data => {
      dest_reporter.classList.add("success");
      dest_reporter.innerText = data.msg;
      dest_reporter.style.display = "block";

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
};

//handling logout
const logout = document.getElementById("logout");

logout.addEventListener("click", function () {
  localStorage.clear();
  window.location.href = "/signin";
});

document.querySelector("#nameBar").innerHTML = `${firstname.toUpperCase()}`;

//fetch request to render all user rides into the table

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
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");
    let td6 = document.createElement("td");
    let td7 = document.createElement("td");
    let td8 = document.createElement("td");

    th.innerText = ride.rideid;
    td1.innerText = ride.car_name;

    td2.innerText = ride.available_seats;
    td2.setAttribute("class", "remove-second");

    td3.innerText = ride.location;
    td4.innerText = ride.phone_no;
    td5.innerText = ride.time;
    td6.innerText = ride.destination;

    let btn = document.createElement("button");
    btn.onclick = function () {
      dest_reporter.style.display = "none";
      editRide(ride.rideid);
    };

    let i1 = document.createElement("i");
    i1.setAttribute("class", "fas fa-edit");

    btn.appendChild(i1);
    td7.appendChild(btn);

    let a = document.createElement("a");
    a.setAttribute("href", `rides/delete/${ride.rideid}`);

    a.onclick = function () {
      deleteRide(ride.rideid);
    };

    let i2 = document.createElement("i");
    i2.setAttribute("class", "fas fa-trash-alt");

    a.appendChild(i2);
    td8.appendChild(a);

    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(td8);

    ridesTable.appendChild(tr);

    // let rideRow = document.createElement("tr");
    // rideRow.innerHTML = `<th scope="row">${ride.rideid}</th>
    //                       <td>${ride.car_name}</td>
    //                       <td class="remove-second">${ride.available_seats}</td>
    //                       <td>${ride.location}</td>
    //                       <td>${ride.phone_no}</td>
    //                       <td>${ride.time}</td>
    //                       <td>${ride.destination}</td>
    //                       <td><button  onclick="editRide(${ride.rideid});"><i class="fas fa-edit"></i></button</td>
    //                       <td><a href="rides/delete/${ride.rideid}"  onclick="deleteRide(${ride.rideid}); return false;"><i class="fas fa-trash-alt"></i></a></td>
    //                       `;
    // ridesTable.append(rideRow);
  });
};

const editRide = id => {
  editForm.elements.rideid.value = id;
  overlay.style.display = "block";
};

const deleteRide = async id => {
  let res = await fetch(`rides/delete/${id}`, {
    headers: {
      Authorization: token
    }
  });

  console.log(res);

  if (res.status === 200) {
    window.location.reload();
  }
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

//NEW

// let edits = document.querySelector(".edit");

// for (let i = 0; i < edits.length; i++) {
//   edits[i].onclick = function(e) {
//     return false;
//   };
// }

// edit.onclick = evt => {
//   evt.preventDefault();
// };

// edit.forEach(function() {
//   this.onclick = e => {
//     e.preventDefault();
//     alert("Hello");
//   };
// });

// fetch(`/rides/${userId}`, {
//   method: "GET",
//   headers: {
//     Authorization: token
//   }
// });