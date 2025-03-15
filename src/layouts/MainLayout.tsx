import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { syncAllData } from "@/context/store";
import { RootState, AppDispatch } from "@/context/store";

import logo from "/buzzsnap-recorte.png";
import sv from "/SCrbnll.png";

import "bootstrap-icons/font/bootstrap-icons.css";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const POLL_INTERVAL = 300000; // 5 minutos en milisegundos
  const dispatch = useDispatch<AppDispatch>();

  // Usamos `groupMembers` para acceder a los grupos
  const groupMembers = useSelector((state: RootState) => state.app.groupMembers);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      console.log("🔄 Ejecutando dispatch(syncAllData())...");
      dispatch(syncAllData());

      intervalRef.current = setInterval(() => {
        console.log("⏳ Sincronización periódica...");
        dispatch(syncAllData());
      }, POLL_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        console.log("🛑 Deteniendo sincronización.");
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch]);

  return (
    <div className="d-flex vh-100">
      <aside
        style={{
          backgroundColor: "#8A8A8A",
          width: "90px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
          padding: "10px",
        }}
      >
        <p style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}>
          BuzzSnap
        </p>
        <img
          src={logo}
          alt="Buzzsnap Logo"
          style={{ width: "50px", borderRadius: "25%", cursor: "pointer" }}
        />

        <hr
          style={{ width: "50%", border: "1px solid white", margin: "10px 0" }}
        />

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            width: "100%",
            marginBottom: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {groupMembers.length > 0 ? (
            groupMembers.map((groupMember) => (
              <img
                key={groupMember.id}  // Usamos `groupMember.id` en lugar de `group.id`
                src={groupMember.group?.image_url || sv}  // Aseguramos que accedemos al `group` correctamente
                alt={groupMember.group?.name}  // Aseguramos que accedemos al `group` correctamente
                style={{
                  width: "50px",
                  borderRadius: "25%",
                  cursor: "pointer",
                }}
                className="mb-2"
                onClick={() =>
                  alert(
                    `¡Grupo ${groupMember.group?.id} con nombre ${groupMember.group?.name} presionado!`
                  )
                }
              />
            ))
          ) : (
            <p>No hay grupos disponibles</p>
          )}
          <button
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#000000",
              borderRadius: "25%",
              width: "50px",
              height: "50px",
              cursor: "pointer",
            }}
            onClick={() => alert("¡Botón presionado!")}
            className="mb-2"
          >
            <i className="bi bi-plus" style={{ fontSize: "30px" }}></i>
          </button>
        </div>

        <img
          onClick={() => alert("¡Perfil presionado!")}
          src={sv}
          alt="Perfil"
          style={{
            width: "50px",
            height: "50px",
            cursor: "pointer",
            border: "2px solid white",
            borderRadius: "50%",
            marginTop: "auto",
          }}
        />
      </aside>

      <div style={{ flex: 1, padding: "20px" }}>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
