
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import WiiMenu from "./WiiMenu";
import Portfolio from "./Portfolio";
import About from "./About";
import CuillereBot from "./CuillereBot";
import PokemonTypes from "./PokemonTypes";
import MemoryGame from "./MemoryGame";
import GestionLayout from "./GestionLayout";
import ReactCourse from "./ReactCourse";
import DemonSlayerApp from "./demon-slayer";
import InazumaDraft from "./InazumaDraft";
import ImageToLink from "./ImageToLink";
import CarsRacing from "./CarsRacing";

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
    <Routes>
      <Route path="/menu" element={<WiiMenu />} />
      <Route path="/" element={<Portfolio />} />
      <Route path="/about" element={<About />} />
      <Route path="/cuillere" element={<CuillereBot />} />
      <Route path="/pokemon-types" element={<PokemonTypes />} />
      <Route path="/memory-game" element={<MemoryGame />} />
      <Route path="/app-de-gestion/*" element={<GestionLayout />} />
      <Route path="/react-course" element={<ReactCourse />} />
      <Route path="/demon-slayer" element={<DemonSlayerApp />} />
      <Route path="/inazuma-draft" element={<InazumaDraft />} />
      <Route path="/image-to-link" element={<ImageToLink />} />
      <Route path="/cars-racing" element={<CarsRacing />} />
    </Routes>
  );
}
