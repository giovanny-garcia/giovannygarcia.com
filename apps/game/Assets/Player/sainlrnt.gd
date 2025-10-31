extends Node3D
@onready var animationPlayer: AnimationPlayer = $AnimationPlayer
@export var _rotation_speed: float = TAU * 2

var theta: float 
var direction: Vector3

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	# Connect to a hypothetical GameManager's state_changed signal
	GameManager.state_changed.connect(_on_state_changed)
	# Called every frame. 'delta' is the elapsed time since the previous frame.
	direction = GameManager.get_player_movement()

func _process(_delta: float) -> void:
	pass

func _physics_process(delta: float):
	direction = GameManager.get_player_movement()
	direction.y = 0 #reimplement for a less costly solution that doesnt update every frame and is static instead.
	if direction:
		theta = wrapf(atan2(-direction.x, -direction.z) - rotation.y + PI, -PI, PI)
		rotation.y += clamp(_rotation_speed * delta, 0, abs(theta)) * sign(theta)
		#look_at(position + direction)

func _on_state_changed(new_state: String) -> void:
	match new_state:
		"IdleState":
			print("Playing Idle Animation")
			animationPlayer.play("Idle")
		"RunningState":
			print("Playing Run Animation")
			animationPlayer.play("Run")
		"JumpingState":
			print("Playing Jump Animation")
			animationPlayer.play("Jump")
		_:
			print("Unknown state: %s" % new_state)
			animationPlayer.stop()

func move(new_direction: Vector3):
	direction = new_direction
