(function() {
    "use strict";

    var scene, camera, renderer, stats, controls;

    function createPlane() {
        var planeGeometry = new THREE.PlaneGeometry(60, 40),
            planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }),
            plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;
        plane.receiveShadow = true;
        plane.name = 'plane0';
        return plane;
    }

    function createCube() {
        var geom = new THREE.BoxGeometry(5, 8, 3),
            material = new THREE.MeshLambertMaterial({ color: 0x44ff44 }),
            cube = new THREE.Mesh(geom, material);

        cube.position.y = 4;
        cube.castShadow = true;
        cube.name = 'cube0';
        return cube;
    }

    function createLights() {
        var ambientLight = new THREE.AmbientLight(0x0c0c0c), // 环境光
            spotLight = new THREE.SpotLight(0xffffff);       // 聚光灯

        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        return [ambientLight, spotLight];
    }

    /**
     * Init scene
     * @returns {THREE.Scene}
     */
    function initScene() {
        var scene = new THREE.Scene(),
            lights = createLights();

        scene.add(createPlane());   // 添加平面
        scene.add(createCube());   // 添加平面
        _.forEach(lights, function(light) {
            scene.add(light);       // 添加光源
        });
        scene.fog = new THREE.FogExp2(0xffffff, 0.015);
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

        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
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
            this.scaleX = 1;
            this.scaleY = 1;
            this.scaleZ = 1;

            this.positionX = 0;
            this.positionY = 4;
            this.positionZ = 0;

            this.rotationX = 0;
            this.rotationY = 0;
            this.rotationZ = 0;
            this.scale = 1;

            this.translateX = 0;
            this.translateY = 0;
            this.translateZ = 0;

            this.visible = true;

            this.translate = function () {
                var cube = scene.getObjectByName('cube0');
                cube.translateX(controls.translateX);
                cube.translateY(controls.translateY);
                cube.translateZ(controls.translateZ);

                controls.positionX = cube.position.x;
                controls.positionY = cube.position.y;
                controls.positionZ = cube.position.z;
            }
        };

        var gui = new dat.GUI(),
            guiScale = gui.addFolder('scale'),
            guiPosition = gui.addFolder('position'),
            guiRotation = gui.addFolder('rotation'),
            guiTranslate = gui.addFolder('translate');

        guiScale.add(controls, 'scaleX', 0, 5);
        guiScale.add(controls, 'scaleY', 0, 5);
        guiScale.add(controls, 'scaleZ', 0, 5);

        guiPosition.add(controls, 'positionX', -10, 10);
        guiPosition.add(controls, 'positionY', -4, 20);
        guiPosition.add(controls, 'positionZ', -10, 10);

        guiRotation.add(controls, 'rotationX', -4, 4);
        guiRotation.add(controls, 'rotationY', -4, 4);
        guiRotation.add(controls, 'rotationZ', -4, 4);

        guiTranslate.add(controls, 'translateX', -10, 10);
        guiTranslate.add(controls, 'translateY', -10, 10);
        guiTranslate.add(controls, 'translateZ', -10, 10);
        guiTranslate.add(controls, 'translate');

        gui.add(controls, 'visible');
        return controls;
    }

    /**
     * Animation
     */
    function animateScene() {
        var cube = scene.getObjectByName('cube0');
        cube.visible = controls.visible;
        cube.position.x = controls.positionX;
        cube.position.y = controls.positionY;
        cube.position.z = controls.positionZ;
        cube.rotation.x = controls.rotationX;
        cube.rotation.y = controls.rotationY;
        cube.rotation.z = controls.rotationZ;
        cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);
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