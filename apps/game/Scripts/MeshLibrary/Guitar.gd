extends Area3D
# Called when the node enters the scene tree for the first time.
@onready var child = get_node_or_null("blockbench_export")

func _ready() -> void:
	if child:
		child.rotate_z(0.71)

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	if GameManager.guitar_obtained == true: 
		AudioManager.play_sfx("level")
		self.queue_free()

func _physics_process(delta: float) -> void:
	
	if child:
		child.rotate_y(0.01)
