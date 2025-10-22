extends Node

var progress_conditions = {
	"has_visited_x": true,
	"has_visited_y": false,
}

func _ready():
	pass

func set_condition_to_true(key: String):
	if progress_conditions.has(key):
		progress_conditions[key] = true
	else:
		print("Error. Non-existent key")

