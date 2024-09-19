import { bottombarLinks } from "@/constants";
import { Link, useLocation } from "react-router-dom";

export default function Bottombar() {
  const { pathname } = useLocation();
  return (
    <div className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            to={link.route}
            key={`bottombar-${link.label}`}
            className={`${isActive && "bg-primary-500"} group flex flex-col items-center gap-1 rounded-[10px] p-2 transition hover:bg-primary-500`}>
            <img
              src={link.imgURL}
              alt="image"
              width={16}
              height={16}
              className={`${isActive && "invert-white"} group-hover:invert-white`}
            />
            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </div>
  );
}
