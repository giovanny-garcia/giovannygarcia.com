extends Node3D

@onready var child = get_node_or_null("blockbench_export")
@export var bob_height: float = 0.5  # How high/low the bobbing goes
@export var bob_speed: float = 2.0   # How fast it bobs
@export var rotation_speed: float = 1.0  # How fast it rotates

var time_elapsed: float = 0.0
var original_position: Vector3

func _ready() -> void:
	# Store the original position so we can bob relative to it
	if child:
		original_position = child.position

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	if child:
		# Update time for sine wave calculation
		time_elapsed += delta
		
		# Calculate bobbing motion using sine wave
		var bob_offset = sin(time_elapsed * bob_speed) * bob_height
		
		# Apply bobbing to Y position (up and down)
		child.position.y = original_position.y + bob_offset
		
		# Optional: Add rotation for extra visual appeal
		child.rotate_y(rotation_speed * delta)

