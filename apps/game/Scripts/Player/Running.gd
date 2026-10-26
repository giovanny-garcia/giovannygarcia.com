class_name RunningState

extends State

func update(_delta):
	if GameManager.get_player_movement().x == 0.0 && GameManager.get_player_movement().z == 0.0:
		transition.emit("IdleState")
	elif GameManager.get_player_movement().y > 0.0:
		transition.emit("JumpingState")
