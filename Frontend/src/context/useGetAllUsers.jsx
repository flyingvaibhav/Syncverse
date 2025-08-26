import { useEffect, useState } from "react";
import axios from "axios";

export default function useGetAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await axios.get("/api/user/allusers", {
          withCredentials: true,
        });
        if (!ignore) setUsers(res.data || []);
      } catch (e) {
        console.error("allusers error:", e.response?.data || e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  return { users, loading };
}