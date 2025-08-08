import { NavLink, useLocation } from "react-router-dom";

const TabItem = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <NavLink
      to={to}
      className={
        "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-colors " +
        (active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground")
      }
    >
      <span className="text-base leading-none">
        {label === "Home" ? "🏠" : label === "Chat" ? "💬" : "•"}
      </span>
      <span>{label}</span>
    </NavLink>
  );
};

export default function BottomTabBar() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-3xl">
        <div className="grid grid-cols-2 gap-2 p-2">
          <TabItem to="/" label="Home" />
          <TabItem to="/chat" label="Chat" />
        </div>
      </div>
    </nav>
  );
}
