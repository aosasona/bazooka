export default function Loading() {
  return (
    <div className="flex justify-center items-center">
      <div
        className="spinner-border animate-spin inline-block w-6 h-6 border-2 border-t-transparent rounded-full"
        role="status"
      />
    </div>
  );
}
