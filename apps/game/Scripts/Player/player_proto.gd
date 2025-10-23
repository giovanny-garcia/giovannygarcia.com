extends CharacterBody3D

const SPEED:int = 5.0
const JUMP_VELOCITY:int = 4.5

func _ready():
	pass
	#build_character(seed)
	#enable controls based on system
	#

func _physics_process(delta: float) -> void:
	# Set Movement as a Global 
	GameManager.set_player_movement(velocity)

	# Add the gravity.
	if not is_on_floor():
		velocity += get_gravity() * delta

	# Handle jump.
	if Input.is_action_just_pressed("JUMP") and is_on_floor():
		jump()

	# Get the input direction and handle the movement/deceleration.
	# As good practice, you should replace UI actions with custom gameplay actions.
	var input_dir := Input.get_vector("LEFT", "RIGHT", "FORWARD", "BACKWARD")
	var direction := (transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()
	if direction:
		velocity.x = direction.x * SPEED
		velocity.z = direction.z * SPEED
	else:
		velocity.x = move_toward(velocity.x, 0, SPEED)
		velocity.z = move_toward(velocity.z, 0, SPEED)

	move_and_slide()

func _process(delta):
	if GameManager.progress_conditions["has_visited_home"] == true:
		print("home visited")
		

func jump():
	velocity.y = JUMP_VELOCITY
