extends Node3D
@onready var animationPlayer: AnimationPlayer = $AnimationPlayer
# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	
	# Connect to a hypothetical GameManager's state_changed signal
	GameManager.state_changed.connect(_on_state_changed)
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass

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