import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'


function Scene() {
    const mountRef = useRef<HTMLDivElement>(null)
    const isInitialized = useRef(false) // To prevent re-initialization on re-renders, AKA NO DOUBLE VIEWPORT

    useEffect(() => {
        
        if (isInitialized.current) return
        isInitialized.current = true

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ antialias: true })

        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setClearColor(0x222222)
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement)
        }

        // Basic lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
        scene.add(ambientLight)

        camera.position.z = 4
        camera.position.y = 2
        camera.rotation.x = -0.3 // Slightly tilt the camera down

        // Load GLTF model
        const loader = new GLTFLoader()
        loader.load(
            '/models/desk.glb', // Replace with the actual path to your model
            (gltf) => {
                const model = gltf.scene
                scene.add(model)
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the model:', error)
            }
        )

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate)
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