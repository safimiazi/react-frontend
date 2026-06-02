import { useContext } from 'react';
import { SceneContext } from '../contexts/SceneContext';

export function useScene() {
  return useContext(SceneContext);
}
