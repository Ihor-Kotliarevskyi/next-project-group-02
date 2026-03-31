"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        minHeight: "50vh",
      }}
    >
      <h1>Щось пішло не так!</h1>
      <p>Виникла непередбачена помилка. Спробуйте ще раз.</p>
      <button
        onClick={reset}
        style={{
          padding: "8px 16px",
          cursor: "pointer",
          borderRadius: "4px",
          border: "1px solid #ccc",
          background: "#fff",
        }}
      >
        Спробувати ще раз
      </button>
    </main>
  );
}
