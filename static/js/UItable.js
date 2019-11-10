
// !!MUST DO: ADD PAREMATERS YOU WANT DISPLAYED TO THIS ARRAY:
//var datalist = ["type", "name", "level", "rotation"];

//////  DYNAMIC OBJECT - VALUE CREATION TABLE refreshObjectTable()
/////   Essentially creates a row for each object in bldgElems, 
/////   with an input field for each value listed in datalist
/////   onEditValue() and onDeleteValue() are helper functions
function refreshObjectTable() {
    let i, j;
    let objText = "";
    objText += "<form>";
    objText += "<table>";
    // make the header
    objText += "<tr>";
    for (j = 0; j < datalist.length; j++) {
        objText += "<td>";
        objText += datalist[j];
        objText += "</td>";
    }
    objText += "</tr>";

    // make the table of editable object bldgElems fields
    for (i = 0; i < bldgElems.length; i++) { // for each object
        if (selectedElement && selectedID == i) objText += '<tr style="background-color: red;">';
        else objText += "<tr>";
        for (j = 0; j < datalist.length; j++) { // for each value in the datalist
            objText += "<td>";
            var value = bldgElems[i][datalist[j]];
            var itemValue = i + "?" + datalist[j];
            objText += '<input type="text" onchange="onEditValue(this.name, this.value)" name="' + itemValue + '" value="' + value + '">';
            objText += "</td>";
        }

        // more flexible buttons, where what appears could be any DOM content 
        // copy and delete don't make sense here. If they do, uncomment the next 2 lines.
        objText += '<td><button type="button" onclick="onDeleteObject(this.name)" name="' + i + '" > <img style="height:15px" src="static/assets/img/delete.png"> </td>';
        objText += "</tr>";
    }
    objText += "</table><br>";
    // create new and edit don't make sense here. If they do, uncomment the next 2 lines.
    objText += "</form>";
    document.getElementById("objTable").innerHTML = objText;
}

// edit a single value through the edit box
function onEditValue(name, value) {
    // break out the object # and value
    var res = name.split("?");
    bldgElems[res[0]][res[1]] = value;
}

//refreshObjectTable();

//////  DYNAMIC OBJECT EDITING TABLE
/////   Essentially creates a row for each value in datalist, 
/////   and a creation function
/////   onCreateObject() is a helper function
/////   if i != -1, fill in the table with bldgElems[i]'s values.
/////   if isNew == true, create a new object on OK, otherwise edit the existing object i
function showEditTable(i, isNew) {
    let j;
    var editDiv = document.getElementById("objCreateOrEdit");

    let objText = "";
    objText += "<form>";
    objText += "<table>";
    for (j = 0; j < datalist.length; j++) {
        objText += "<tr><td>";
        // add the name
        objText += datalist[j];
        objText += "</td><td>";
        // now add the input form element
        if (i == -1) objText += '<input type="text" id="' + datalist[j] + '">';
        else objText += '<input type="text" id="' + datalist[j] + '" value=' + bldgElems[i][datalist[j]] + '>';
        objText += "</td></tr>";
    }
    objText += "</table><br>";
    // if isNew the OK button creates, if false it edits object bldgElems[i]
    if (isNew == true) objText += '<input type="button" onclick="onCreateObject()" value="CREATE" ></input>' + '&nbsp'
    else objText += '<input type="button" onclick="onEditObject(' + i + ')" value="EDIT" ></input>' + '&nbsp'
    objText += '<input type="button" onclick="onCancelObject()" value="CANCEL" ></input> '
    objText += "</form>";

    //console.log(objText);
    editDiv.innerHTML = objText;
    editDiv.style.visibility = "visible";
}

// Makes a new object, with values filled in from the editTable
function onCreateObject() {
    let newObj = new Object;
    for (j = 0; j < datalist.length; j++) {
        //console.log(datalist[j]);
        newObj[datalist[j]] = document.getElementById(datalist[j]).value;
    }
    //console.log(newObj);
    bldgElems.push(newObj);
    refreshObjectTable();
    document.getElementById("objCreateOrEdit").style.visibility = "hidden";
}

// delete an object where id is the number of the object in the bldgElems array
function onDeleteObject(id) {
    // delete an object by number (row)
    bldgElems.splice(id, 1);
    refreshObjectTable();
}

// just cancel
function onCancelObject() {
    document.getElementById("objCreateOrEdit").style.visibility = "hidden";

}

function onEditObject(i) {
    let obj = bldgElems[i];
    for (j = 0; j < datalist.length; j++) {
        //console.log(datalist[j]);
        obj[datalist[j]] = document.getElementById(datalist[j]).value;
    }
    //console.log(obj);
    refreshObjectTable();
    document.getElementById("objCreateOrEdit").style.visibility = "hidden";
}

function transmitData() {
    dataArr=[];
    for (var i = 0; i < bldgElems.length; i++) {
        var pts = bldgElems[i].points;
        var ptstr = '';
        for (var j = 0; j < pts.length; j++) {
            ptstr += pts[j].x + "," + pts[j].y + ";";
        }
        var json = {
            'type': bldgElems[i].type,
            'coords': ptstr,
        };
        var str = JSON.stringify(json);
        dataArr.push(str);
    }
    var json = {
        'id': Date.now()
    };
    var str = JSON.stringify(json);
    dataArr.push(str);
    document.getElementById("update").value = dataArr;
}