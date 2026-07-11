import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function NotificationBell({ className = "" }) {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";

  const loadNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      const authToken = token || localStorage.getItem("auth_token");
      const res = await fetch(`${BASEURL}/api/notifications/`, {
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : undefined,
        },
        credentials: "include",
      });

      if (!res.ok) return;
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, [BASEURL, user, token]);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open && user) {
            void loadNotifications();
          }
        }}
        className="relative rounded-full p-2 text-white transition-colors hover:text-gray-300"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Notifications</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>

          {!user ? (
            <p className="text-sm text-gray-600">Sign in to see alerts.</p>
          ) : loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No new notifications right now.</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((item) => (
                <li key={item.id} className="rounded-lg bg-gray-50 p-2">
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
