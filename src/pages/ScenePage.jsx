import { useEffect } from "react";
import { SceneCanvas } from "../components/scene/SceneCanvas";
import { SceneHUD } from "../components/hud/SceneHUD";
import { useScene } from "../hooks/useScene";
import client from "../api/client";

export default function ScenePage() {
  const { objects, setObjects, setToast } = useScene();

  // Load scene on mount
  useEffect(() => {
    client
      .get("/scene/load")
      .then((response) => {
        setObjects(response.data.objects);
      })
      .catch(() => {
        setToast({ message: "Failed to load scene.", type: "error" });
      });
  }, []); 

  const handleSave = () => {
    client
      .post("/scene/save", { objects })
      .then(() => {
        setToast({ message: "Scene saved!", type: "success" });
      })
      .catch(() => {
        setToast({ message: "Save failed. Please try again.", type: "error" });
      });
  };

  return (
    <div className="relative w-screen h-screen bg-cover bg-center bg-no-repeat bg-[url('/background-image.jpeg')]">
      <SceneCanvas />
      <SceneHUD onSave={handleSave} />
    </div>
  );
}
