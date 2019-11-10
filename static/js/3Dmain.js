

function setup3d(){

    scene3d=new THREE.Scene();

    camera3d=new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 10000);
    camera3d.up=new THREE.Vector3(0,0,1);
    camera3d.lookAt(new THREE.Vector3(250,250,0));
    camera3d.position.set(-30,-150,225);

    renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    div3d.appendChild(renderer.domElement);
    renderer.shadowMap.enabled=true; 


    controls=new THREE.OrbitControls(camera3d, renderer.domElement);
    controls.addEventListener("change", render3d);

    addLight3d();

    
}

function update3d(){
    for(var i=0; i<meshArr.length; i++){
        meshArr[i].geometry.dispose();
        meshArr[i].material.dispose();
        scene3d.remove(meshArr[i]);
        delete meshArr[i];
    }
    meshArr=[];
    ang+=Math.PI/180;
}

function draw3d(){
    update3d();
    var axes=new THREE.AxesHelper(45);
    scene3d.add(axes);


    if (bldgElems.length > 0) {
        for (var i = 0; i < bldgElems.length; i++) {
            var ret = bldgElems[i].draw3D(meshArr);
            if (ret) meshArr.push(ret);
        }
    }

    for(var i=0; i<meshArr.length ;i++){
        scene3d.add(meshArr[i]);
    }

    onWindowResize3d();
    render3d();
}


function onWindowResize3d(){
    camera3d.aspect=CANVAS_WIDTH / CANVAS_HEIGHT;
    camera3d.updateProjectionMatrix();
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
}

function render3d(){
    renderer.render(scene3d, camera3d);
}