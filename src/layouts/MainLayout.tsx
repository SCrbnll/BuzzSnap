import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { syncAllData } from "@/context/store";
import { RootState, AppDispatch } from "@/context/store";

import logo from "/buzzsnap-recorte.png";
import sv from "/SCrbnll.png";

import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const POLL_INTERVAL = 60000; // 5 minutos en milisegundos
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();  

  const groupMembers = useSelector((state: RootState) => state.app.groupMembers);
  const [userInfo, setUserInfo] = useState<any>(); 

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } else {
      setUserInfo(JSON.parse(user));
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

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: "flex",
      height: "100vh",
    },
    aside: {
      width: "90px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "100vh",
      padding: "10px",
    },
    title: {
      fontSize: "12px",
      fontWeight: "bold",
      marginBottom: "5px",
    },
    logo: {
      width: "50px",
      borderRadius: "25%",
      cursor: "pointer",
    },
    hr: {
      width: "50%",
      border: "1px solid white",
      margin: "10px 0",
    },
    groupContainer: {
      flex: 1,
      overflowY: "auto",
      width: "100%",
      marginBottom: "10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    groupImage: {
      width: "50px",
      borderRadius: "25%",
      cursor: "pointer",
    },
    button: {
      borderRadius: "25%",
      width: "50px",
      height: "50px",
      cursor: "pointer",
    },
    plusIcon: {
      fontSize: "30px",
    },
    profileImage: {
      width: "50px",
      height: "50px",
      cursor: "pointer",
      border: "2px solid white",
      borderRadius: "50%",
      marginTop: "auto",
    },
    mainContent: {
      flex: 1,
      padding: "20px",
    },
  };

  return (
    <div style={styles.container}>
      <aside style={styles.aside} className="aside-layout">
        <p style={styles.title}>BuzzSnap</p>
        <img src={logo} alt="Buzzsnap Logo" style={styles.logo} onClick={() => navigate("/home")}/>

        <hr style={styles.hr} />

        <div style={styles.groupContainer}>
          {groupMembers.length > 0 ? (
            groupMembers.map((groupMember) => (
              <img
                key={groupMember.id}
                src={groupMember.group?.image_url || sv}
                alt={groupMember.group?.name}
                style={styles.groupImage}
                className="mb-2"
                onClick={() =>
                  navigate(`/groups/${groupMember.group?.id}`)
                }
              />
            ))
          ) : (
            <> </>
          )}
          <button
            style={styles.button}
            className="aside-button mb-2"
            onClick={() => alert("¡Botón presionado!")}
          >
            <i className="bi bi-plus" style={styles.plusIcon}></i>
          </button>
        </div>

        {userInfo && userInfo.avatarUrl ? (
          <img
            onClick={() => alert("¡Perfil presionado!")}
            src={userInfo.avatarUrl}
            alt="Perfil"
            style={styles.profileImage}
          />
        ) : (
          <></>
        )}
      </aside>

      <div style={styles.mainContent}>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
