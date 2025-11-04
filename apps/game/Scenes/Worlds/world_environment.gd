extends WorldEnvironment

# Animation settings
@export var animate_sky: bool = true
@export var animate_lighting: bool = true
@export var animate_fog: bool = true

# Sky animation
@export var sky_rotation_speed: float = 0.1
@export var cloud_movement_speed: float = 0.05

# Lighting animation  
@export var light_cycle_duration: float = 60.0  # seconds for full day/night cycle
@export var light_intensity_range: Vector2 = Vector2(0.2, 1.0)
@export var ambient_color_day: Color = Color(0.8, 0.9, 1.0)
@export var ambient_color_night: Color = Color(0.2, 0.3, 0.6)

# Fog animation
@export var fog_density_range: Vector2 = Vector2(0.001, 0.01)
@export var fog_wave_speed: float = 0.5

# Internal variables
var time_elapsed: float = 0.0
var original_sky_rotation: Vector3
var original_fog_density: float

func _ready() -> void:
	setup_environment()
	store_original_values()

func _process(delta: float) -> void:
	time_elapsed += delta
	
	if animate_sky:
		animate_sky_rotation(delta)
	
	if animate_lighting:
		animate_day_night_cycle(delta)
	
	if animate_fog:
		animate_fog_effects(delta)

func setup_environment() -> void:
	# Ensure we have an environment resource
	if not environment:
		environment = Environment.new()
	
	# Set up basic sky if not already configured
	if not environment.sky:
		var sky = Sky.new()
		var sky_material = ProceduralSkyMaterial.new()
		sky.sky_material = sky_material
		environment.sky = sky
		environment.bg_mode = Environment.BG_SKY

func store_original_values() -> void:
	# Store original values to animate relative to them
	if environment and environment.sky and environment.sky.sky_material:
		var sky_mat = environment.sky.sky_material as ProceduralSkyMaterial
		if sky_mat:
			original_sky_rotation = Vector3.ZERO  # Default rotation
	
	if environment.fog_enabled:
		original_fog_density = environment.fog_aerial_perspective

func animate_sky_rotation(delta: float) -> void:
	if not environment or not environment.sky or not environment.sky.sky_material:
		return
		
	var sky_mat = environment.sky.sky_material as ProceduralSkyMaterial
	if sky_mat:
		# Rotate the sky slowly over time
		sky_mat.sky_top_color = sky_mat.sky_top_color
		# Note: ProceduralSkyMaterial doesn't have direct rotation,
		# but we can animate colors to simulate movement
		animate_sky_colors(sky_mat, delta)

func animate_sky_colors(sky_mat: ProceduralSkyMaterial, _delta: float) -> void:
	# Create a subtle color shift to simulate sky movement
	var color_shift = sin(time_elapsed * cloud_movement_speed) * 0.1
	var base_top = Color(0.4, 0.6, 1.0)
	var base_horizon = Color(0.9, 0.9, 1.0)
	
	sky_mat.sky_top_color = base_top + Color(color_shift, color_shift * 0.5, 0)
	sky_mat.sky_horizon_color = base_horizon + Color(color_shift * 0.5, color_shift * 0.3, color_shift * 0.1)

func animate_day_night_cycle(_delta: float) -> void:
	if not environment:
		return
	
	# Calculate cycle progress (0 to 1)
	var cycle_progress = fmod(time_elapsed / light_cycle_duration, 1.0)
	var light_factor = (sin(cycle_progress * TAU - PI/2) + 1.0) / 2.0
	
	# Animate ambient light
	var current_intensity = lerp(light_intensity_range.x, light_intensity_range.y, light_factor)
	environment.ambient_light_energy = current_intensity
	
	# Animate ambient color
	var current_color = ambient_color_night.lerp(ambient_color_day, light_factor)
	environment.ambient_light_color = current_color
	
	# Animate sky energy
	if environment.sky:
		environment.sky_custom_fov = 75.0 + sin(cycle_progress * TAU) * 5.0

func animate_fog_effects(_delta: float) -> void:
	if not environment:
		return
	
	# Enable fog if not already enabled
	if not environment.fog_enabled:
		environment.fog_enabled = true
		environment.fog_light_color = Color(0.8, 0.9, 1.0)
		environment.fog_light_energy = 0.5
	
	# Animate fog density with sine wave
	var fog_wave = sin(time_elapsed * fog_wave_speed)
	var fog_density = lerp(fog_density_range.x, fog_density_range.y, (fog_wave + 1.0) / 2.0)
	environment.fog_aerial_perspective = fog_density
	
	# Subtle fog color shift
	var fog_tint = sin(time_elapsed * 0.3) * 0.1
	environment.fog_light_color = Color(0.8 + fog_tint, 0.9, 1.0 - fog_tint * 0.5)

# Public functions for external control
func set_time_of_day(time_factor: float) -> void:
	"""Set time of day manually (0 = midnight, 0.5 = noon, 1 = midnight)"""
	time_elapsed = time_factor * light_cycle_duration

func get_current_time_factor() -> float:
	"""Get current time as factor (0-1)"""
	return fmod(time_elapsed / light_cycle_duration, 1.0)

func toggle_animation(enable: bool) -> void:
	"""Enable/disable all animations"""
	animate_sky = enable
	animate_lighting = enable
	animate_fog = enable

func set_weather_intensity(intensity: float) -> void:
	"""Set weather intensity (0 = calm, 1 = stormy)"""
	fog_density_range.y = lerp(0.01, 0.05, intensity)
	cloud_movement_speed = lerp(0.05, 0.2, intensity)
