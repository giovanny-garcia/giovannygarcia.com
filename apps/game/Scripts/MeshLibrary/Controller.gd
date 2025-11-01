extends Area3D

@onready var child = get_node_or_null("blockbench_export")

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	if child:
		child.rotate_z(0.71)

func _process(delta: float) -> void:
	if GameManager.controller_obtained == true: 
		AudioManager.play_sfx("level")
		self.queue_free()

func _physics_process(delta: float) -> void:
	
	if child:
		child.rotate_y(0.01)
# Called every frame. 'delta' is the elapsed time since the previous frame.

