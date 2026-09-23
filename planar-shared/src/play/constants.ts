/**
 * Walk-grid cell: wall / blocked.
 */
export const UNPASSABLE_WALK = 0;

/**
 * Walk-grid cell: floor.
 */
export const PASSABLE_WALK = 1;

/**
 * Server simulation clock.
 */
export const TICK_HZ = 30;

/**
 * Boot this ARE if not provided with actual value
 */
export const DEFAULT_ARE = 'ar0202.are';

/**
 * Reserved player envelope id.
 */
export const PLAYER_ACTOR_ID = 1;

/**
 * Player CRE on loadArea. NPCs come from ARE.actors, not this id.
 */
export const DEFAULT_PLAYER_CRE = 'nameless';

/**
 * Px/tick when GhostIniAnimation is missing. Also when speed is less than this value, it it 'walk' animation, 'run' otherwise.
 */
export const DEFAULT_SPEED_PX_PER_TICK = 16;

/**
 * Occupancy radius (cells) when GhostIniAnimation is missing.
 */
export const DEFAULT_PERSONAL_SPACE = 1;

/**
 * Clamp for occupancy paint so a huge INI radius cannot fill the map.
 */
export const MAX_PERSONAL_SPACE = 8;
