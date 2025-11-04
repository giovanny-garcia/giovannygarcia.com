extends CharacterBody3D

const SPEED:int = 5.0
const JUMP_VELOCITY:int = 5.5
var additional_speed:int = 0

# Calculate modified speed dynamically
func get_modified_speed() -> float:
	return SPEED + additional_speed

@onready var camera: Camera3D = $CameraRoot/CamYaw/CamPitch/CamRoll/Camera3D
@onready var UserInterface: Node = $CameraRoot/CamYaw/CamPitch/CamRoll/Camera3D/UserInterface
@onready var ToastLabel: Label = $CameraRoot/CamYaw/CamPitch/CamRoll/Camera3D/UserInterface/ToastContainer/Toast/Label
func _ready():
	pass
	#ToastLabel.text = "Hello Player! Here are your controls:\nWASD/Arrow Keys to Move\nSpace to Jump\nEnter to Interact\n Or Use Touch Controls!"
	#enable controls based on system
	#

func _physics_process(delta: float) -> void:
	# Set Movement as a Global 
	GameManager.set_player_movement(velocity)

	# Add the gravity.
	if not is_on_floor():
		velocity += get_gravity() * delta

	# Handle jump.
	if Input.is_action_just_pressed("JUMP") and is_on_floor() and GameManager.get_player_is_talking() == false:
		jump()

	# Get the input direction and handle the movement/deceleration.
	# As good practice, you should replace UI actions with custom gameplay actions.
	var input_dir := Input.get_vector("LEFT", "RIGHT", "FORWARD", "BACKWARD")
	
	# Calculate movement direction relative to camera orientation
	var cam_transform = camera.get_camera_transform()
	var cam_forward = -cam_transform.basis.z  # Camera's forward direction
	var cam_right = cam_transform.basis.x     # Camera's right direction
	
	# Project camera directions onto the horizontal plane (remove Y component)
	cam_forward.y = 0
	cam_right.y = 0
	cam_forward = cam_forward.normalized()
	cam_right = cam_right.normalized()
	
	# Calculate movement direction relative to camera
	var direction = (cam_forward * -input_dir.y + cam_right * input_dir.x).normalized()
	
	if direction and GameManager.get_player_is_talking() == false:
		velocity.x = direction.x * get_modified_speed()
		velocity.z = direction.z * get_modified_speed()
	else:
		velocity.x = move_toward(velocity.x, 0, get_modified_speed())
		velocity.z = move_toward(velocity.z, 0, get_modified_speed())

	move_and_slide()

func _process(_delta):
	if GameManager.giveplayerspeed == true:
		add_speed_boost()
		GameManager.giveplayerspeed = false
		

func jump():
	velocity.y = JUMP_VELOCITY


func _on_guitar_body_entered(_body:Node3D) -> void:
	ToastLabel.text = "Guitar Obtained!"


func _on_controller_body_entered(_body:Node3D) -> void:
	ToastLabel.text = "Controller Obtained!"


func _on_book_body_entered(_body:Node3D) -> void:
	ToastLabel.text = "Book Obtained!"

func add_speed_boost():
	print("Adding speed boost! Current speed: %d -> %d" % [get_modified_speed(), get_modified_speed() + 2])
	additional_speed += 2
	if ToastLabel:
		ToastLabel.text = "Speed Boost! Current Speed: %d" % get_modified_speed()