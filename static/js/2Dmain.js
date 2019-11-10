////////////////////  SETUP ///////////////////
function setup() {
    userSetup();
    let myCanvas = createCanvas(600, 300);
    myCanvas.parent('2D');

    for (var i = 0; i < bldgElemClasses.length; i++) {
        bldgElemClassesByNames[bldgElemClasses[i].className] = bldgElemClasses[i];
    }

    // Set radio buttons
    var formText = "<h3> Building Element Selection </h3> <form>";
    formText += '<input type="radio" name="classradio" value="SELECT" onclick="onRadioChecked(value)"  / > SELECT </input>';

    for (var i = 0; i < bldgElemClasses.length; i++) {
        var mytext = bldgElemClasses[i].className;
        formText += '<input type="radio" name="classradio" value="' + bldgElemClasses[i].className + '" onclick="onRadioChecked(value)"  / >' + bldgElemClasses[i].className + '</input>';
    }
    formText += "</form>";
    document.getElementById("form").innerHTML = formText;

    document.getElementsByName("classradio")[0].click(); // check the first button, also...
    // ...runs onRadioChecked, sets the currentBldClass

    var levelFormText = "<h3> Level Selection </h3>";
    levelFormText += "<form>";
    var gridlevels = grid.levels;
    for (var i = gridlevels.length - 1; i >= 0; i--) {
        var mytext = gridlevels[i];
        levelFormText += '<input type="radio" name="levelradio" value="' + i + '" onclick="onLevelRadioChecked(value)"  / >'
            + gridlevels[i] + '</input><br>';
    }
    levelFormText += "</form>";
    document.getElementById("divLevel3D").innerHTML = levelFormText;
    // check the first button, alsoruns onRadioChecked, sets the currentBldClass
    document.getElementsByName("levelradio")[gridlevels.length - 1].click();
    refreshObjectTable();
}

////////////////////  DRAW ///////////////////
function draw() {
    background(backgroundColor);
    noFill();

    // draw the grid
    stroke(0); strokeWeight(3);
    grid.draw();

    // pressing down the space bar sets the drawing mode to "orthoMode = true"
    if ((keyIsPressed == true) && (key === ' ')) orthoMode = true; else orthoMode = false;

    // Draw the EXISTING building elements
    if (bldgElems.length > 0) {
        for (var i = 0; i < bldgElems.length; i++) {
            bldgElems[i].draw2D();
        }
    }

    // Draw a dynamic temporary building element of the type currentBldClass
    if (currentBldClass && currentBldClass.grid.mouseInsideGrid()) {
        var mouseLoc = {
            "x": mouseX,
            "y": mouseY
        };
        var mouseInd = this.grid.pixToInd(mouseLoc);
        if (orthoMode && dynamicPoints.length > 0) {
            mouseInd = currentBldClass.grid.orthoPoint(mouseInd, dynamicPoints[dynamicPoints.length - 1]);
        }

        dynamicPoints.push(mouseInd); // add a point temporarily to the dynamicPoints list
        var tempElement = new currentBldClass(dynamicPoints, currentRotation, false);
        itemCount--;
        tempElement.draw2D();
        dynamicPoints.pop(); // remove the temporary mouse point from the dynamicPoints list
    }


}   // end draw

////////////////////  USER INTERACTION FUNCTIONS ///////////////////

////////////////////  mousePressed ///////////////////
function mousePressed() {
    var mouseind;
    var mouseloc = {
        "x": mouseX,
        "y": mouseY
    };

    if (currentBldClass == undefined) { // we are in selection mode
        // Check for selecting an existing building elements
        if (selectedElement) { selectedElement.selected = false; selectedElement = undefined; }
        if (bldgElems.length > 0) {
            for (var i = 0; i < bldgElems.length; i++) {
                mouseind = bldgElems[i].constructor.grid.pixToInd(mouseloc);
                if (bldgElems[i].checkSelect2D(mouseind)) {
                    selectedElement = bldgElems[i];
                    selectedID = i;
                    //console.log("Selected: " + i);
                    refreshObjectTable();
                    break;
                }
            }
        }
    }
    else {
        var mouseingrid = currentBldClass.grid.mouseInsideGrid();
        //console.log("Mouse in grid: " + mouseingrid);
        if (!mouseingrid) return;

        // get index of mouse
        mouseind = currentBldClass.grid.pixToInd(mouseloc);
        //if we are in orthmode ask the grid to fix the mouse location
        if (orthoMode && dynamicPoints.length > 0) {
            var mouseind = currentBldClass.grid.orthoPoint(mouseind, dynamicPoints[dynamicPoints.length - 1]);
        }
        // add a point permanently to the dynamicPoints list
        dynamicPoints.push(mouseind);
        if (currentBldClass.addElement(dynamicPoints, currentRotation)) {
            refreshObjectTable();
            dynamicPoints = [];
        };
    }
}

function onRadioChecked(value) {
    if (value != "SELECT") {
        currentBldClass = bldgElemClassesByNames[value];
    }
    else currentBldClass = undefined;
}

function onLevelRadioChecked(value) {
    currentLevel = parseInt(value, 10); // make sure it's an integer not a string!
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        if (selectedElement) {
            selectedElement.rotation--;
            if (selectedElement.rotation < 0) selectedElement.rotation = 3;
            refreshObjectTable();
        }
        else {
            currentRotation--;
            if (currentRotation < 0) currentRotation = 3;
        }
    }

    if (keyCode === RIGHT_ARROW) {
        if (selectedElement) {
            selectedElement.rotation++;
            if (selectedElement.rotation > 3) selectedElement.rotation = 0;
            refreshObjectTable();
        }
        else {
            currentRotation++;
            if (currentRotation > 3) currentRotation = 0;
        }
    }

    if (keyCode === ESCAPE) {
        dynamicPoints = [];
        currentRotation = 0;
        currentBldClass = undefined;
        document.getElementsByName("classradio")[0].click();
        if (selectedElement) { selectedElement.selected = false; selectedElement = undefined; }
        refreshObjectTable();
    }

    if (keyCode === DELETE) {
        if (selectedElement) {
            bldgElems.splice(selectedID, 1);
            selectedElement = undefined;
            refreshObjectTable();
        }
    }
}