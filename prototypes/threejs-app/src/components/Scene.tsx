import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function Scene() {
    const mountRef = useRef<HTMLDivElement>(null)
    const isInitialized = useRef(false) // To prevent re-initialization on re-renders, AKA NO DOUBLE VIEWPORT

    useEffect(() => {
        if (isInitialized.current) return
        isInitialized.current = true

        const color = 0xFFFFFF // Background color
        const intensity = 0.5 // Light intensity
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ antialias: true })

        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setClearColor(0x222222)

        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement)
        }

        // Add OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true // Smooth camera movement
        controls.dampingFactor = 0.05
        controls.target.set(0, 0, 0) // Focus on the center of the scene
        controls.update()

        // Basic lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
        directionalLight.position.set(5, 10, 7.5) // Position the light
        scene.add(directionalLight)

        camera.position.z = 4
        camera.position.y = 2
        camera.rotation.x = -0.3 // Slightly tilt the camera down

        // Load GLTF model
        const loader = new GLTFLoader()

        // Model desk
        let table: THREE.Object3D | null = null // Reference to the loaded model

        loader.load(
            '/models/desk.glb', // Replace with the actual path to your model
            (gltf) => {
                table = gltf.scene
                scene.add(table)
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the table model:', error)
            }
        )

        loader.load(
            '/models/testing-unit.glb', 
            (gltf) => {
                const test = gltf.scene
                test.position.set(0, 0, 0) // Adjust position as needed
                scene.add(test)
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the proto model:', error)
            }
        )

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate)

            // Rotate the model slowly if it exists
            if (table) {
                table.rotation.y += 0.001 // Adjust rotation speed here
            }

            controls.update() // Update OrbitControls
            renderer.render(scene, camera)
        }
        animate()

        // Cleanup
        return () => {
            mountRef.current?.removeChild(renderer.domElement)
        }
    }, [])

    return <div ref={mountRef} />
}

export default Scene