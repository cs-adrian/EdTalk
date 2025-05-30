

export default function LoadingComponent() {
    return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
        <div
            style={{
            border: "6px solid #f3f3f3",
            borderTop: "6px solid #3498db",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            animation: "spin 1s linear infinite",
            }}
        />
        <div style={{ marginTop: "20px", fontSize: "18px", color: "#555" }}>
            Please wait a moment
        </div>
        <style>
            {`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            `}
        </style>
    </div>
  );
}