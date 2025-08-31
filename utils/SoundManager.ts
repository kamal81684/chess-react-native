import { Audio } from 'expo-av';

// Define the Sound type
type Sound = {
  sound: Audio.Sound;
  status: any; // Audio playback status
};

// Cache for loaded sounds
const soundCache: Record<string, Sound | null> = {};

// List of sound files with fallback implementation
const SOUNDS = {
  // Basic moves
  MOVE: require('../assets/sounds/move-self.mp3'),
  CAPTURE: require('../assets/sounds/capture.mp3'),
  CHECK: require('../assets/sounds/move-check.mp3'),
  
  // Additional sounds
  OPPONENT_MOVE: require('../assets/sounds/move-opponent.mp3'),
  CASTLE: require('../assets/sounds/castle.mp3'),
  PROMOTE: require('../assets/sounds/promote.mp3'),
  ILLEGAL: require('../assets/sounds/illegal.mp3'),
  GAME_START: require('../assets/sounds/game-start.mp3'),
  GAME_END: require('../assets/sounds/game-end.mp3'),
  PREMOVE: require('../assets/sounds/premove.mp3'),
  TEN_SECONDS: require('../assets/sounds/tenseconds.mp3'),
  NOTIFY: require('../assets/sounds/notify.mp3'),
};

/**
 * Loads a sound file into memory
 * @param soundFile - The sound file to load
 * @returns Promise resolving to a Sound object
 */
export const loadSound = async (soundFile: any): Promise<Sound | null> => {
  try {
    const { sound, status } = await Audio.Sound.createAsync(soundFile, { shouldPlay: false });
    return { sound, status };
  } catch (error) {
    console.log('Error loading sound, will continue without sound:', error);
    return null;
  }
};

/**
 * Plays a sound from the cache or loads it first if not cached
 * @param soundKey - The key of the sound to play from SOUNDS object
 */
export const playSound = async (soundKey: keyof typeof SOUNDS): Promise<void> => {
  try {
    // Try to get from cache first
    let sound = soundCache[soundKey];
    
    // If not in cache, load and cache it
    if (!sound) {
      sound = await loadSound(SOUNDS[soundKey]);
      soundCache[soundKey] = sound;
    }
    
    // Play the sound if it was loaded successfully
    if (sound) {
      // Reset the position before playing
      await sound.sound.setPositionAsync(0);
      await sound.sound.playAsync();
    }
  } catch (error) {
    console.log('Error playing sound:', error);
    // Just continue without sound if there's an error
  }
};

/**
 * Plays the appropriate chess move sound
 * @param move - The chess.js move object
 * @param isOpponent - Whether the move was made by the opponent (robot)
 */
export const playChessMoveSound = async (move: any, isOpponent: boolean = false): Promise<void> => {
  if (!move) return;
  
  try {
    // Castle move (king-side or queen-side)
    if (move.flags && move.flags.includes('k') || move.flags.includes('q')) {
      await playSound('CASTLE');
    }
    // Capture move
    else if (move.flags && move.flags.includes('c')) {
      await playSound('CAPTURE');
    }
    // Promotion move
    else if (move.flags && move.flags.includes('p')) {
      await playSound('PROMOTE');
    }
    // Check or checkmate move
    else if (move.san && (move.san.includes('+') || move.san.includes('#'))) {
      await playSound('CHECK');
    }
    // Regular move - different sound for opponent
    else {
      if (isOpponent) {
        await playSound('OPPONENT_MOVE');
      } else {
        await playSound('MOVE');
      }
    }
  } catch (error) {
    console.log('Error playing chess move sound:', error);
    // Just continue without sound if there's an error
  }
};

/**
 * Unloads all sounds from memory
 */
export const unloadAllSounds = async (): Promise<void> => {
  try {
    for (const key in soundCache) {
      const sound = soundCache[key];
      if (sound) {
        await sound.sound.unloadAsync();
      }
    }
    
    // Clear the cache
    Object.keys(soundCache).forEach(key => {
      soundCache[key] = null;
    });
  } catch (error) {
    console.log('Error unloading sounds:', error);
  }
};

/**
 * Plays the sound for an illegal move
 */
export const playIllegalMoveSound = async (): Promise<void> => {
  await playSound('ILLEGAL');
};

/**
 * Plays the game start sound
 */
export const playGameStartSound = async (): Promise<void> => {
  await playSound('GAME_START');
};

/**
 * Plays the game end sound
 */
export const playGameEndSound = async (): Promise<void> => {
  await playSound('GAME_END');
};

/**
 * Plays the notification sound
 */
export const playNotificationSound = async (): Promise<void> => {
  await playSound('NOTIFY');
};
