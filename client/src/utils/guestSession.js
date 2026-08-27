export const getOrCreateGuestSessionId = () => {
  let sessionId = localStorage.getItem("guest_session_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();

    localStorage.setItem("guest_session_id", sessionId);
  }

  return sessionId;
};

export const clearGuestSessionId = () => {
  localStorage.removeItem("guest_session_id");
};
