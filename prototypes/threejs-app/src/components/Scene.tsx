import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function Scene() {
    const mountRef = useRef<HTMLDivElement>(null)
    const isInitialized = useRef(false)
    const [debugInfo, setDebugInfo] = useState({
        mousePos: { x: 0, y: 0 },
        intersectionCount: 0,
        hovering: false
    })

    useEffect(() => {
        if (isInitialized.current) return
        isInitialized.current = true

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()

        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setClearColor(0x222222)

        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement)
        }

        // Add OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.target.set(0, 0, 0)
        controls.update()

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
        directionalLight.position.set(5, 10, 7.5)
        scene.add(directionalLight)

        // Set camera position
        camera.position.set(0, 2, 4)
        camera.rotation.x = -0.3

        // DEBUG: Add visual ray helper
        const rayHelper = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, -1), // direction
            new THREE.Vector3(0, 0, 0),  // origin
            100, // length
            0xff0000, // red color
            20, // head length
            10  // head width
        )
        scene.add(rayHelper)

        // DEBUG: Intersection markers
        const intersectionMarkers: THREE.Mesh[] = []
        const createIntersectionMarker = () => {
            const geometry = new THREE.SphereGeometry(0.05, 8, 8)
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            return new THREE.Mesh(geometry, material)
        }

        // Debug mode toggle
        let debugMode = true
        rayHelper.visible = debugMode

        // Load models and textures
        const loader = new GLTFLoader()
        const textureLoader = new THREE.TextureLoader()

        let proto: THREE.Group | null = null
        let protoMaterials: THREE.Material[] = []

        const loadModel = (path: string, texturePath?: string, position?: THREE.Vector3) => {
            loader.load(
                path,
                (gltf) => {
                    const model = gltf.scene
                    
                    if (texturePath) {
                        const texture = textureLoader.load(texturePath)
                        model.traverse((child) => {
                            if (child instanceof THREE.Mesh) {
                                child.material = new THREE.MeshStandardMaterial({
                                    map: texture,
                                    roughness: 0.4,
                                    metalness: 0.2,
                                })
                            }
                        })
                    }
                    
                    if (position) {
                        model.position.copy(position)
                    }
                    
                    scene.add(model)

                    if (path === '/models/testing-unit.glb') {
                        proto = model
                        protoMaterials = []
                        
                        model.traverse((child) => {
                            if (child instanceof THREE.Mesh) {
                                if (Array.isArray(child.material)) {
                                    protoMaterials.push(...child.material)
                                } else {
                                    protoMaterials.push(child.material)
                                }
                            }
                        })
                        
                        console.log('Proto model assigned:', proto)
                        console.log('Proto materials:', protoMaterials)
                    }
                },
                undefined,
                (error) => {
                    console.error(`Error loading model at ${path}:`, error)
                }
            )
        }

        // Load desk model
        loadModel('/models/desk.glb', '/textures/wood.jpg', new THREE.Vector3(0, 0, 0))

        // Load testing unit model
        loadModel('/models/testing-unit.glb', undefined, new THREE.Vector3(0, 1.4, 0))

        // Handle mouse movement
        const onMouseMove = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect()
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
            
            // Update debug info
            setDebugInfo(prev => ({
                ...prev,
                mousePos: { x: mouse.x, y: mouse.y }
            }))
            
            console.log('Mouse normalized coords:', mouse.x.toFixed(2), mouse.y.toFixed(2))
        }

        // Handle raycasting on hover
        const checkHover = () => {
            if (!proto) return

            // Cast ray from mouse position through camera
            raycaster.setFromCamera(mouse, camera)
            
            // DEBUG: Update ray helper visualization
            if (debugMode) {
                rayHelper.setDirection(raycaster.ray.direction)
                rayHelper.position.copy(raycaster.ray.origin)
            }
            
            const intersects = raycaster.intersectObjects(scene.children, true)

            // DEBUG: Clear previous intersection markers
            intersectionMarkers.forEach(marker => {
                scene.remove(marker)
            })
            intersectionMarkers.length = 0

            // DEBUG: Add markers for intersections
            if (debugMode) {
                intersects.forEach((intersect, index) => {
                    if (index < 5) { // Limit to first 5 to avoid clutter
                        const marker = createIntersectionMarker()
                        marker.position.copy(intersect.point)
                        scene.add(marker)
                        intersectionMarkers.push(marker)
                    }
                })
            }

            // Update debug info
            setDebugInfo(prev => ({
                ...prev,
                intersectionCount: intersects.length
            }))

            console.log('Raycaster intersects:', intersects.length)
            
            let isHoveringProto = false

            // Check if any intersected object is a child of proto
            for (let intersect of intersects) {
                let obj: THREE.Object3D | null = intersect.object
                console.log('Checking object:', obj.name || obj.type, 'Distance:', intersect.distance.toFixed(2))
                
                // Traverse up the parent chain to see if it belongs to proto
                while (obj) {
                    if (obj === proto) {
                        console.log('Found proto object! Applying glow.')
                        isHoveringProto = true
                        break
                    }
                    obj = obj.parent
                }
                if (isHoveringProto) break
            }

            // Update debug info
            setDebugInfo(prev => ({
                ...prev,
                hovering: isHoveringProto
            }))

            if (isHoveringProto) {
                // Make proto glow
                protoMaterials.forEach(material => {
                    if (material instanceof THREE.MeshStandardMaterial && material.emissive) {
                        material.emissive.setHex(0xffa500) // Orange glow
                        material.emissiveIntensity = 0.5
                    }
                })
            } else {
                // Reset glow
                protoMaterials.forEach(material => {
                    if (material instanceof THREE.MeshStandardMaterial && material.emissive) {
                        material.emissive.setHex(0x000000) // No glow
                        material.emissiveIntensity = 0
                    }
                })
            }
        }

        // Handle click logic
        const onClick = () => {
            raycaster.setFromCamera(mouse, camera)
            const intersects = raycaster.intersectObjects(scene.children, true)

            if (intersects.length > 0) {
                console.log('Clicked on object:', intersects[0].object.name || intersects[0].object.type)
                alert('You clicked on an object!')
            }
        }

        // Toggle debug mode
        const toggleDebug = (event: KeyboardEvent) => {
            if (event.key === 'd' || event.key === 'D') {
                debugMode = !debugMode
                rayHelper.visible = debugMode
                intersectionMarkers.forEach(marker => {
                    marker.visible = debugMode
                })
                console.log('Debug mode:', debugMode ? 'ON' : 'OFF')
            }
        }

        // Handle window resize
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }

        // Add event listeners
        renderer.domElement.addEventListener('mousemove', onMouseMove)
        window.addEventListener('click', onClick)
        window.addEventListener('resize', onWindowResize)
        window.addEventListener('keydown', toggleDebug)

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate)
            controls.update()
            checkHover() // Check hover state every frame
            renderer.render(scene, camera)
        }
        animate()

        // Cleanup
        return () => {
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement)
            }
            renderer.domElement.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('click', onClick)
            window.removeEventListener('resize', onWindowResize)
            window.removeEventListener('keydown', toggleDebug)
            renderer.dispose()
        }
    }, [])

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
            <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
            
            {/* Debug Info Overlay */}
            <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: '10px',
                fontFamily: 'monospace',
                fontSize: '12px',
                pointerEvents: 'none',
                zIndex: 1000,
                borderRadius: '4px'
            }}>
                <div>Mouse: ({debugInfo.mousePos.x.toFixed(3)}, {debugInfo.mousePos.y.toFixed(3)})</div>
                <div>Intersections: {debugInfo.intersectionCount}</div>
                <div>Hovering Proto: {debugInfo.hovering ? 'YES' : 'NO'}</div>
                <div>Press 'D' to toggle ray visualization</div>
            </div>
        </div>
    )
}

export default Scene