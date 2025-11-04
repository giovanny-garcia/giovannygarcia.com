extends Node3D

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	# Set up and start the music queue from the main menu
	if AudioManager:
		# Check if music is already playing (from previous level)
		if AudioManager.music_player.playing:
			print("Music already playing, setting up queue without interrupting...")
			# Set up the queue but don't start it - let current song finish naturally
			AudioManager.setup_gameplay_music_queue_without_starting()
		else:
			print("No music playing, starting fresh queue...")
			# Start the full gameplay music queue, beginning with main menu music
			AudioManager.start_gameplay_music()
		print("Music queue set up from main menu")
	else:
		print("AudioManager not found - cannot play main menu music")

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass


func _on_home_zone_body_entered(body: Node3D) -> void:
	pass


func _on_guitar_body_entered(body: Node3D) -> void:
	GameManager.guitar_obtained = true
	
	
func _on_controller_body_entered(body:Node3D) -> void:
	GameManager.controller_obtained = true

func _on_book_body_entered(body:Node3D) -> void:
	GameManager.book_obtained = true
