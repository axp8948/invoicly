import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../appwrite/auth';

export default function RequireAuth({ children }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    authService.getCurrentUser()
      .then(user => {
        if (user && user.$id) setAuthed(true);
      })
      .catch(() => {
        // no session
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center p-6">Checking authentication…</div>;
  }

  if (!authed) {
    // remember where they were trying to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
