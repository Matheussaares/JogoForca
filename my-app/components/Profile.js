export function Profile() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: "320px",
        margin: "0 auto",
      }}
    >
      <img
        src="/minha-foto.jpg"
        alt="Foto de Matheus Soares Lima"
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: "15px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      />
      <h2 style={{ margin: "0", fontSize: "1.5rem", color: "#333" }}>
        Matheus Soares Lima
      </h2>
      <p
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontSize: "16px",
          lineHeight: "1.5",
          color: "#555",
        }}
      >
        Estudante de Sistemas para Internet em transição de carreira. Formado em
        Administração e apaixonado por filmes, séries, animes e música.
      </p>
    </div>
  );
}