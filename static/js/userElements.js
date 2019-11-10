/*
Define your classes here. You can remove or edit any of these. Remember:
- Any useable class must be added to bldgElemClasses in userDraw.js - userSetup();

To make a new class
-   There are both...
    ...instance functions which go in:

    MyClass {
        myInstanceFunction(paramaters) {
            code here
        }
    }  

    ...and class functions which are defined outside the MyClass {} definition as :

    MyClass.myClassFunction = function (parameters) {
        code here
     } 

- new BuildingElement classes are subclasses of PointElement, LinearElement, ClosedPLineElement, FurnitureElementElement

- all BuildingElement instances have the following parameters:
     type: the name of its class as a string. Changing its name doesn't change its class so be careful
     name: a string. Can be anything and doesn't drive any behavior
     points: // a list of [{"x": value1, "y" value2}, {"x": value3, "y" value4}, etc.]
     level:  // the bottom level index (either 0, 1, 2, ...). maps against MyClass.grid.levels to find the top and bottom heights for the instance's current level 
     rotation: // one of 0, 1, 2, or 3. For vertices this is multiplied by PI/2 to set the graphics rotation. This doesn't affect the edges.
     color: a string eg "#ff0000". Used in 2D and 3D. the function getColor() sets this from the Class default color if it isn't defined. 
     opacity: a value (0...1). Used in 3D. the function getOpacity() sets this from the Class default opacity if it isn't defined. 
     selected: true of false and dynamically set by the UI. You should only read this and not change it.

- BuildingElement classes have the following key functions. 
    * indicates you will typically override these for your classes
    ! indicates you typically won't, or change these with caution:

    instance functions:
    !   constructor(pts, rot, lev) //creates the instance and sets some default parameters.
    !   getColor() // dynamically creates color - change MyClass.color instead
    !   getOpacity() // dynamically creates color - change MyClass.color instead
    !   draw3d() // typically you will not need to change this. Change drawVertex3D, MyClass.color, etc. instead
    !   draw2d() // typically you will not need to change this. Change drawVertex2D,drawEdge2D, MyClass.color, etc. instead
    *   getHeights() // this returns an array [bottomHeight, topHeight] in 3D units based on this.level and this.level+1. Overwrite this to change MyClass extrusion behavior


*/

/////////////////////////////////////////// Wall Class ///////////////////////////////////////////////////////////
// An example LinearElement class - feel free to override it's behavior (change draw functions, add parameters) ///
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Wall extends LinearElement {

}
Wall.className = "Wall";    // non-abstract classes MUST have a unique className


Wall.color2d = "#333333";
Wall.color3d = "#ffff00";
Wall.opacity = 0;

/////////////////////////////////////////// Slab and Space Classes  ///////////////////////////////
///////////   Example LinearElement class compare with vs. each other and Wall      ///////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

class Space extends LinearElement {

}

Space.className = "Space";

Space.addElement = function (pointList, rotation) {
    var numpts = pointList.length;
    if (numpts < 2) return false;
    var firstpt = pointList[0];
    var lastpt = pointList[numpts - 1];
    if (firstpt.x == lastpt.x && firstpt.y == lastpt.y) {
        bldgElems.push(new Space(pointList, rotation, currentLevel));
        return true;
    }
}

Space.color2d = Space.color3d = "#8888ff";
Space.opacity = 0.5;

///////////////////////////////////////////////////////////////////////////////

class Slab extends LinearElement {

    getHeights() {
        var entlevel = parseInt(this.level, 10); // make sure it's a number
        var zlevthis = this.constructor.grid.levels[entlevel];
        //var zlevnext = this.constructor.grid.levels[entlevel + 1];
        var zlevnext = zlevthis - 1;
        return [zlevthis, zlevnext];
    }

}
Slab.className = "Slab";

Slab.addElement = function (pointList, rotation) {
    var numpts = pointList.length;
    if (numpts < 2) return false;
    var firstpt = pointList[0];
    var lastpt = pointList[numpts - 1];
    if (firstpt.x == lastpt.x && firstpt.y == lastpt.y) {
        bldgElems.push(new Slab(pointList, rotation, currentLevel));
        return true;
    }
}

Slab.color2d = "#888888";
Slab.color3d = "#ffffff";
Slab.opacity = 0.0;



/////////////////////////////////////////// Column Class ///////////////////////////////////////////////////////////
// An example PointElement class - feel free to override it's behavior (change draw functions, add parameters) ///
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Column extends PointElement {

    drawVertex2D(pixp1) {

        strokeWeight(2), stroke(0);
        if (this.selected) fill(this.selectcolor); else fill(this.color2d);
        rectMode(CENTER);
        rect(pixp1.x, pixp1.y, 20, 15);
    }

}
Column.className = "Column";
Column.color2d = "#8888ff";
Column.color3d = "#8888ff";
Column.opacity = 0.0;




/////////////////////////////////////////// FurnitureElement Class ///////////////////////////////////////////////////////////
// An example PointElement class - feel free to override it's behavior (change draw functions, add parameters) ///
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class Chair extends FurnitureElement {

    drawVertex2D(pixp1) {
        strokeWeight(2), stroke(0);
        if (this.selected) fill(this.selectcolor); else fill(this.color2d);
        triangle(pixp1.x-10, pixp1.y+10,
            pixp1.x+10, pixp1.y+10,
            pixp1.x, pixp1.y-10
        );


    }


}

Chair.className = "Chair";
Chair.color2d = "#88ff88";
Chair.color3d = "#88ff88";
Chair.opacity = 0.0;



