export default function ToastErrorsList({ errors }: { errors: string[] }) {
  return (
    <>
      {errors.map((err, i) =>
        errors.length != i + 1 ? (
          <div key={i} style={{ marginBottom: 5 }}>
            {err}
            <br />
          </div>
        ) : (
          <div key={i}>{err}</div>
        )
      )}
    </>
  );
}
