import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { CharacterControls } from '../characterControls';

const Scene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa8def0); // Set background color
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 5); // Set initial camera position

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Orbit Controls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.minDistance = 5;
    orbitControls.maxDistance = 15;
    orbitControls.enablePan = false;
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.5; // Limit vertical rotation to avoid flipping
    orbitControls.update();

    //Model Loading
    var characterControls: CharacterControls
    new GLTFLoader().load('models/Soldier.glb', (gltf) => {
      const model = gltf.scene;
      model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
          //object.receiveShadow = true;
        });
        scene.add(model);

        const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
        const mixer = new THREE.AnimationMixer(model);
        const animationsMap: Map<string, THREE.AnimationAction> = new Map();
        gltfAnimations.filter(a => a.name != 'TPose').forEach((a: THREE.AnimationClip) => {
          animationsMap.set(a.name, mixer.clipAction(a))
      })
      
      characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'Idle');
      //Control Keys
    const keysPressed = { }
    const keyDisplayQueue = new KeyDisplay();
    document.addEventListener('keydown', (event) => {
      keyDisplayQueue.down(event.key)
      if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle()

      } else {
        (keysPressed as any)[event.key.toLowerCase()] = true;
      }
    }, false);
    document.addEventListener('keyup', (event) => {
      keyDisplayQueue.up(event.key);
      (keysPressed as any)[event.key.toLowerCase()] = false;
    }, false);
    // Ensure renderer is only appended once
    if (!mountRef.current.hasChildNodes()) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Example: Add a cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      let mixerUpdateDelta = clock.getDelta();
      if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []); // Empty dependency array ensures this runs only once

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Scene;