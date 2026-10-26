extends Control

var Phone: Control
var Joystick: Node2D
var ToastContainer: VBoxContainer
var Toast: Control
var ToastLabel: Label
# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	ToastLabel = $ToastContainer/Toast/Label
	
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass
