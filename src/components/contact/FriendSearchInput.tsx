type Props = {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    handleSearch: () => void;
    searchMessage: string;
  };
  
  const FriendSearchInput: React.FC<Props> = ({
    searchTerm,
    setSearchTerm,
    handleSearch,
    searchMessage,
  }) => {
    const styles: { [key: string]: React.CSSProperties } = {
    button: {
      width: "100px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
    },
    addButton: {
      marginLeft: "auto",
    },
    input: {
      width: "90%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      color: "white",
      backgroundColor: "transparent",
      fontSize: "16px",
      fontWeight: "bold",
    },
    confirmButton: {
      width: "100px",
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
      color: "white",
      marginLeft: "10px",
      opacity: searchTerm.trim() ? 1 : 0.5,
      pointerEvents: searchTerm.trim() ? "auto" : "none",
    }
  };
    return (
      <div style={{ padding: "10px" }}>
        <input
          type="text"
          placeholder="Buscar usuario por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={styles.input}
        />
        <button 
            className="button button-active-filter"
            style={{ ...styles.button, ...styles.addButton, ...styles.confirmButton }}
            onClick={handleSearch} 
            disabled={!searchTerm.trim()}
        >
            Buscar
        </button>
        <p className="mt-2">{searchMessage}</p>
      </div>
    );
  };
  
  export default FriendSearchInput;