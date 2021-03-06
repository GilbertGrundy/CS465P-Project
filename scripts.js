function getPerformanceData() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/submitPerformances");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  console.log(xhr.readyState);
  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Request finished. Do processing here.
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
  document.getElementById("insertRecord").style.display = "block";
}

//TODO: implement sendUserCRUDrequest()
function sendUserCRUDrequest() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/update");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Request finished. Do processing here.
    }

    //pull user input from the webform
    //validate user input
    //let paramsString =
    //let params = new URLSearchParams(paramsString);
    //xhr.send(params);
  };
}

function getRecordData(){
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
      for (
        var i = document.getElementById("mensRecordTable").rows.length;
        i > 0;
        i--
      ) {
        document.getElementById("mensRecordTable").deleteRow(i - 1);
      }
      for (
        var i = document.getElementById("womensRecordTable").rows.length;
        i > 0;
        i--
      ) {
        document.getElementById("womensRecordTable").deleteRow(i - 1);
      }

      //insert performance data into the performance.html mens/womens tables
      for (let i = 0; i < data.length; i++) {
        let tempRow;
        let mensTableRowCount;
        let womensTableRowCount;

        if (data[i].sex === 0) {
          mensTableRowCount = document.getElementById("mensRecordTable")
            .rows.length;
          tempRow = mensTable.insertRow(mensTableRowCount);
        } else {
          womensTableRowCount = document.getElementById(
            "womensRecordTable"
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
};

function loadEvents(){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/events");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  console.log("scripts Events!");
  console.log(xhr.readyState);
  
  let eventList = document.getElementById("eventDDLRecords");
  let form = document.getElementById("recordForm");
  let sub_button = document.getElementById("getEvents")
  //let terrain = document.getElementById("terrainDDL");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    console.log("In onreadystatechange");
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let list = document.createElement("select");
      let line = document.createElement("br");
      list.name = "event";
      list.id = "eventDDL";
      // Request finished. Do processing here.
      let data = JSON.parse(xhr.responseText);
      console.log("Within IF");
      for (let i = 0; i < data.length; i++) {
        let option = document.createElement('option');
        option.value = data[i].event;
        option.text = data[i].event;
        list.appendChild(option);
      }
      form.insertBefore(list,sub_button);
      form.insertBefore(line,sub_button);
      form.insertBefore(line,sub_button);

    }
  }
  let paramsString = "terrain=" + document.getElementById("terrainDDL").value;
  let params = new URLSearchParams(paramsString);
  xhr.send(params);
};