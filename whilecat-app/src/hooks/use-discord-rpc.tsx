import { useState, useEffect, useCallback } from 'react';
import { invoke } from "@tauri-apps/api/core";
import type { Track, RpcResponse } from '../lib/api/track.dto';

export const useDiscordRpc = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Инициализация Discord RPC
  const initDiscordRpc = useCallback(async (): Promise<RpcResponse> => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<RpcResponse>("init_discord_rpc");
      setIsConnected(true);
      setLoading(false);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setLoading(false);
      throw err;
    }
  }, []);

  // Установка активности трека
  const setTrackActivity = useCallback(async (track: Track): Promise<RpcResponse> => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<RpcResponse>("set_track_activity", { track });
      setLoading(false);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setLoading(false);
      throw err;
    }
  }, []);

  // Очистка активности
  const clearActivity = useCallback(async (): Promise<RpcResponse> => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<RpcResponse>("clear_activity");
      setLoading(false);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setLoading(false);
      throw err;
    }
  }, []);

  // Отключение Discord RPC
  const disconnectDiscordRpc = useCallback(async (): Promise<RpcResponse> => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<RpcResponse>("disconnect_discord_rpc");
      setIsConnected(false);
      setLoading(false);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    // Состояние
    isConnected,
    loading,
    error,
    
    // Методы
    initDiscordRpc,
    setTrackActivity,
    clearActivity,
    disconnectDiscordRpc,
    
    // Утилиты
    resetError: () => setError(null)
  };
};