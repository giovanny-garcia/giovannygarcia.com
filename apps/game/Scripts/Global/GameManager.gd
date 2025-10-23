extends Node

var player_state
var player_movement

var progress_conditions = {
	"has_visited_home": false,
	"has_visited_museum": false,
}

func _ready():
	pass

func set_condition_to_true(key: String):
	if progress_conditions.has(key):
		progress_conditions[key] = true
	else:
		print("Error. Non-existent key while trying to set.")

func get_condition(key: String):
	if progress_conditions.has(key):
		return progress_conditions[key]
	else:
		print("Error. Non-existent key while trying to get")

func set_player_state(player_state_instance):
	player_state = player_state_instance

func set_player_movement(velocity: Vector3):
	player_movement = velocity

func get_player_movement():
	return player_movement
