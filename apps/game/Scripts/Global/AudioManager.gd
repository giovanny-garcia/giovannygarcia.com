extends Node

var buses = { # Dictionary of audio buses
	"Master": AudioServer.get_bus_index("Master"),
	"Music": AudioServer.get_bus_index("Music"),
	"SFX": AudioServer.get_bus_index("SFX"),
}

var sound_effects = { # Dictionary of sound effects
#	"shoot": preload("res://Audio/Player/shoot.wav"),
}

var music_player: AudioStreamPlayer = null
var sfx_player: Array[AudioStreamPlayer] = []

# Music Queue System
var music_queue: Array[AudioStream] = []
var current_track_index: int = 0
var queue_active: bool = false
var auto_advance: bool = true

# Store original volumes to maintain consistency
var original_music_volume: float = -10.46  # Default music volume in dB (30% volume)
var original_sfx_volume: float = 0.0    # Default SFX volume in dB

func _ready() -> void:
	# Ensure audio buses exist and are properly configured
	setup_audio_buses()
	
	# Set initial master volume to 50%
	set_master_volume_percentage(50.0)
	
	# Initialize the music player
	music_player = AudioStreamPlayer.new()
	music_player.set_bus("Music")
	add_child(music_player)
	
	# Connect the finished signal for music queue functionality
	music_player.finished.connect(_on_music_finished)

	for i in range(5): # Initialize multiple SFX players
		var sfx = AudioStreamPlayer.new()
		sfx.set_bus("SFX")
		add_child(sfx)
		sfx_player.append(sfx)
	
	# Set initial bus volumes to ensure proper separation
	set_bus_volume("Music", original_music_volume)
	set_bus_volume("SFX", original_sfx_volume)
	print("Audio buses initialized - Music: ", original_music_volume, "dB, SFX: ", original_sfx_volume, "dB")

func setup_audio_buses():
	# Ensure Music and SFX buses exist
	var music_bus_index = AudioServer.get_bus_index("Music")
	var sfx_bus_index = AudioServer.get_bus_index("SFX")
	
	# If buses don't exist, create them
	if music_bus_index == -1:
		AudioServer.add_bus()
		var new_bus_count = AudioServer.get_bus_count()
		AudioServer.set_bus_name(new_bus_count - 1, "Music")
		music_bus_index = new_bus_count - 1
		print("Created Music bus at index: ", music_bus_index)
	
	if sfx_bus_index == -1:
		AudioServer.add_bus()
		var new_bus_count = AudioServer.get_bus_count()
		AudioServer.set_bus_name(new_bus_count - 1, "SFX")
		sfx_bus_index = new_bus_count - 1
		print("Created SFX bus at index: ", sfx_bus_index)
	
	# Update the buses dictionary with current indices
	buses["Music"] = music_bus_index
	buses["SFX"] = sfx_bus_index
	
	# Make Music and SFX buses independent by routing them directly to Master
	if music_bus_index != -1:
		AudioServer.set_bus_send(music_bus_index, "Master")
	if sfx_bus_index != -1:
		AudioServer.set_bus_send(sfx_bus_index, "Master")
	
	print("Audio bus setup complete:")
	print("  Master bus: ", AudioServer.get_bus_index("Master"))
	print("  Music bus: ", music_bus_index)
	print("  SFX bus: ", sfx_bus_index)

func play_sfx(sound: String, volume: float = 0.0):
	if sound in sound_effects:
		for player in sfx_player:
			if not player.playing:
				player.stream = sound_effects[sound]
				player.volume_db = volume
				player.play()
				print("Playing SFX '", sound, "' at volume: ", volume, "dB on SFX bus")
				return
		# If no free player, create a new one    
		var new_player = AudioStreamPlayer.new()
		new_player.set_bus("SFX")
		new_player.volume_db = volume
		add_child(new_player)
		sfx_player.append(new_player)
		new_player.stream = sound_effects[sound]
		new_player.play()
		print("Playing SFX '", sound, "' at volume: ", volume, "dB on SFX bus (new player)")
	else:
		print("Sound effect '", sound, "' not found in sound_effects dictionary")

#Play music by AudioStream or path
func play_music(stream: AudioStream):
	if music_player.stream != stream:
		music_player.stream = stream
		music_player.play()

# Music Queue Functions
func setup_music_queue(songs: Array, loop: bool = true):
	"""Set up a music queue with an array of songs"""
	print("🎵 setup_music_queue called with ", songs.size(), " songs")
	
	# Clear any existing queue
	music_queue.clear()
	
	# Copy the songs
	for song in songs:
		if song != null:
			music_queue.append(song)
	
	current_track_index = 0
	auto_advance = loop
	queue_active = true
	
	print("🎵 Music queue set up with ", music_queue.size(), " tracks, looping: ", loop)
	print("🎵 Queue active: ", queue_active)
	print("🎵 Auto advance: ", auto_advance)
	
	# Debug: Check each track
	for i in range(music_queue.size()):
		var track = music_queue[i]
		print("  Track ", i + 1, ": ", track.resource_path if track else "null")
		if track is AudioStreamOggVorbis:
			print("    Loop: ", track.loop)
		elif track is AudioStreamWAV:
			print("    Loop mode: ", track.loop_mode)

func start_music_queue():
	"""Start playing the music queue from the first track"""
	if music_queue.size() > 0:
		current_track_index = 0
		queue_active = true
		print("🎵 Starting music queue...")
		play_current_track()
	else:
		print("🎵 No music queue set up!")

func play_current_track():
	"""Play the current track in the queue"""
	if music_queue.size() > 0 and current_track_index < music_queue.size():
		var current_track = music_queue[current_track_index]
		music_player.stream = current_track
		music_player.play()
		print("🎵 Playing track ", current_track_index + 1, " of ", music_queue.size())
		print("  Track resource: ", current_track.resource_path if current_track else "null")
		print("  Player playing: ", music_player.playing)
	else:
		print("🎵 No valid track to play (queue size: ", music_queue.size(), ", index: ", current_track_index, ")")

func next_track():
	"""Manually advance to the next track"""
	if music_queue.size() > 0:
		var old_index = current_track_index
		current_track_index = (current_track_index + 1) % music_queue.size()
		print("🎵 Next track: ", old_index, " → ", current_track_index)
		play_current_track()
	else:
		print("🎵 No tracks in queue for next_track()")

func previous_track():
	"""Go back to the previous track"""
	if music_queue.size() > 0:
		var old_index = current_track_index
		current_track_index = (current_track_index - 1) % music_queue.size()
		if current_track_index < 0:
			current_track_index = music_queue.size() - 1
		print("🎵 Previous track: ", old_index, " → ", current_track_index)
		play_current_track()
	else:
		print("🎵 No tracks in queue for previous_track()")

func _on_music_finished():
	"""Called when current music track finishes"""
	print("🎵 Music track finished!")
	print("  Queue active: ", queue_active)
	print("  Auto advance: ", auto_advance) 
	print("  Queue size: ", music_queue.size())
	print("  Current track index: ", current_track_index)
	
	if queue_active and auto_advance and music_queue.size() > 0:
		print("  → Advancing to next track...")
		next_track()
	else:
		print("  → Not advancing (queue inactive or no auto-advance)")

func stop_music_queue():
	"""Stop the music queue"""
	queue_active = false
	stop_music()

func pause_music_queue():
	"""Pause the music queue"""
	pause_music()

func resume_music_queue():
	"""Resume the music queue"""
	resume_music()

func get_current_track_info() -> Dictionary:
	"""Get information about the current track"""
	if music_queue.size() > 0 and current_track_index < music_queue.size():
		return {
			"track_number": current_track_index + 1,
			"total_tracks": music_queue.size(),
			"is_playing": music_player.playing,
			"queue_active": queue_active
		}
	else:
		return {
			"track_number": 0,
			"total_tracks": 0,
			"is_playing": false,
			"queue_active": false
		}

# Helper function to load a non-looping audio stream
func load_non_looping_audio(path: String) -> AudioStream:
	"""Load an audio file and ensure it doesn't loop"""
	var stream = load(path)
	if stream is AudioStreamOggVorbis:
		# For OGG files, we can't easily copy them in Godot 4
		# Instead, we'll just set loop to false on the original
		# This should work since we're not modifying a shared resource
		if stream.loop:
			print("🎵 Setting OGG stream to non-looping: ", path)
			stream.loop = false
		return stream
	elif stream is AudioStreamWAV:
		# For WAV files, set loop mode to disabled
		if stream.loop_mode != AudioStreamWAV.LOOP_DISABLED:
			print("🎵 Setting WAV stream to non-looping: ", path)
			stream.loop_mode = AudioStreamWAV.LOOP_DISABLED
		return stream
	else:
		print("⚠️ Unknown audio format: ", stream.get_class() if stream else "null")
		return stream

# Example: Set up a simple music loop with all available tracks
func setup_gameplay_music_queue():
	"""Set up the default gameplay music queue with available songs"""
	print("🎵 Setting up gameplay music queue...")
	
	# Load all songs directly first
	var song1 = load("res://Audio/Music/main_menu.ogg")
	var song2 = load("res://Audio/Music/BulletHellMainMenuDemo.ogg")
	var song3 = load("res://Audio/Music/dont_take_this_personally.mp3")
	var song4 = load("res://Audio/Music/zap.mp3")
	
	print("🎵 Loaded songs directly:")
	print("  Song 1: ", song1 != null, " - ", song1.resource_path if song1 else "null")
	print("  Song 2: ", song2 != null, " - ", song2.resource_path if song2 else "null")
	print("  Song 3: ", song3 != null, " - ", song3.resource_path if song3 else "null")
	print("  Song 4: ", song4 != null, " - ", song4.resource_path if song4 else "null")
	
	# Make them non-looping
	if song1:
		song1 = load_non_looping_audio("res://Audio/Music/main_menu.ogg")
	if song2:
		song2 = load_non_looping_audio("res://Audio/Music/BulletHellMainMenuDemo.ogg")
	if song3:
		song3 = load_non_looping_audio("res://Audio/Music/dont_take_this_personally.mp3")
	if song4:
		song4 = load_non_looping_audio("res://Audio/Music/zap.mp3")
	
	print("🎵 Made non-looping:")
	print("  Song 1: ", song1 != null)
	print("  Song 2: ", song2 != null)
	print("  Song 3: ", song3 != null)
	print("  Song 4: ", song4 != null)
	
	# Create playlist array (remove type annotation to avoid issues)
	var playlist = []
	if song1:
		playlist.append(song1)
	if song2:
		playlist.append(song2)
	if song3:
		playlist.append(song3)
	if song4:
		playlist.append(song4)
	
	print("🎵 Playlist created with ", playlist.size(), " songs")
	
	# Set up the queue
	if playlist.size() > 0:
		setup_music_queue(playlist, true)  # true = loop the queue
		print("🎵 Gameplay music queue set up with ", playlist.size(), " non-looping tracks")
	else:
		print("🎵 ERROR: No songs loaded for playlist!")

# Example: Start the music queue (call this in your level)
func start_gameplay_music():
	"""Convenience function to start the gameplay music"""
	print("🎵 start_gameplay_music() called")
	setup_gameplay_music_queue()
	start_music_queue()

# Set up the queue without starting (for seamless transitions)
func setup_gameplay_music_queue_without_starting():
	"""Set up the queue but don't interrupt currently playing music"""
	print("🎵 Setting up queue without starting...")
	setup_gameplay_music_queue()
	
	# Don't call start_music_queue() - let current song finish
	# But make sure the queue will activate when current song ends
	if music_player.playing:
		print("🎵 Music currently playing, queue will activate when current song finishes")
		queue_active = true  # Ensure queue is active for when current song ends
		
		# Check what's currently playing and set the appropriate index
		var current_stream = music_player.stream
		if current_stream and music_queue.size() > 0:
			# Find the current song in the queue
			for i in range(music_queue.size()):
				if music_queue[i].resource_path == current_stream.resource_path:
					current_track_index = i
					print("🎵 Found current song at index ", i, " in queue")
					break
	else:
		# No music playing, start normally
		start_music_queue()

# Debug function to test queue advancement
func test_queue_advance():
	"""Manually test the queue advancement - useful for debugging"""
	print("🎵 Testing queue advance...")
	if music_player.playing:
		print("  Stopping current track to test advancement...")
		music_player.stop()
		# Manually trigger the finished signal
		_on_music_finished()
	else:
		print("  No music currently playing")

# Debug function to get detailed status
func debug_queue_status():
	"""Print detailed queue status for debugging"""
	print("🎵 Queue Debug Status:")
	print("  Queue active: ", queue_active)
	print("  Auto advance: ", auto_advance)
	print("  Queue size: ", music_queue.size())
	print("  Current index: ", current_track_index)
	print("  Music player playing: ", music_player.playing)
	print("  Music player stream: ", music_player.stream)
	if music_player.stream:
		print("  Stream resource path: ", music_player.stream.resource_path)
		if music_player.stream is AudioStreamOggVorbis:
			print("  Stream loop setting: ", music_player.stream.loop)

func stop_music():
	if music_player.playing:
		music_player.stop()

func pause_music():
	if music_player.playing:
		music_player.stream_paused = true

func resume_music():
	if music_player.stream_paused:
		music_player.stream_paused = false

#Adjust bus volume in decibels
func set_bus_volume(bus_name: String, volume: float):
	if bus_name in buses:
		var bus_index = buses[bus_name]
		if bus_index != -1:
			# Set the volume for the bus
			AudioServer.set_bus_volume_db(bus_index, volume)
			print("Set ", bus_name, " bus volume to ", volume, "dB")
			
			# Store the volume for later reference
			if bus_name == "Music":
				original_music_volume = volume
			elif bus_name == "SFX":
				original_sfx_volume = volume
		else:
			push_error("Bus not found: " + bus_name)
	else:
		push_error("Bus name not recognized: " + bus_name)

# Ensure music volume stays consistent
func maintain_music_volume():
	set_bus_volume("Music", original_music_volume)

# Set independent volume levels for each bus
func set_music_volume(volume: float):
	set_bus_volume("Music", volume)

func set_sfx_volume(volume: float):
	set_bus_volume("SFX", volume)

# Set master volume using percentage (0-100)
func set_master_volume_percentage(percentage: float):
	# Convert percentage (0-100) to linear (0.0-1.0)
	var volume_linear = clamp(percentage, 0.0, 100.0) / 100.0
	
	# Convert linear to decibels
	var volume_db = linear_to_db(volume_linear) if volume_linear > 0.0 else -80.0
	
	# Clamp to reasonable range (-80 dB to 0 dB)
	volume_db = clamp(volume_db, -80.0, 0.0)
	
	# Set master bus volume
	var master_bus_index = AudioServer.get_bus_index("Master")
	AudioServer.set_bus_volume_db(master_bus_index, volume_db)
	
	print("AudioManager: Set master volume to ", percentage, "% (", volume_db, " dB)")

# Get master volume as percentage (0-100)
func get_master_volume_percentage() -> float:
	var master_bus_index = AudioServer.get_bus_index("Master")
	var current_db = AudioServer.get_bus_volume_db(master_bus_index)
	var current_linear = db_to_linear(current_db)
	return current_linear * 100.0

# Completely isolate music and SFX volumes
func isolate_audio_buses():
	# Reset both buses to their original volumes to ensure no interference
	AudioServer.set_bus_volume_db(buses["Music"], original_music_volume)
	AudioServer.set_bus_volume_db(buses["SFX"], original_sfx_volume)
	print("Audio buses isolated - Music: ", original_music_volume, "dB, SFX: ", original_sfx_volume, "dB")
		
func set_bus_mute(bus_name: String, mute: bool):
	if bus_name in buses:
		AudioServer.set_bus_mute(buses[bus_name], mute)