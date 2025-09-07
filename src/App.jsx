import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import Home from "./pages/Home";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import Founders from "./pages/Founders";
import ShaajiScan from "./pages/ShaajiScan";
import Settings from "./pages/Settings";
import Comics from "./pages/Comics";
import ComicViewer from "./pages/ComicViewer";
import MainLayout from "./layouts/MainLayout";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Results />} />
          </Route>
          <Route path="/settings" element={<Settings />} />
          <Route path="/founders" element={<Founders />} />
          <Route path="/scan" element={<ShaajiScan />} />
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
