import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SheetPage from "./pages/sheetPage.jsx";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider>
      <SheetPage />
    </ThemeProvider>
  );
}

export default App;
