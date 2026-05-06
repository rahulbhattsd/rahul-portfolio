import { create } from 'zustand'

/**
 * Central UI scene store for the Interstellar portfolio experience.
 * Tracks which DOM overlay is open and which 3D object the camera should frame.
 */
const useSceneStore = create((set) => ({
  activePanel: null,
  cameraTarget: null,
  setActivePanel: (activePanel) => set({ activePanel }),
  setCameraTarget: (cameraTarget) => set({ cameraTarget }),
  closePanels: () => set({ activePanel: null, cameraTarget: null }),
}))

export default useSceneStore
