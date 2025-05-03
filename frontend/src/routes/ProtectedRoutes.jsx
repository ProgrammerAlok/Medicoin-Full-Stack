import { useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export default function ProtectedRoutes({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/signin", { replace: true });
    }
  }, [user, navigate]);

  if (user === undefined || user === null) {
    return <Loading />;
  }

  return children;
}
