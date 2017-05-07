(function() {
    "use strict";

    var scene, camera, renderer,
        stats, controls,
        step = 0;

    function createPlane() {
        var planeGeometry = new THREE.PlaneGeometry(60, 20),
            planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }),
            plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;
        plane.receiveShadow = true;
        return plane;
    }

    function createCube() {
        var cubeGeometry = new THREE.CubeGeometry(4, 4, 4),
            cubeMaterial = new THREE.MeshLambertMaterial({ // 材质, 描述外观
                color: 0xff0000,
                wireframe: false
            }),
            cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;
        cube.castShadow = true;     // 接受阴影
        cube.name = 'cube0';
        return cube;
    }

    function createSphere() {
        var sphereGeometry = new THREE.SphereGeometry(4, 20, 20),
            sphereMaterial = new THREE.MeshLambertMaterial({
                color: 0x7777ff,
                wireframe: false
            }),
            sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphere.position.x = 20;
        sphere.position.y = 4;
        sphere.position.z = 2;
        sphere.castShadow = true;
        sphere.name = 'sphere0';
        return sphere;
    }

    function createLight() {
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;            // 产生阴影
        return spotLight;
    }

    /**
     * Init scene
     * @returns {THREE.Scene}
     */
    function initScene() {
        var scene = new THREE.Scene();
        scene.add(new THREE.AxisHelper(20));
        scene.add(createPlane());   // 添加平面
        scene.add(createCube());    // 添加立方体
        scene.add(createSphere());  // 添加球形
        scene.add(createLight());   // 添加光源
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
        renderer.shadowMap.enabled = true;                          // 需要阴影
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
            this.rotationSpeed = 0.02;
            this.bouncingSpeed = 0.03;
        };

        var gui = new dat.GUI();
        gui.add(controls, 'rotationSpeed', 0, 0.5);
        gui.add(controls, 'bouncingSpeed', 0, 0.5);
        return controls;
    }

    /**
     * Animation
     */
    function animateScene() {
        var cube = scene.getObjectByName('cube0');
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        var sphere = scene.getObjectByName('sphere0');
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * Math.cos(step));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));
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