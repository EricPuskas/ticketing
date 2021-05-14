import Link from "next/link";

export default ({ currentUser }) => {
  const links = [
    !currentUser && {
      label: "Sign up",
      href: "/auth/register",
    },
    !currentUser && {
      label: "Sign in",
      href: "/auth/login",
    },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && {
      label: "Sign out",
      href: "/auth/logout",
    },
  ]
    .filter((linkConfig) => linkConfig)
    .map((link) => {
      return (
        <li className="nav-item" key={link.href}>
          <Link href={link.href}>
            <a className="nav-link">{link.label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};
