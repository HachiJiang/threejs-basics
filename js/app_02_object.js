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
        _.forEach(lights, function(light) {
            scene.add(light);       // 添加光源
        });
        scene.fog = new THREE.FogExp2(0xffffff, 0.015);
        //scene.overrideMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
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
            this.rotationSpeed = 0.02;
            this.numberOfObjects = scene.children.length;

            this.removeCube = function () {
                var allChildren = scene.children,
                    lastObject = allChildren[allChildren.length - 1];
                if (lastObject instanceof THREE.Mesh) { // 检查以防误删相机和光源
                    scene.remove(lastObject);
                    this.numberOfObjects = scene.children.length;
                }
            };

            this.addCube = function () {
                var cubeSize = Math.ceil((Math.random() * 3)),
                    cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
                    cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}),
                    cube = new THREE.Mesh(cubeGeometry, cubeMaterial),
                    plane = scene.getObjectByName('plane0'),
                    planeGeometry = plane && plane.geometry;

                if (!planeGeometry) {
                    return;
                }

                cube.castShadow = true;
                cube.name = "cube-" + scene.children.length;

                // position the cube randomly in the scene

                cube.position.x = -15 + Math.round((Math.random() * planeGeometry.parameters.width));
                cube.position.y = Math.round((Math.random() * 5));
                cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

                // add the cube to the scene
                scene.add(cube);
                this.numberOfObjects = scene.children.length;
            };

            this.outputObjects = function () {
                console.log(scene.children);
            }
        };

        var gui = new dat.GUI();
        gui.add(controls, 'rotationSpeed', 0, 0.5);
        gui.add(controls, 'addCube');
        gui.add(controls, 'removeCube');
        gui.add(controls, 'outputObjects');
        gui.add(controls, 'numberOfObjects').listen();
        return controls;
    }

    /**
     * Animation
     */
    function animateScene() {
        // rotate the cubes around its axes
        scene.traverse(function (e) { // 遍历所有对象
            var plane = scene.getObjectByName('plane0');
            if (e instanceof THREE.Mesh && e != plane) {
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });
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