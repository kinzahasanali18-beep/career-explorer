import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { clearUserStorage, migrateLegacyUserStorage } from './userStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Who is currently signed in. Kept in a ref because the sign-out path needs
  // the id *after* the session is already gone.
  const userIdRef = useRef(null);

  // Adopt a session, keeping per-user localStorage in step with it:
  // signing in migrates any pre-namespacing data onto that user, signing out
  // wipes everything belonging to the user who just left. Migration runs
  // before setUser so it completes before AppContent mounts and its useState
  // initializers read the namespaced keys.
  function applySession(session) {
    const nextUser = session?.user ?? null;
    if (nextUser) migrateLegacyUserStorage(nextUser.id);
    else if (userIdRef.current) clearUserStorage(userIdRef.current);
    userIdRef.current = nextUser?.id ?? null;
    setUser(nextUser);
  }

  useEffect(() => {
    // Restore existing session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session);
      setLoading(false);
    });

    // Catch-all for every sign-out path — including ProfilePage's direct
    // supabase.auth.signOut() on account deletion, and session expiry.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signInWithEmail(email) {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  }

  async function verifyEmailOtp(email, token) {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (error) throw error;
  }

  async function signInWithPhone(phone) {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
  }

  async function verifyOtp(phone, token) {
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    if (error) throw error;
  }

  async function signOut() {
    const signedOutId = userIdRef.current;
    const { error } = await supabase.auth.signOut();
    if (error) throw error; // still signed in — leave their data alone
    // applySession() also clears via onAuthStateChange; doing it here too
    // means the wipe doesn't depend on that event arriving. Idempotent.
    clearUserStorage(signedOutId);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, verifyEmailOtp, signInWithPhone, verifyOtp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
