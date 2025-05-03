import { useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export default function GuestRoutes({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null && user !== undefined) {
      navigate("/m", { replace: true });
    }
  }, [user, navigate]);

  if (user === undefined) {
    return <Loading />;
  }

  return children;
}
