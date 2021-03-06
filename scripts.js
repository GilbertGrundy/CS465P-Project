window.onload = function () {
  printUpdateResult();
};

function performanceSubmitBtn_Click() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/submit");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let mensTable = document.getElementById("mensPerformanceTable");
      let womensTable = document.getElementById("womensPerformanceTable");
      let data = JSON.parse(xhr.responseText);

      //empty the tables if they have any old data in them
      for (
        var i = document.getElementById("mensPerformanceTable").rows.length;
        i > 0;
        i--
      ) {
        document.getElementById("mensPerformanceTable").deleteRow(i - 1);
      }
      for (
        var i = document.getElementById("womensPerformanceTable").rows.length;
        i > 0;
        i--
      ) {
        document.getElementById("womensPerformanceTable").deleteRow(i - 1);
      }

      //insert performance data into the performance.html mens/womens tables
      for (let i = 0; i < data.length; i++) {
        let tempRow;
        let mensTableRowCount;
        let womensTableRowCount;

        if (data[i].sex === 0) {
          mensTableRowCount = document.getElementById("mensPerformanceTable")
            .rows.length;
          tempRow = mensTable.insertRow(mensTableRowCount);
        } else {
          womensTableRowCount = document.getElementById(
            "womensPerformanceTable"
          ).rows.length;
          tempRow = womensTable.insertRow(womensTableRowCount);
        }
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        let tempCell4 = tempRow.insertCell(3);
        let tempCell5 = tempRow.insertCell(4);
        if (data[i].sex === 0) {
          tempCell1.innerHTML = mensTableRowCount + 1;
        } else {
          tempCell1.innerHTML = womensTableRowCount + 1;
        }
        tempCell2.innerHTML = data[i].mark;
        tempCell3.innerHTML = data[i].name;
        tempCell4.innerHTML = data[i].date_of.slice(0, 10);
        tempCell5.innerHTML = data[i].venue;
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
  document.getElementById("insertRecord").style.display = "block";
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
  //print results of user actions in update.html to the user screen
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
