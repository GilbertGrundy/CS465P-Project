window.onload = function () {
  if (sessionStorage.getItem("insertResult") != null) {
    printUpdateResult();
  }
  if (sessionStorage.getItem("deleteResult") != null) {
    printDeleteResult();
  }
  if (sessionStorage.getItem("modifyResult") != null) {
    printModifyResult();
  }
};

function getPerformanceData() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/submitPerformances");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let mensTable = document.getElementById("mensPerformanceTable");
      let womensTable = document.getElementById("womensPerformanceTable");
      let data = JSON.parse(xhr.responseText);

      //empty the tables if they have any old data in them
      for (var i = mensTable.rows.length; i > 0; i--)
        mensTable.deleteRow(i - 1);
      for (var i = womensTable.rows.length; i > 0; i--)
        womensTable.deleteRow(i - 1);
      let mencount = 0;
      let womencount = 0;
      //insert performance data into the performance.html mens/womens tables
      for (let i = 0; i < data.length; i++) {
        let tempRow;
        let mensTableRowCount;
        let womensTableRowCount;

        if (data[i].sex === 0) {
          mensTableRowCount = mensTable.rows.length;
          tempRow = mensTable.insertRow(mensTableRowCount);
          if (mencount < 10) tempRow.className = "gold";
          else if (mencount < 20) tempRow.className = "silver";
          else if (mencount < 30) tempRow.className = "bronze";
          mencount++;
        } else {
          womensTableRowCount = womensTable.rows.length;
          tempRow = womensTable.insertRow(womensTableRowCount);
          if (womencount < 10) tempRow.className = "gold";
          else if (womencount < 20) tempRow.className = "silver";
          else if (womencount < 30) tempRow.className = "bronze";
          womencount++;
        }
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        let tempCell4 = tempRow.insertCell(3);
        let tempCell5 = tempRow.insertCell(4);
        tempCell1.className = "rank";
        tempCell2.className = "name";
        tempCell3.className = "time";
        tempCell4.className = "date";
        tempCell5.className = "venue";
        if (data[i].sex === 0) {
          tempCell1.innerHTML = mensTableRowCount + 1;
        } else {
          tempCell1.innerHTML = womensTableRowCount + 1;
        }
        let time = data[i].mark.toString();
        while (time.indexOf("0") === 0 || time.indexOf(":") === 0) {
          time = time.substring(1, time.length);
        }
        if (time.indexOf(".00") == time.length - 3) {
          time = time.substring(0, time.length - 3);
        }
        tempCell2.innerHTML = data[i].name;
        if (data[i].relay == 1) tempCell3.innerHTML = time + " (r)";
        else if (data[i].timetrial == 1) tempCell3.innerHTML = time + " +";
        else tempCell3.innerHTML = time;
        tempCell4.innerHTML =
          data[i].day + " " + data[i].month + " " + data[i].year;
        tempCell5.innerHTML = data[i].venue;
      }
      if (mencount == 0) {
        let tempRow = mensTable.insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        let tempCell4 = tempRow.insertCell(3);
        let tempCell5 = tempRow.insertCell(4);
        tempCell1.innerHTML = "#";
        tempCell2.innerHTML = "Empty Tub!";
        tempCell3.innerHTML = "69:69:69.69";
        tempCell4.innerHTML = "69 Banterbruary 2069";
        tempCell5.innerHTML = "Tubville";
      }
      if (womencount == 0) {
        let tempRow = womensTable.insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        let tempCell4 = tempRow.insertCell(3);
        let tempCell5 = tempRow.insertCell(4);
        tempCell1.innerHTML = "#";
        tempCell2.innerHTML = "Empty Tub!";
        tempCell3.innerHTML = "69:69:69.69";
        tempCell4.innerHTML = "69 Banterbruary 2069";
        tempCell5.innerHTML = "Tubville";
      }
      document.getElementById("tables").style.visibility = "visible";
    }
  };

  let paramsString =
    "terrain=" +
    document.getElementById("terrainDDL").value +
    "&event=" +
    document.getElementById("eventDDL").value;
  let params = new URLSearchParams(paramsString);
  xhr.send(params);
}

function showSelectedUpdateForm() {
  document.getElementById("result").innerHTML = ""; //clear results messages
  if (document.getElementById("actionDDL").selectedIndex === 1) {
    document.getElementById("deleteRecord").style.display = "none";
    document.getElementById("modifyRecord").style.display = "none";
    document.getElementById("insertRecord").style.display = "block";
  }
  if (document.getElementById("actionDDL").selectedIndex === 2) {
    document.getElementById("insertRecord").style.display = "none";
    document.getElementById("deleteRecord").style.display = "none";
    document.getElementById("modifyRecord").style.display = "inline-block";
  }
  if (document.getElementById("actionDDL").selectedIndex === 3) {
    document.getElementById("insertRecord").style.display = "none";
    document.getElementById("modifyRecord").style.display = "none";
    document.getElementById("deleteRecord").style.display = "inline-block";
  }
}

function updateSubmitBtn_Click() {
  //clear any error messages from previous user actions
  document.getElementById("error").innerHTML = "";

  let requestType = document.getElementById("actionDDL").value;
  if (requestType === "add") {
    if (isValidAddRequest() === false) {
      console.log("Invalid user input dectected.  Terminating script.");
      return;
    }
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/update");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Request finished. Do processing here.
      let data = JSON.parse(xhr.responseText);
      sessionStorage.setItem("insertResult", data.message);
      location.reload();
    }
  };

  let paramsString =
    "mark=" +
    document.getElementById("markTB").value +
    "&" +
    "name=" +
    document.getElementById("nameTB").value +
    "&" +
    "date_of=" +
    document.getElementById("dateTB").value +
    "&" +
    "venue=" +
    document.getElementById("venueTB").value +
    "&" +
    "event=" +
    document.getElementById("eventTB").value +
    "&" +
    "terrain=" +
    document.getElementById("terrainTB").value +
    "&" +
    "sex=" +
    document.getElementById("sexDDL").value +
    "&" +
    "relay=" +
    document.getElementById("relayDDL").value +
    "&" +
    "timetrial=" +
    document.getElementById("timetrialDDL").value;
  console.log(paramsString);
  let params = new URLSearchParams(paramsString);
  xhr.send(params);
}

function deleteSubmitBtn_Click() {
  //clear any error messages from previous user actions
  document.getElementById("deleteError").innerHTML = "";

  let requestType = document.getElementById("actionDDL").value;
  if (requestType === "delete") {
    if (isValidDeleteRequest() === false) {
      console.log("Invalid user input dectected.  Terminating script.");
      return;
    }
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/delete");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Request finished. Do processing here.
      let data = JSON.parse(xhr.responseText);
      sessionStorage.setItem("deleteResult", data.message);
      location.reload();
    }
  };

  let paramsString =
    "name=" +
    document.getElementById("deleteNameTB").value +
    "&" +
    "date_of=" +
    document.getElementById("deleteDateTB").value +
    "&" +
    "venue=" +
    document.getElementById("deleteVenueTB").value +
    "&" +
    "event=" +
    document.getElementById("deleteEventTB").value;
  console.log(paramsString);
  let params = new URLSearchParams(paramsString);
  xhr.send(params);
}

function modifySubmitBtn_Click() {
  //clear any error messages from previous user actions
  document.getElementById("modifyError").innerHTML = "";

  let requestType = document.getElementById("actionDDL").value;
  if (requestType === "modify") {
    if (isValidModifyRequest() === false) {
      console.log("Invalid user input dectected.  Terminating script.");
      return;
    }
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/modify");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Request finished. Do processing here.
      let data = JSON.parse(xhr.responseText);
      sessionStorage.setItem("modifyResult", data.message);
      location.reload();
    }
  };

  let paramsString =
    "name=" +
    document.getElementById("searchNameTB").value +
    "&" +
    "date_of=" +
    document.getElementById("searchDateTB").value +
    "&" +
    "venue=" +
    document.getElementById("searchVenueTB").value +
    "&" +
    "event=" +
    document.getElementById("searchEventTB").value +
    "&" +
    "mark=" +
    document.getElementById("newMarkTB").value +
    "&" +
    "name=" +
    document.getElementById("newNameTB").value +
    "&" +
    "date_of=" +
    document.getElementById("newDateTB").value +
    "&" +
    "venue=" +
    document.getElementById("newVenueTB").value +
    "&" +
    "event=" +
    document.getElementById("newEventTB").value +
    "&" +
    "terrain=" +
    document.getElementById("newTerrainTB").value +
    "&" +
    "sex=" +
    document.getElementById("newSexDDL").value +
    "&" +
    "relay=" +
    document.getElementById("newRelayDDL").value +
    "&" +
    "timetrial=" +
    document.getElementById("newTimetrialDDL").value;
  console.log(paramsString);
  let params = new URLSearchParams(paramsString);
  xhr.send(params);
}

function getRecordData() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/submitRecords");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Request finished. Do processing here.
      let mensTable = document.getElementById("mensRecordTable");
      let womensTable = document.getElementById("womensRecordTable");
      let data = JSON.parse(xhr.responseText);

      //empty the tables if they have any old data in them
      for (var i = mensTable.rows.length; i > 0; i--)
        mensTable.deleteRow(i - 1);
      for (var i = womensTable.rows.length; i > 0; i--)
        womensTable.deleteRow(i - 1);
      //insert performance data into the performance.html mens/womens tables
      let mencount = 0;
      let womencount = 0;
      for (let i = 0; i < data.length; i++) {
        let tempRow;
        let mensTableRowCount;
        let womensTableRowCount;
        if (data[i].sex === 0) {
          mensTableRowCount = mensTable.rows.length;
          tempRow = mensTable.insertRow(mensTableRowCount);
          mencount++;
        } else {
          womensTableRowCount = womensTable.rows.length;
          tempRow = womensTable.insertRow(womensTableRowCount);
          womencount++;
        }
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        tempCell1.className = "rank";
        tempCell2.className = "name";
        tempCell3.className = "time";
        if (data[i].sex === 0) {
          tempCell1.innerHTML = mensTableRowCount + 1;
        } else {
          tempCell1.innerHTML = womensTableRowCount + 1;
        }
        tempCell2.innerHTML = data[i].name;
        let time = data[i].mark.toString();

        while (time.indexOf("0") === 0 || time.indexOf(":") === 0) {
          time = time.substring(1, time.length);
        }
        if (time.indexOf(".00") == time.length - 3) {
          time = time.substring(0, time.length - 3);
        }
        if (data[i].relay == 1) tempCell3.innerHTML = time + " (r)";
        else if (data[i].timetrial == 1) tempCell3.innerHTML = time + " +";
        else tempCell3.innerHTML = time;
      }
      if (mencount == 0) {
        let tempRow = mensTable.insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        tempCell1.innerHTML = "#";
        tempCell2.innerHTML = "Empty Tub!";
        tempCell3.innerHTML = "69:69:69.69";
      }
      if (womencount == 0) {
        let tempRow = womensTable.insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        tempCell1.innerHTML = "#";
        tempCell2.innerHTML = "Empty Tub!";
        tempCell3.innerHTML = "69:69:69.69";
      }
      document.getElementById("tables").style.visibility = "visible";
    }
  };

  let paramsString =
    "terrain=" +
    document.getElementById("terrainDDL").value +
    "&event=" +
    document.getElementById("eventDDL").value;
  let params = new URLSearchParams(paramsString);
  xhr.send(params);
}

function loadEvents() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/events");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  let eventList = document.getElementById("eventDDL");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      var length = eventList.options.length;
      for (i = length - 1; i >= 0; i--) {
        eventList.options[i].remove();
      }
      let data = JSON.parse(xhr.responseText);
      for (let i = 0; i < data.length; i++) {
        let option = document.createElement("option");
        option.value = data[i].event;
        option.text = data[i].event;
        eventList.appendChild(option);
      }
    }
  };
  let paramsString = "terrain=" + document.getElementById("terrainDDL").value;
  let params = new URLSearchParams(paramsString);
  xhr.send(params);
}

function loadVenues() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/venues");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  let venueList = document.getElementById("venueDDL");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      var length = venueList.options.length;
      for (i = length - 1; i >= 0; i--) {
        venueList.options[i].remove();
      }
      let data = JSON.parse(xhr.responseText);
      for (let i = 0; i < data.length; i++) {
        let option = document.createElement("option");
        option.value = data[i].venue;
        option.text = data[i].venue;
        venueList.appendChild(option);
      }
    }
  };
  let paramsString =
    "terrain=" +
    document.getElementById("terrainDDL").value +
    "&event=" +
    document.getElementById("eventDDL").value;
  let params = new URLSearchParams(paramsString);
  xhr.send(params);
}

function loadAthletes() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/athletes");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  let athleteList = document.getElementById("athleteDDL");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      var length = athleteList.options.length;
      for (i = length - 1; i >= 0; i--) {
        athleteList.options[i].remove();
      }
      let data = JSON.parse(xhr.responseText);
      for (let i = 0; i < data.length; i++) {
        let option = document.createElement("option");
        option.value = data[i].name;
        option.text = data[i].name;
        athleteList.appendChild(option);
      }
    }
  };
  xhr.send();
}

function getEventPerformanceData() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/submitEventPerformances");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Request finished. Do processing here.
      let mensTable = document.getElementById("mensPerformanceTable");
      let womensTable = document.getElementById("womensPerformanceTable");
      let data = JSON.parse(xhr.responseText);

      //empty the tables if they have any old data in them
      for (var i = mensTable.rows.length; i > 0; i--)
        mensTable.deleteRow(i - 1);
      for (var i = womensTable.rows.length; i > 0; i--)
        womensTable.deleteRow(i - 1);
      let mencount = 0;
      let womencount = 0;
      //insert performance data into the performance.html mens/womens tables
      for (let i = 0; i < data.length; i++) {
        let tempRow;
        let mensTableRowCount;
        let womensTableRowCount;

        if (data[i].sex === 0) {
          mensTableRowCount = mensTable.rows.length;
          tempRow = mensTable.insertRow(mensTableRowCount);
          if (mencount < 10) tempRow.className = "gold";
          else if (mencount < 20) tempRow.className = "silver";
          else if (mencount < 30) tempRow.className = "bronze";
          mencount++;
        } else {
          womensTableRowCount = womensTable.rows.length;
          tempRow = womensTable.insertRow(womensTableRowCount);
          if (womencount < 10) tempRow.className = "gold";
          else if (womencount < 20) tempRow.className = "silver";
          else if (womencount < 30) tempRow.className = "bronze";
          womencount++;
        }
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        let tempCell4 = tempRow.insertCell(3);
        let tempCell5 = tempRow.insertCell(4);
        tempCell1.className = "rank";
        tempCell2.className = "name";
        tempCell3.className = "time";
        tempCell4.className = "date";
        tempCell5.className = "venue";
        if (data[i].sex === 0) {
          tempCell1.innerHTML = mensTableRowCount + 1;
        } else {
          tempCell1.innerHTML = womensTableRowCount + 1;
        }
        let time = data[i].mark.toString();
        while (time.indexOf("0") === 0 || time.indexOf(":") === 0) {
          time = time.substring(1, time.length);
        }
        if (time.indexOf(".00") == time.length - 3) {
          time = time.substring(0, time.length - 3);
        }
        tempCell2.innerHTML = data[i].name;
        if (data[i].relay == 1) tempCell3.innerHTML = time + " (r)";
        else if (data[i].timetrial == 1) tempCell3.innerHTML = time + " +";
        else tempCell3.innerHTML = time;
        tempCell4.innerHTML =
          data[i].day + " " + data[i].month + " " + data[i].year;
        tempCell5.innerHTML = data[i].venue;
      }
      if (mencount == 0) {
        let tempRow = mensTable.insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        let tempCell4 = tempRow.insertCell(3);
        let tempCell5 = tempRow.insertCell(4);
        tempCell1.innerHTML = "#";
        tempCell2.innerHTML = "Empty Tub!";
        tempCell3.innerHTML = "69:69:69.69";
        tempCell4.innerHTML = "69 Banterbruary 2069";
        tempCell5.innerHTML = "Tubville";
      }
      if (womencount == 0) {
        let tempRow = womensTable.insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        let tempCell4 = tempRow.insertCell(3);
        let tempCell5 = tempRow.insertCell(4);
        tempCell1.innerHTML = "#";
        tempCell2.innerHTML = "Empty Tub!";
        tempCell3.innerHTML = "69:69:69.69";
        tempCell4.innerHTML = "69 Banterbruary 2069";
        tempCell5.innerHTML = "Tubville";
      }
      document.getElementById("tables").style.visibility = "visible";
    }
  };
  let paramsString =
    "terrain=" +
    document.getElementById("terrainDDL").value +
    "&event=" +
    document.getElementById("eventDDL").value +
    "&venue=" +
    document.getElementById("venueDDL").value;
  let params = new URLSearchParams(paramsString);
  xhr.send(params);
}

function getAthleteData() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/submitAthletePerformances");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Request finished. Do processing here.
      let roadTable = document.getElementById("roadTable");
      let xcTable = document.getElementById("xcTable");
      let outdoorTable = document.getElementById("outdoorTable");
      let indoorTable = document.getElementById("indoorTable");
      let trailTable = document.getElementById("trailTable");
      let data = JSON.parse(xhr.responseText);

      //empty the tables if they have any old data in them
      for (var i = roadTable.rows.length; i > 0; i--)
        roadTable.deleteRow(i - 1);
      for (var i = xcTable.rows.length; i > 0; i--) xcTable.deleteRow(i - 1);
      for (var i = outdoorTable.rows.length; i > 0; i--)
        outdoorTable.deleteRow(i - 1);
      for (var i = indoorTable.rows.length; i > 0; i--)
        indoorTable.deleteRow(i - 1);
      for (var i = trailTable.rows.length; i > 0; i--)
        trailTable.deleteRow(i - 1);
      //insert performance data into the performance.html mens/womens tables
      for (let i = 0; i < data.length; i++) {
        let tempRow;
        let tableRowCount;

        if (data[i].terrain === "Road") {
          tableRowCount = roadTable.rows.length;
          tempRow = roadTable.insertRow(tableRowCount);
        } else if (data[i].terrain === "XC") {
          tableRowCount = xcTable.rows.length;
          tempRow = xcTable.insertRow(tableRowCount);
        } else if (data[i].terrain === "Outdoor") {
          tableRowCount = outdoorTable.rows.length;
          tempRow = outdoorTable.insertRow(tableRowCount);
        } else if (data[i].terrain === "Indoor") {
          tableRowCount = indoorTable.rows.length;
          tempRow = indoorTable.insertRow(tableRowCount);
        } else if (data[i].terrain === "Trail") {
          tableRowCount = trailTable.rows.length;
          tempRow = trailTable.insertRow(tableRowCount);
        }
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        let tempCell4 = tempRow.insertCell(3);
        tempCell1.className = "name";
        tempCell2.className = "time";
        tempCell3.className = "venue";
        tempCell4.className = "date";

        let time = data[i].mark.toString();
        while (time.indexOf("0") === 0 || time.indexOf(":") === 0) {
          time = time.substring(1, time.length);
        }
        if (time.indexOf(".00") == time.length - 3) {
          time = time.substring(0, time.length - 3);
        }
        tempCell1.innerHTML = data[i].event;
        if (data[i].relay == 1) tempCell2.innerHTML = time + " (r)";
        else if (data[i].timetrial == 1) tempCell2.innerHTML = time + " +";
        else tempCell2.innerHTML = time;
        tempCell3.innerHTML = data[i].venue;
        tempCell4.innerHTML =
          data[i].day + " " + data[i].month + " " + data[i].year;
      }
      if (roadTable.rows.length == 0) {
        let tempRow = roadTable.insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        tempCell1.innerHTML = "Empty Tub!";
      }
      if (xcTable.rows.length == 0) {
        let tempRow = xcTable.insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        tempCell1.innerHTML = "Empty Tub!";
      }
      if (outdoorTable.rows.length == 0) {
        let tempRow = outdoorTable.insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        tempCell1.innerHTML = "Empty Tub!";
      }
      if (indoorTable.rows.length == 0) {
        let tempRow = indoorTable.insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        tempCell1.innerHTML = "Empty Tub!";
      }
      if (trailTable.rows.length == 0) {
        let tempRow = trailTable.insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        tempCell1.innerHTML = "Empty Tub!";
      }

      document.getElementById("tables").style.visibility = "visible";
    }
  };
  let paramsString = "name=" + document.getElementById("athleteDDL").value;
  let params = new URLSearchParams(paramsString);
  xhr.send(params);
}

function isValidAddRequest() {
  //pull and validate user input
  let regex = /[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{2}/;
  let mark = document.getElementById("markTB").value;
  let isValidMark = regex.test(mark);
  if (isValidMark === false) {
    displayErrorMsgToUser("mark", "00:00:00.00");
    return false;
  }

  regex = /[A-Za-z]{1,127} [A-Za-z]{1,127}/;
  let name = document.getElementById("nameTB").value;
  let isValidName = regex.test(name);
  if (isValidName === false) {
    displayErrorMsgToUser(
      "name",
      "[first name] [last name] *only upper/lower case letters allowed"
    );
    return false;
  }

  regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
  let date = document.getElementById("dateTB").value;
  let isValidDate = regex.test(date);
  if (isValidDate === false) {
    displayErrorMsgToUser("date", "yyyy-mm-dd");
    return false;
  }

  regex = /[a-zA-Z ]{1,255}/;
  let venue = document.getElementById("venueTB").value;
  let isValidVenue = regex.test(venue);
  if (isValidVenue === false) {
    displayErrorMsgToUser(
      "venue",
      "only upper/lower case letters and spaces allowed"
    );
    return false;
  }

  regex = /[a-zA-Z0-9 ]{1,255}/;
  let event = document.getElementById("eventTB").value;
  let isValidEvent = regex.test(event);
  if (isValidEvent === false) {
    displayErrorMsgToUser(
      "event",
      "only alphanumberic characters and spaces allowed"
    );
    return false;
  }

  regex = /[a-zA-Z ]{1,255}/;
  let terrain = document.getElementById("terrainTB").value;
  let isValidTerrain = regex.test(terrain);
  if (isValidTerrain === false) {
    displayErrorMsgToUser(
      "terrain",
      "only upper/lower case letters and spaces allowed"
    );
    return false;
  }

  if (document.getElementById("sexDDL").selectedIndex === 0) {
    displayErrorMsgToUser("sex", "must choose a list option");
    return false;
  }
  if (document.getElementById("relayDDL").selectedIndex === 0) {
    displayErrorMsgToUser("relay", "must choose a list option");
    return false;
  }
  if (document.getElementById("timetrialDDL").selectedIndex === 0) {
    displayErrorMsgToUser("time trial", "must choose a list option");
    return false;
  }

  return true;
}

//TODO: implement user input validation for delete requests
function isValidDeleteRequest() {
  return true;
}

//TODO: implement user input validation for modify requests
function isValidModifyRequest(){
  return true;
}

function displayErrorMsgToUser(formFieldWithError, correctFieldFormat) {
  let errorField = document.getElementById("error").innerHTML;
  let message =
    "<br>" +
    "Error: problem with " +
    "<strong>" +
    formFieldWithError +
    "</strong>" +
    " field. " +
    "<br>" +
    "Entry must follow this format:" +
    " <strong>" +
    correctFieldFormat +
    "</strong><br>";
  let formattedMessage = message.fontcolor("red");
  document.getElementById("error").innerHTML = formattedMessage;
}

function printUpdateResult() {
  //print results of adding new record in update.html to the user screen
  let resultMessage = sessionStorage.getItem("insertResult");
  let message;
  let formattedMessage;
  if (resultMessage === "success") {
    message = "new record saved";
    formattedMessage = message.fontcolor("green");
  }
  if (resultMessage === "failure") {
    message = "failed to add record";
    formattedMessage = message.fontcolor("red");
  }

  sessionStorage.removeItem("insertResult");
  if (formattedMessage != undefined) {
    document.getElementById("result").innerHTML = formattedMessage;
  }
}

function printDeleteResult() {
  //print results of deleting record in update.html to the user screen
  let resultMessage = sessionStorage.getItem("deleteResult");
  let message;
  let formattedMessage;
  if (resultMessage === "delete success") {
    message = "successfully deleted record";
    formattedMessage = message.fontcolor("green");
  }
  if (resultMessage === "delete failure") {
    message = "failed to delete record";
    formattedMessage = message.fontcolor("red");
  }

  sessionStorage.removeItem("deleteResult");
  if (formattedMessage != undefined) {
    document.getElementById("deleteResult").innerHTML = formattedMessage;
  }
}

function printModifyResult() {}
