import React from "react";

export default function AppLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fbff, #e8f2ff)"
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          border: "4px solid rgba(0, 149, 221, 0.2)",
          borderTopColor: "#0095dd",
          animation: "spin 0.9s linear infinite"
        }}
      />
      <style>
        {`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}
      </style>
    </div>
  );
}
