// types/track.dto.ts
export type RpcResponse = {
  success: boolean;
  message: string;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  desc: string;
  artwork_url: string;
  share_url: string;
  duration: number;
};

export type PlaybackState = {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
};

export interface CreateTrackDto {
    url: string;
    social: string;
}