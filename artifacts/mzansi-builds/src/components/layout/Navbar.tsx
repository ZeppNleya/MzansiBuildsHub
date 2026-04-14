import { Link, useLocation } from "wouter";
import { useUser, useClerk, Show } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const navLinks = [
  { href: "/feed", label: "Feed" },
  { href: "/celebration", label: "Celebration Wall" },
];

const authLinks = [
  { href: "/project/new", label: "Add Project" },
  { href: "/my-projects", label: "My Projects" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

  const isActive = (href: string) => location === href;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-[#1A1A1A] text-white shadow-md">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
              MzansiBuilds
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Show when="signed-in">
              <div className="hidden md:flex items-center gap-1">
                {authLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-primary text-white"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="ml-2 px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                {(user?.firstName?.[0] || user?.username?.[0] || "U").toUpperCase()}
              </div>
            </Show>
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Join Now
              </Link>
            </Show>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t border-white/10 py-2 flex flex-wrap gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Show when="signed-in">
            {authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </Show>
        </div>
      </div>
    </nav>
  );
}
