extends Node3D
class_name CameraRoot

# Node references
@onready var yaw_node: Node3D
@onready var pitch_node: Node3D  
@onready var roll_node: Node3D
@onready var camera: Camera3D

# Settings
@export var is_mobile: bool = false
@export var use_touch_controls: bool = true

# Rotation limits
@export var pitch_max_limit: float = 80.0
@export var pitch_min_limit: float = -80.0

# Current rotation values
var yaw: float = 0.0
var pitch: float = 0.0
var roll: float = 0.0

# Sensitivity settings
@export var mouse_sensitivity: float = 0.07
@export var touch_sensitivity: float = 2.0
@export var joystick_sensitivity: float = 4.0

# Smoothing
@export var rotation_smoothing: float = 15.0

# Touch handling
var is_dragging: bool = false
var last_touch_position: Vector2

func _ready() -> void:
	# Get node references - using the three-node hierarchy
	yaw_node = get_node("CamYaw")
	pitch_node = get_node("CamYaw/CamPitch") 
	roll_node = get_node("CamYaw/CamPitch/CamRoll")
	camera = get_node("CamYaw/CamPitch/CamRoll/Camera3D")
	
	# Detect if we're on mobile
	is_mobile = OS.get_name() in ["Android", "iOS"]
	
	# Set appropriate mouse mode
	if not is_mobile:
		Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)

func _process(delta: float) -> void:
	# Handle joystick/gamepad input
	handle_joystick_input(delta)
	
	# Clamp pitch to prevent over-rotation
	pitch = clamp(pitch, pitch_min_limit, pitch_max_limit)
	
	# Apply rotations with smoothing to prevent gimbal lock
	apply_smooth_rotations(delta)

func _physics_process(delta: float) -> void:
	# Handle touch input for mobile
	if is_mobile and use_touch_controls:
		handle_touch_input(delta)

func _input(event: InputEvent) -> void:
	if event is InputEventMouseMotion and not is_mobile:
		handle_mouse_input(event)
	elif event is InputEventScreenTouch and is_mobile:
		handle_screen_touch(event)
	elif event is InputEventScreenDrag and is_mobile:
		handle_screen_drag(event)

func handle_mouse_input(event: InputEventMouseMotion) -> void:
	if Input.get_mouse_mode() == Input.MOUSE_MODE_CAPTURED:
		var mouse_delta = event.relative
		yaw -= mouse_delta.x * mouse_sensitivity
		pitch -= mouse_delta.y * mouse_sensitivity

func handle_joystick_input(delta: float) -> void:
	# Handle both traditional gamepad and mobile virtual joystick
	var camera_input = Input.get_vector("CAM_LEFT", "CAM_RIGHT", "CAM_UP", "CAM_DOWN")
	
	if camera_input.length() > 0:
		yaw -= camera_input.x * joystick_sensitivity * delta * 60.0  # 60fps normalized
		pitch -= camera_input.y * joystick_sensitivity * delta * 60.0

func handle_screen_touch(event: InputEventScreenTouch) -> void:
	if event.pressed:
		is_dragging = true
		last_touch_position = event.position
	else:
		is_dragging = false

func handle_screen_drag(event: InputEventScreenDrag) -> void:
	if is_dragging:
		var drag_delta = event.position - last_touch_position
		last_touch_position = event.position
		
		# Apply touch sensitivity
		yaw -= drag_delta.x * touch_sensitivity * 0.01
		pitch -= drag_delta.y * touch_sensitivity * 0.01

func handle_touch_input(_delta: float) -> void:
	# Additional touch handling logic can go here
	# This could include multi-touch gestures, pinch-to-zoom, etc.
	pass

func apply_smooth_rotations(delta: float) -> void:
	# Apply rotations to separate nodes to prevent gimbal lock
	
	# Yaw (Y-axis rotation) - horizontal looking
	var target_yaw = Vector3(0, yaw, 0)
	yaw_node.rotation_degrees = yaw_node.rotation_degrees.lerp(
		target_yaw, 
		rotation_smoothing * delta
	)
	
	# Pitch (X-axis rotation) - vertical looking  
	var target_pitch = Vector3(pitch, 0, 0)
	pitch_node.rotation_degrees = pitch_node.rotation_degrees.lerp(
		target_pitch, 
		rotation_smoothing * delta
	)
	
	# Roll (Z-axis rotation) - camera tilt (usually kept at 0)
	var target_roll = Vector3(0, 0, roll)
	roll_node.rotation_degrees = roll_node.rotation_degrees.lerp(
		target_roll, 
		rotation_smoothing * delta
	)

# Utility functions
func set_camera_sensitivity(new_sensitivity: float) -> void:
	mouse_sensitivity = new_sensitivity
	touch_sensitivity = new_sensitivity * 2.0
	joystick_sensitivity = new_sensitivity * 4.0

func reset_camera_rotation() -> void:
	yaw = 0.0
	pitch = 0.0
	roll = 0.0

func set_pitch_limits(min_limit: float, max_limit: float) -> void:
	pitch_min_limit = min_limit
	pitch_max_limit = max_limit

# For debugging
func get_camera_info() -> Dictionary:
	return {
		"yaw": yaw,
		"pitch": pitch, 
		"roll": roll,
		"is_mobile": is_mobile,
		"is_dragging": is_dragging
	}