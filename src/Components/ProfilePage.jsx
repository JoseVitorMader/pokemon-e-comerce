import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchUserProfile, saveUserProfile } from "../firebase";
import { useToast } from "../context/ToastContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ displayName: "", email: "" });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) {
        setProfile({ displayName: "", email: "" });
        setLoading(false);
        return;
      }
      const data = await fetchUserProfile(user.uid);
      if (mounted) {
        setProfile({ displayName: data?.displayName || user.displayName || "", email: data?.email || user.email || "" });
        setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return alert("Faça login para salvar o perfil");
    await saveUserProfile(user.uid, profile);
    showToast("Perfil salvo com sucesso", { type: 'success' });
  }

  if (loading) return <div>Carregando perfil...</div>;

  return (
    <div className="profile-page">
      <h2>Perfil</h2>
      {user ? (
        <form className="profile-form" onSubmit={handleSave}>
          <div>
            <label>Nome</label>
            <input value={profile.displayName} onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} />
          </div>
          <div>
            <label>Email</label>
            <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          </div>
          <div>
            <button className="btn" type="submit">Salvar perfil</button>
          </div>
        </form>
      ) : (
        <div>Faça login para ver seu perfil.</div>
      )}
    </div>
  );
}
