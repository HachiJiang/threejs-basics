(function() {
    "use strict";

    var scene, camera, renderer, stats, controls,
        step = 0;

    function addPlane() {
        var planeGeometry = new THREE.PlaneGeometry(180, 180),
            planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }),
            plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;
        plane.receiveShadow = true;
        plane.name = 'plane0';
        scene.add(plane);
    }

    function addCubes() {
        var plane = scene.getObjectByName('plane0'),
            cubeGeometry = new THREE.BoxGeometry(4, 4, 4),
            cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ee22});

        for (var j = 0; j < (plane.geometry.parameters.height / 5); j++) {
            for (var i = 0; i < plane.geometry.parameters.width / 5; i++) {
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

                cube.position.z = -((plane.geometry.parameters.height) / 2) + 2 + (j * 5);
                cube.position.x = -((plane.geometry.parameters.width) / 2) + 2 + (i * 5);
                cube.position.y = 2;
                scene.add(cube);
            }
        }
    }

    function addSphere() {
        var lookAtGeom = new THREE.SphereGeometry(2),
            lookAtMesh = new THREE.Mesh(lookAtGeom, new THREE.MeshLambertMaterial({ color: 0xff0000 }));

        lookAtMesh.name = 'lookAtMesh0';
        scene.add(lookAtMesh);
    }

    function addLights() {
        var ambientLight = new THREE.AmbientLight(0x0c0c0c), // 环境光
            directionalLight = new THREE.DirectionalLight(0xffffff);       // 聚光灯

        directionalLight.position.set(-20, 40, 60);
        scene.add(directionalLight);
        scene.add(ambientLight);
    }

    /**
     * Init scene
     */
    function initScene() {
        scene = new THREE.Scene();
        addPlane();     // 添加物体
        addCubes();
        addSphere();
        addLights();      // 添加光源
        return scene;
    }

    /**
     * Init camera
     * @param {Object} position
     * @returns {THREE.PerspectiveCamera}
     */
    function initCamera(position) {
        var camera = new THREE.PerspectiveCamera(
                45,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );

        camera.position.x = 120;
        camera.position.y = 60;
        camera.position.z = 180;
        camera.lookAt(position); // 指向scene的中心
        return camera;
    }

    /**
     * Init renderer
     */
    function initRenderer() {
        var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(); // 向后兼容
        renderer.setClearColor(0xEEEEEE, 1.0);                      // 背景色
        renderer.setSize(window.innerWidth, window.innerHeight);    // 设置渲染窗口尺寸
        renderer.shadowMapEnabled = true;                          // 需要阴影
        return renderer;
    }

    function initStats() {
        var stats = new Stats(),
            container = document.getElementById('Stats-output');

        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        stats.domElement.style.top = '0px';
        container.appendChild(stats.domElement);
        return stats;
    }

    function initControls() {
        var controls = new function () {
            this.perspective = "Perspective";
            this.switchCamera = function () {
                if (camera instanceof THREE.PerspectiveCamera) {
                    camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
                    camera.position.x = 120;
                    camera.position.y = 60;
                    camera.position.z = 180;

                    camera.lookAt(scene.position);
                    this.perspective = "Orthographic";
                } else {
                    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                    camera.position.x = 120;
                    camera.position.y = 60;
                    camera.position.z = 180;

                    camera.lookAt(scene.position);
                    this.perspective = "Perspective";
                }
            };
        };

        var gui = new dat.GUI();
        gui.add(controls, 'switchCamera');
        gui.add(controls, 'perspective').listen();
        return controls;
    }

    /**
     * Animation
     */
    function animateScene() {
        var lookAtMesh = scene.getObjectByName('lookAtMesh0');
        step += 0.02;
        if (camera instanceof THREE.Camera) {
            var x = 10 + ( 100 * (Math.sin(step)));
            camera.lookAt(new THREE.Vector3(x, 10, 0)); // 改变相机拍摄的中心点位置
            lookAtMesh.position.copy(new THREE.Vector3(x, 10, 0));
        }
    }

    /**
     * Start render
     */
    function renderScene() {
        stats.update();
        animateScene();   // add animation
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    window.onload = function() {
        var container = document.getElementById('webgl-container');
        scene = initScene();
        camera = initCamera(scene.position);
        renderer = initRenderer();
        stats = initStats();
        controls = initControls();
        container.appendChild(renderer.domElement);     // canvas节点被加入到page dom tree中
        renderScene();                             // 启动渲染过程
    };
})();