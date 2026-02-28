import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import { Navbar } from "~/components/Navbar";
import { TodoApp } from "~/components/TodoApp";

export function meta() {
  return [
    { title: "My Todos" },
    { name: "description", content: "A simple todo app." },
  ];
}

export default function Todos() {
  const { user, hydrated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !user) {
      navigate("/");
    }
  }, [hydrated, user, navigate]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  // Don't render until we know auth state (avoids flash of content)
  if (!hydrated || !user) return null;

  return (
    <>
      <Navbar username={user} onLogout={handleLogout} />
      <TodoApp />
    </>
  );
}
