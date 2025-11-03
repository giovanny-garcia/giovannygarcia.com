extends Node

signal state_changed(new_state: String)

var player_state: State
var player_movement: Vector3 

var blip_locations {
 int: Vector3(0,0,0) 
}
@export var has_visited_home: bool = false
@export var has_visited_museum: bool = false
@export var has_visited_park: bool = false
@export var has_visited_shop: bool = false

@export var guitar_obtained: bool = false
@export var controller_obtained: bool = false
@export var book_obtained: bool = false
@export var cowboy_hat_obtained: bool = false
@export var latte_obtained: bool = false
@export var has_obtained_all_items: bool = false

var player_is_talking: bool = false 

@export var coin_count: int = 0
func _ready():
	pass

func set_player_state(player_state_instance):
	if player_state != player_state_instance:
		player_state = player_state_instance
		emit_signal("state_changed", player_state_instance.name)

func set_player_movement(velocity: Vector3):
	player_movement = velocity

func get_player_movement():
	return player_movement

func set_player_is_talking(is_talking: bool):
	player_is_talking = is_talking

func get_player_is_talking() -> bool:
	return player_is_talking
