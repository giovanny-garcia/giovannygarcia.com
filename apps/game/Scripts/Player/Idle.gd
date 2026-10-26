class_name IdleState

extends State

func update(_delta):
	if GameManager.get_player_movement().x != 0.0 || GameManager.get_player_movement().z != 0.0:
		transition.emit("RunningState")
	elif GameManager.get_player_movement().y > 0.0:
		transition.emit("JumpingState")
