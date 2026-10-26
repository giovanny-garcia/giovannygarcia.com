extends Node3D

@export var dialogue_resource: DialogueResource

@onready var InteractZone: Area3D = $Interactable

var player_in_zone: bool = false
# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	dialogue_resource = load("res://Assets/dialogue.dialogue")

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass

func _unhandled_input(event: InputEvent) -> void:
	if player_in_zone and event.is_action_pressed("INTERACT"):
		print("Player interacted with the sign!")
		DialogueManager.show_example_dialogue_balloon(dialogue_resource, "start")
		# Add additional interaction logic here, such as displaying text or triggering events.

func _on_interactable_body_entered(body:Node3D) -> void:
	player_in_zone = true



func _on_interactable_body_exited(body:Node3D) -> void:
	player_in_zone = false
	
