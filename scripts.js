function getPerformanceData() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://127.0.0.1:5000/submit");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Request finished. Do processing here.
      let mensTable = document.getElementById("mensPerformanceTable");
      let womensTable = document.getElementById("womensPerformanceTable");
      let data = JSON.parse(xhr.responseText);

      //insert performance data into the performance.html mens/womens tables
      for (let i = 0; i < data.length; i++) {
        let tempRow = mensTable.insertRow(i);
        let tempCell1 = tempRow.insertCell(0);
        let tempCell2 = tempRow.insertCell(1);
        let tempCell3 = tempRow.insertCell(2);
        let tempCell4 = tempRow.insertCell(3);

        tempCell1.innerHTML = data[i].name;
        tempCell2.innerHTML = data[i].capital;
        tempCell3.innerHTML = data[i].population;
        tempCell4.innerHTML = data[i].region;

        tempRow = womensTable.insertRow(i);
        tempCell1 = tempRow.insertCell(0);
        tempCell2 = tempRow.insertCell(1);
        tempCell3 = tempRow.insertCell(2);
        tempCell4 = tempRow.insertCell(3);

        tempCell1.innerHTML = data[i].name;
        tempCell2.innerHTML = data[i].capital;
        tempCell3.innerHTML = data[i].population;
        tempCell4.innerHTML = data[i].region;
      }
      document.getElementById("tables").style.visibility = 'visible' ;
    }
  };

  /*
  let formData = new FormData();
  formData.append("Terrain", document.getElementById("terrain").value);
  formData.append("Distance", document.getElementById("distance").value);
  for (var pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }
  */
  let paramsString =
    "terrain=" +
    document.getElementById("terrainDDL").value +
    "&distance=" +
    document.getElementById("distanceDDL").value;
  let params = new URLSearchParams(paramsString);
  xhr.send(params);
}

function showSelectedUpdateForm(){
  document.getElementById("insertRecord").style.display = 'block';
}