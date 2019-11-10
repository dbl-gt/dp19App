
var itemCount = 0; // for automatic element naming

class BuildingElement {
    constructor(pts, rot, lev) {
        this.points = pts;
        this.rotation = rot;
        this.level = lev;
        this.name = "BldEl_" + itemCount++;
        this.type = this.constructor.className;
        this.selected = false;
        this.color2d = this.constructor.color2d;
        this.color3d = this.constructor.color3d;
        this.selectcolor = this.constructor.selectcolor;
        this.opacity = this.constructor.opacity;
    };

    getHeights() {
        var entlevel = parseInt(this.level, 10);
        var zlevthis = this.constructor.grid.levels[entlevel];
        var zlevnext = this.constructor.grid.levels[entlevel + 1];
        return [zlevthis, zlevnext];
    }

    //typical draw3D for an element comprised of a list of vertices. 
    draw3D() {
        var sh = new THREE.Shape();
        var s3x = this.constructor.grid.s3x; // the grid 3D scale in x and y
        var s3y = this.constructor.grid.s3y;
        var levelheights = this.getHeights();
        var zlevedif = levelheights[1] - levelheights[0];

        var curclr;
        if (this.selected) curclr = this.selectcolor; else curclr = this.color3d;

        sh.moveTo(s3x * this.points[0].x, s3y * this.points[0].y);
        for (var i = 1; i < this.points.length; i++) {
            sh.lineTo(s3x * this.points[i].x, s3y * this.points[i].y);
        }
        sh.autoClose = true;
        var ext = {
            steps: 1,
            depth: zlevedif,
            bevelEnabled: false
        }
        var geo = new THREE.ExtrudeGeometry(sh, ext);
        geo.translate(0, 0, levelheights[0]);

        var m = new THREE.MeshPhongMaterial({
            color: new THREE.Color(curclr),
            opacity: this.opacity,
            transparent: (this.opacity > 0),
        });
        var me = new THREE.Mesh(geo, m);
        return me;

    };

    draw2D() { // instance method draw2D calls the CLASS method with the needed information
        for (var i = 0; i < this.points.length; i++) {
            var pixp1 = this.constructor.grid.indToPix(this.points[i]);
            //console.log("pixp1: " + pixp1.x + " " + pixp1.y);
            push();
            translate(pixp1.x, pixp1.y)
            rotate(PI / 2.0 * this.rotation);
            translate(-pixp1.x, -pixp1.y); 

            this.drawVertex2D(pixp1);
            pop(); // need this
            if (i > 0) {
                var pixp0 = this.constructor.grid.indToPix(this.points[i - 1]);
                this.drawEdge2D(pixp1, pixp0)
            }
        }
    };

    checkSelect2D(mouseind) {
    };

    // we can specialize the vertex  drawing for subclasses. YOU WILL TYPICALLY OVERRIDE THIS FOR YOUR CLASSES
    drawVertex2D(pixp1) {
        // your draw behavior here. translation has been set so draw at (0,0)
        if (this.selected) stroke(this.selectcolor) ; else stroke(this.color2d);
        strokeWeight(10);

        // draw functionality - local coordinates point is now 0,0
        point(pixp1.x, pixp1.y);

    }

    // we can specialize the edge drawing for subclasses. YOU WILL TYPICALLY OVERRIDE THIS FOR YOUR CLASSES
    drawEdge2D(p1, p2, selected) {
        if (this.selected) stroke(this.selectcolor) ; else stroke(this.color2d);
        strokeWeight(5);
        line(p1.x, p1.y, p2.x, p2.y);
    }

}

BuildingElement.addElement = function (pointList, rotation) {
    bldgElems.push(new this(pointList, rotation, currentLevel));
    return true;
}

BuildingElement.color3d = "#aaaaaa";
BuildingElement.color2d = "#aaaaaa";
BuildingElement.selectcolor = "#ff0000";
BuildingElement.opacity = 0.75;

class PointElement extends BuildingElement {
    checkSelect2D(mouseind) {
        if (mouseind.x == this.points[0].x && mouseind.y == this.points[0].y) {
            this.selected = !this.selected;
            return true;
        }
    };

}

class FurnitureElement extends PointElement {
}

function pointInLine(p0, p1, vpm) {
    //vector math - determines whether mouse is on line and between points (don't worry about it)
    let vp0 = createVector(p0.x, p0.y);
    let vp1 = createVector(p1.x, p1.y);
    let v0m = p5.Vector.sub(vp0, vpm);
    let v1m = p5.Vector.sub(vp1, vpm);
    let v10 = p5.Vector.sub(vp1, vp0);
    let crossp = p5.Vector.cross(v0m, v1m);
    if (crossp.mag() > .01) { return false; }
    v0m.normalize(); v1m.normalize(); v10.normalize();
    let val0 = v0m.dot(v10);
    let val1 = v1m.dot(v10);
    if (val0 <= 0 && val1 >= 0) {
        this.selected = !this.selected;
        return true;
    }
    return false;
}

class LinearElement extends BuildingElement {
    checkSelect2D(mouseind) {
        let vpm = createVector(mouseind.x, mouseind.y);
        for (var i = 0; i < this.points.length - 1; i++) {
            if (pointInLine(this.points[i], this.points[i + 1], vpm)) {
                this.selected = true; 
                return true;
            }
        }
        return false;
    };
}

LinearElement.addElement = function (pointList, rotation) {
    if (pointList.length == 2) {
        bldgElems.push(new this(pointList, rotation, currentLevel));
        return true;
    }
}



