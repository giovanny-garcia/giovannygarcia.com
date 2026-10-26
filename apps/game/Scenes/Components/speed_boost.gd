extends Area3D

@onready var child = get_node_or_null("blockbench_export")

# Signals
signal collected(boost_amount: int)

# Speed boost properties
@export var boost_amount: int = 2
@export var collect_sound: AudioStream
@export var collection_effect: PackedScene

var is_collected: bool = false

func _ready() -> void:
	# Connect Area3D signals for collision detection
	body_entered.connect(_on_body_entered)
	body_exited.connect(_on_body_exited)
	
	# Connect to GameManager or other systems if needed
	if GameManager.has_signal("speed_boost_collected"):
		GameManager.speed_boost_collected.connect(_on_collected_signal)

func _process(_delta: float) -> void:
	# Queue free if child is hidden or already collected
	if (child and child.visible == false) or is_collected:
		self.queue_free()

func _physics_process(delta: float) -> void:
	# Rotate the visual element for attraction
	if child and not is_collected:
		child.rotate_y(2 * delta)

func _on_body_entered(body: Node3D) -> void:
	# Check if player entered the collection area
	if body.has_method("add_speed_boost") and not is_collected:
		collect_speed_boost(body)

func _on_body_exited(_body: Node3D) -> void:
	# Optional: Handle when player leaves area
	pass

func collect_speed_boost(player: Node3D) -> void:
	if is_collected:
		return
	
	is_collected = true
	
	# Give speed boost to player
	if player.has_method("add_speed_boost"):
		player.add_speed_boost()
	
	# Set GameManager flag
	if GameManager.has_method("set"):
		GameManager.giveplayerspeed = true
	
	# Emit signal for other systems
	collected.emit(boost_amount)
	
	# Play collection sound
	if collect_sound:
		play_collection_sound()
	
	# Spawn collection effect
	if collection_effect:
		spawn_collection_effect()
	
	# Hide visual and queue for deletion
	if child:
		child.visible = false
	
	# Optional: Add a small delay before queue_free for effects
	await get_tree().create_timer(0.1).timeout
	queue_free()

func play_collection_sound() -> void:
	if collect_sound:
		# Create temporary AudioStreamPlayer
		var audio_player = AudioStreamPlayer.new()
		get_tree().current_scene.add_child(audio_player)
		audio_player.stream = collect_sound
		audio_player.play()
		
		# Remove audio player after sound finishes
		audio_player.finished.connect(audio_player.queue_free)

func spawn_collection_effect() -> void:
	if collection_effect:
		var effect_instance = collection_effect.instantiate()
		get_tree().current_scene.add_child(effect_instance)
		effect_instance.global_position = global_position

# Signal handler for external collection trigger
func _on_collected_signal() -> void:
	if not is_collected:
		queue_free()

# Public method for manual collection (can be called by other scripts)
func trigger_collection(collector: Node3D = null) -> void:
	if collector and collector.has_method("add_speed_boost"):
		collect_speed_boost(collector)
	else:
		# Just destroy without giving boost
		is_collected = true
		if child:
			child.visible = false
		queue_free()

# Method to connect custom signals from other nodes
func connect_to_signal(signal_source: Node, signal_name: String) -> void:
	if signal_source.has_signal(signal_name):
		signal_source.connect(signal_name, _on_collected_signal)
