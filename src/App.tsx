import { WorldModeProvider } from "./context/WorldModeProvider";
import World from "./components/world/World";

function App() {
  return (
    <WorldModeProvider>
      <World />
    </WorldModeProvider>
  );
}

export default App;
