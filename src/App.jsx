
import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AppLoader from "./components/AppLoader";
import GlobalBgmDock from "./components/GlobalBgmDock";

const WiiMenu = lazy(() => import("./pages/WiiMenu"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const About = lazy(() => import("./pages/About"));
const CuillereBot = lazy(() => import("./pages/CuillereBot"));
const PokemonTypes = lazy(() => import("./pages/PokemonTypes"));
const GestionLayout = lazy(() => import("./layouts/GestionLayout"));
const DemonSlayerApp = lazy(() => import("./pages/DemonSlayer"));
const InazumaDraft = lazy(() => import("./pages/InazumaDraft"));
const CarsRacing = lazy(() => import("./pages/CarsRacing"));
const YoKaiMedallium = lazy(() => import("./pages/YoKaiMedallium"));

export default function App() {
  const location = useLocation();

  // Activer le mode plein écran quand on est dans l'app de gestion
  useEffect(() => {
    const isSchoolManagement = location.pathname.startsWith("/app-de-gestion");
    document.body.classList.toggle("school-management-open", isSchoolManagement);

    return () => {
      document.body.classList.remove("school-management-open");
    };
  }, [location.pathname]);

  return (
    <Suspense fallback={<AppLoader />}>
      <>
        <Routes>
          <Route path="/menu" element={<WiiMenu />} />
          <Route path="/" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/cuillere" element={<CuillereBot />} />
          <Route path="/pokemon-types" element={<PokemonTypes />} />
          <Route path="/app-de-gestion/*" element={<GestionLayout />} />
          <Route path="/demon-slayer" element={<DemonSlayerApp />} />
          <Route path="/inazuma-draft" element={<InazumaDraft />} />
          <Route path="/cars-racing" element={<CarsRacing />} />
          <Route path="/yokai-medallium" element={<YoKaiMedallium />} />
        </Routes>
        <GlobalBgmDock />
      </>
    </Suspense>
  );
}
