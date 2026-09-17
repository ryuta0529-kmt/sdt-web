import { create } from 'zustand'
import { DURATION } from './data'

type ReplayState = {
  currentTime: number; playing: boolean; speed: number
  setTime: (time: number) => void; toggle: () => void; setPlaying: (playing: boolean) => void; setSpeed: (speed: number) => void
}

export const useReplayStore = create<ReplayState>((set) => ({
  currentTime: 0, playing: false, speed: 1,
  setTime: (currentTime) => set({ currentTime: Math.max(0, Math.min(DURATION, currentTime)) }),
  toggle: () => set((state) => ({ playing: !state.playing })), setPlaying: (playing) => set({ playing }), setSpeed: (speed) => set({ speed }),
}))
