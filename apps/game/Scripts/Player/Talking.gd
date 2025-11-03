class_name TalkingState

extends State

func update(_delta):
    if GameManager.player_is_talking == false:
        transition.emit("IdleState")