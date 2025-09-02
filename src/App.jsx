import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import Home from "./pages/Home";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import Founders from "./pages/Founders";
import ShaajiScan from "./pages/ShaajiScan";
import Kaineetam from "./pages/Kaineetam";
import Settings from "./pages/Settings";
import Supporters from "./pages/Supporters";
import Comics from "./pages/Comics";
import ComicViewer from "./pages/ComicViewer";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Results />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/founders" element={<Founders />} />
          <Route path="/scan" element={<ShaajiScan />} />
          <Route path="/kaineetam" element={<Kaineetam />} />
          <Route path="/supporters" element={<Supporters />} />
          <Route path="/comics" element={<Comics />} />
          <Route path="/comics/:slug" element={<ComicViewer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
export default App;
