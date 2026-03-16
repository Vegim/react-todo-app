import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import { useProfile } from "~/hooks/useProfile";
import { Navbar } from "~/components/Navbar";
import { TodoApp } from "~/components/TodoApp";
import { ProfileModal } from "~/components/ProfileModal";

export function meta() {
  return [
    { title: "My Todos" },
    { name: "description", content: "A simple todo app." },
  ];
}

export default function Todos() {
  const { user, hydrated, logout } = useAuth();
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (hydrated && !user) {
      navigate("/");
    }
  }, [hydrated, user, navigate]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (!hydrated || !user) return null;

  return (
    <>
      <Navbar
        username={user}
        profile={profile}
        onLogout={handleLogout}
        onEditProfile={() => setShowProfileModal(true)}
      />
      <TodoApp />
      {showProfileModal && (
        <ProfileModal
          profile={profile}
          username={user}
          onSave={updateProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
}
