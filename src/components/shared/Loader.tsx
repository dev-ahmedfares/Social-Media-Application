export default function Loader({ without = false }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/public/assets/icons/loader.svg"
        alt="loader"
        width={24}
        height={24}
      />
      {without ? "" : "Loading..."}
    </div>
  );
}
