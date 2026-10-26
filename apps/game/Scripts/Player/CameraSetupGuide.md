# Camera Scene Structure for Gimbal Lock Prevention

## Required Node Hierarchy:
```
CameraRoot (Node3D) - Attach CameraController.gd script here
└── CamYaw (Node3D) - Handles horizontal rotation (Y-axis)
    └── CamPitch (Node3D) - Handles vertical rotation (X-axis)  
        └── CamRoll (Node3D) - Handles camera roll (Z-axis)
            └── Camera3D - The actual camera
```

## Setup Instructions:

1. **Create the Scene Structure:**
   - Create a new Scene with CameraRoot as Node3D root
   - Add child nodes following the hierarchy above
   - Attach the CameraController.gd script to CameraRoot

2. **Input Map Setup:**
   Add these actions to your Input Map (Project Settings > Input Map):
   ```
   CAM_LEFT - A key or left stick
   CAM_RIGHT - D key or left stick  
   CAM_UP - W key or left stick
   CAM_DOWN - S key or left stick
   ```

3. **Mobile Touch Controls:**
   - The script automatically detects mobile platforms
   - Touch and drag anywhere on screen to look around
   - Sensitivity is automatically adjusted for touch

## Why This Prevents Gimbal Lock:

- **Yaw Node**: Rotates only around Y-axis (left/right looking)
- **Pitch Node**: Rotates only around X-axis (up/down looking)  
- **Roll Node**: Rotates only around Z-axis (camera tilt)

By separating these rotations into different nodes, we avoid the mathematical 
issues that cause gimbal lock when all rotations are applied to a single node.

## Key Features:

✅ **Gimbal Lock Prevention** - Three separate rotation nodes
✅ **Mobile Touch Support** - Automatic touch controls on mobile
✅ **Cross-Platform** - Works on desktop, mobile, and gamepad
✅ **Smooth Rotation** - Lerp-based smoothing
✅ **Pitch Limits** - Prevents over-rotation
✅ **Customizable Sensitivity** - Per-input-type sensitivity settings

## Usage in Your Game:

1. Instance this camera scene in your player scene
2. Position it as a child of your player
3. Adjust the exported properties in the Inspector:
   - `is_mobile`: Force mobile mode
   - `mouse_sensitivity`: Desktop mouse sensitivity  
   - `touch_sensitivity`: Mobile touch sensitivity
   - `pitch_max_limit`/`pitch_min_limit`: Vertical look limits