extends Node3D

var animationPlayer
# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	animationPlayer = $AnimationPlayer
	
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass
