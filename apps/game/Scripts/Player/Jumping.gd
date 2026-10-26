class_name JumpingState

extends State

func update(_delta):
	if GameManager.get_player_movement().y == 0:
		transition.emit("IdleState")
