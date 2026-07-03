import { Audio } from 'expo-av';

// Sound assets — WAV files generated via raw PCM (royalty-free, no external deps)
const SOUNDS = {
  click:    require('../../assets/sounds/click.wav'),
  success:  require('../../assets/sounds/success.wav'),
  negative: require('../../assets/sounds/negative.wav'),
  ageUp:    require('../../assets/sounds/ageUp.wav'),
} as const;

type SoundKey = keyof typeof SOUNDS;

// Cache loaded Sound objects so we only load each file once
const soundCache = new Map<SoundKey, Audio.Sound>();

async function getSound(key: SoundKey): Promise<Audio.Sound | null> {
  if (soundCache.has(key)) {
    return soundCache.get(key)!;
  }
  try {
    const { sound } = await Audio.Sound.createAsync(SOUNDS[key], { shouldPlay: false });
    soundCache.set(key, sound);
    return sound;
  } catch {
    return null;
  }
}

async function play(key: SoundKey, volume = 1.0): Promise<void> {
  try {
    const sound = await getSound(key);
    if (!sound) return;
    await sound.setVolumeAsync(volume);
    await sound.replayAsync();
  } catch {
    // Silently swallow — audio should never crash the game
  }
}

export const AudioManager = {
  /** Short tap feedback for button presses */
  click: () => play('click', 0.6),

  /** Positive outcome — success chime */
  success: () => play('success', 0.7),

  /** Negative outcome — buzzer */
  negative: () => play('negative', 0.55),

  /** Aging up / neutral transition pop */
  ageUp: () => play('ageUp', 0.75),

  /** Pre-load all sounds (call once at app startup) */
  preload: async () => {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    await Promise.all((Object.keys(SOUNDS) as SoundKey[]).map(getSound));
  },

  /** Release all cached sounds (call on app unmount) */
  unloadAll: async () => {
    for (const sound of soundCache.values()) {
      await sound.unloadAsync().catch(() => {});
    }
    soundCache.clear();
  },
};
