function getPerformanceData() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/submitPerformances");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
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
      let mencount = 0;
      let womencount = 0;
      //insert performance data into the performance.html mens/womens tables
      for (let i = 0; i < data.length; i++) {
        let tempRow;
        let mensTableRowCount;
        let womensTableRowCount;
        
        if (data[i].sex === 0) {
          mensTableRowCount = document.getElementById("mensPerformanceTable")
            .rows.length;
          tempRow = mensTable.insertRow(mensTableRowCount);
          if(mencount < 10) tempRow.className = "gold";
          else if (mencount < 20) tempRow.className = "silver";
          else if (mencount < 30) tempRow.className = "bronze";
          mencount++;
        } else {
          womensTableRowCount = document.getElementById(
            "womensPerformanceTable"
          ).rows.length;
          tempRow = womensTable.insertRow(womensTableRowCount);
          if(womencount < 10) tempRow.className = "gold";
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
        while(time.indexOf("0") === 0 || time.indexOf(":") === 0){         
          time = time.substring(1,time.length);
        }
        if(time.indexOf(".00") == time.length -3){
          time = time.substring(0,time.length -3);
        }
        tempCell2.innerHTML = data[i].name;
        if(data[i].relay == 1) tempCell3.innerHTML = time + " (r)";
        else if(data[i].timetrial == 1) tempCell3.innerHTML = time + " +";
        else tempCell3.innerHTML = time;
        tempCell4.innerHTML = data[i].day + " " + data[i].month + " " + data[i].year;
        tempCell5.innerHTML = data[i].venue;
      }
      if(mencount == 0){
        let tempRow = document.getElementById("mensPerformanceTable").insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        let tempCell4 = tempRow.insertCell(3);
        let tempCell5 = tempRow.insertCell(4);
        tempCell1.innerHTML = '#';
        tempCell2.innerHTML = 'Empty Tub!';
        tempCell3.innerHTML = '69:69:69.69';
        tempCell4.innerHTML = '69 Banterbruary 2069';
        tempCell5.innerHTML = 'Tubville';
      }
      if(womencount == 0){
        let tempRow = document.getElementById("womensPerformanceTable").insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        let tempCell4 = tempRow.insertCell(3);
        let tempCell5 = tempRow.insertCell(4);
        tempCell1.innerHTML = '#';
        tempCell2.innerHTML = 'Empty Tub!';
        tempCell3.innerHTML = '69:69:69.69';
        tempCell4.innerHTML = '69 Banterbruary 2069';
        tempCell5.innerHTML = 'Tubville';
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
      let mencount = 0;
      let womencount = 0;
      for (let i = 0; i < data.length; i++) {
        let tempRow;
        let mensTableRowCount;
        let womensTableRowCount;
        if (data[i].sex === 0) {
          mensTableRowCount = document.getElementById("mensRecordTable")
            .rows.length;
          tempRow = mensTable.insertRow(mensTableRowCount);
          mencount++;
        } else {
          womensTableRowCount = document.getElementById(
            "womensRecordTable"
          ).rows.length;
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
        
        while(time.indexOf("0") === 0 || time.indexOf(":") === 0){
          time = time.substring(1,time.length);
        }
        if(time.indexOf(".00") == time.length -3){
          time = time.substring(0,time.length -3);
        }
        if(data[i].relay == 1) tempCell3.innerHTML = time + " (r)";
        else if(data[i].timetrial == 1) tempCell3.innerHTML = time + " +";
        else tempCell3.innerHTML = time;
      }
      if(mencount == 0){
        let tempRow = document.getElementById("mensRecordTable").insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        tempCell1.innerHTML = '#';
        tempCell2.innerHTML = 'Empty Tub!';
        tempCell3.innerHTML = '69:69:69.69';
      }
      if(womencount == 0){
        let tempRow = document.getElementById("womensRecordTable").insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        tempCell1.innerHTML = '#';
        tempCell2.innerHTML = 'Empty Tub!';
        tempCell3.innerHTML = '69:69:69.69';
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
  
  let eventList = document.getElementById("eventDDL");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      var length = eventList.options.length;
      for (i = length-1; i >= 0; i--) {
        eventList.options[i].remove();
      }
      let data = JSON.parse(xhr.responseText);
      for (let i = 0; i < data.length; i++) {
        let option = document.createElement('option');
        option.value = data[i].event;
        option.text = data[i].event;
        eventList.appendChild(option);
      }
    }
  }
  let paramsString = "terrain=" + document.getElementById("terrainDDL").value;
  let params = new URLSearchParams(paramsString);
  xhr.send(params);
};

function loadVenues(){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/venues");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
  let venueList = document.getElementById("venueDDL");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      var length = venueList.options.length;
      for (i = length-1; i >= 0; i--) {
        venueList.options[i].remove();
      }
      let data = JSON.parse(xhr.responseText);
      for (let i = 0; i < data.length; i++) {
        let option = document.createElement('option');
        option.value = data[i].venue;
        option.text = data[i].venue;
        venueList.appendChild(option);
      }
    }
  }
  let paramsString = "terrain=" + document.getElementById("terrainDDL").value +
   "&event=" + document.getElementById("eventDDL").value;
  let params = new URLSearchParams(paramsString);
  xhr.send(params);
};

function getEventPerformanceData(){
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
      let mencount = 0;
      let womencount = 0;
      //insert performance data into the performance.html mens/womens tables
      for (let i = 0; i < data.length; i++) {
        let tempRow;
        let mensTableRowCount;
        let womensTableRowCount;
        
        if (data[i].sex === 0) {
          mensTableRowCount = document.getElementById("mensPerformanceTable")
            .rows.length;
          tempRow = mensTable.insertRow(mensTableRowCount);
          if(mencount < 10) tempRow.className = "gold";
          else if (mencount < 20) tempRow.className = "silver";
          else if (mencount < 30) tempRow.className = "bronze";
          mencount++;
        } else {
          womensTableRowCount = document.getElementById(
            "womensPerformanceTable"
          ).rows.length;
          tempRow = womensTable.insertRow(womensTableRowCount);
          if(womencount < 10) tempRow.className = "gold";
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
        while(time.indexOf("0") === 0 || time.indexOf(":") === 0){         
          time = time.substring(1,time.length);
        }
        if(time.indexOf(".00") == time.length -3){
          time = time.substring(0,time.length -3);
        }
        tempCell2.innerHTML = data[i].name;
        if(data[i].relay == 1) tempCell3.innerHTML = time + " (r)";
        else if(data[i].timetrial == 1) tempCell3.innerHTML = time + " +";
        else tempCell3.innerHTML = time;
        tempCell4.innerHTML = data[i].day + " " + data[i].month + " " + data[i].year;
        tempCell5.innerHTML = data[i].venue;
      }
      if(mencount == 0){
        let tempRow = document.getElementById("mensPerformanceTable").insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        let tempCell4 = tempRow.insertCell(3);
        let tempCell5 = tempRow.insertCell(4);
        tempCell1.innerHTML = '#';
        tempCell2.innerHTML = 'Empty Tub!';
        tempCell3.innerHTML = '69:69:69.69';
        tempCell4.innerHTML = '69 Banterbruary 2069';
        tempCell5.innerHTML = 'Tubville';
      }
      if(womencount == 0){
        let tempRow = document.getElementById("womensPerformanceTable").insertRow(0);
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        let tempCell4 = tempRow.insertCell(3);
        let tempCell5 = tempRow.insertCell(4);
        tempCell1.innerHTML = '#';
        tempCell2.innerHTML = 'Empty Tub!';
        tempCell3.innerHTML = '69:69:69.69';
        tempCell4.innerHTML = '69 Banterbruary 2069';
        tempCell5.innerHTML = 'Tubville';
      }
      document.getElementById("tables").style.visibility = "visible";
    }
  }
  let paramsString =
  "terrain=" +
  document.getElementById("terrainDDL").value +
  "&event=" +
  document.getElementById("eventDDL").value +
  "&venue=" +
  document.getElementById("venueDDL").value;;
  let params = new URLSearchParams(paramsString);
  xhr.send(params);
}