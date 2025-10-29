import { useCallback, useEffect, useRef, useState } from "react";
import { useDiscordRpc } from "./use-discord-rpc";
import type { Track as RpcTrack } from "../lib/api/track.dto";

export const useTrack = (options?: { onTrackEnd?: (index?: number) => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [currentTrack, setCurrentTrack] = useState<RpcTrack | null>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState<number[]>([75]);
  const [currentTime, setCurrentTime] = useState(0);
  const [soundcloudLink, setSoundcloudLink] = useState("");

  const progressInterval = useRef<number | undefined>(undefined);

  // Discord RPC
  const {
    initDiscordRpc,
    setTrackActivity,
    clearActivity,
    disconnectDiscordRpc,
    isConnected: rpcConnected,
    loading: rpcLoading,
    error: rpcError,
  } = useDiscordRpc();

  // progress timer
  useEffect(() => {
    if (isPlaying && currentTrack) {
      progressInterval.current = window.setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / currentTrack.duration);
          if (newProgress >= 100) {
            // track finished: stop and notify owner via callback
            // reset local progress/time and pause
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
            try {
              void clearActivity();
            } catch (e) {
              // ignore
            }
            options?.onTrackEnd?.(currentIndex ?? undefined);
            return 0;
          }
          return newProgress;
        });
        setCurrentTime((prev) => prev + 1);
      }, 1000) as unknown as number;
    } else {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
        progressInterval.current = undefined;
      }
    }

    return () => {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
        progressInterval.current = undefined;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentTrack]);

  // initialize RPC on mount
  useEffect(() => {
    (async () => {
      try {
        await initDiscordRpc();
      } catch (e) {
        // ignore - hook surfaces errors
      }
    })();

    return () => {
      disconnectDiscordRpc().catch(() => {});
    };
  }, [initDiscordRpc, disconnectDiscordRpc]);

  const play = useCallback(async (track: RpcTrack, index?: number) => {
    setCurrentTrack(track);
    setCurrentIndex(typeof index === "number" ? index : null);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
    try {
      await setTrackActivity(track);
    } catch (e) {
      // ignore
    }
  }, [setTrackActivity]);

  const pause = useCallback(async () => {
    setIsPlaying(false);
    try {
      await clearActivity();
    } catch (e) {
      // ignore
    }
  }, [clearActivity]);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      await pause();
      return;
    }
    // resume current track if present
    if (currentTrack) {
      await play(currentTrack, currentIndex ?? undefined);
    }
  }, [isPlaying, pause, play, currentTrack, currentIndex]);
  return {
    // data
    isPlaying,
    currentTrack,
    currentIndex,
    progress,
    volume,
    currentTime,
    soundcloudLink,

    // rpc state
    rpcConnected,
    rpcLoading,
    rpcError,

    // actions
    setVolume,
    setSoundcloudLink,
    togglePlay,
    play,
    pause,
  } as const;
};
export default useTrack;
