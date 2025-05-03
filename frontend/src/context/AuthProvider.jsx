import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api, { endpoints } from "../apis";

const AuthContext = createContext({
  user: null,
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState();

  const handleFetchUser = useCallback(async () => {
    try {
      const response = await api.get(endpoints.auth.me);
      setUser(response.data);
    } catch (error) {
      console.error(error);
      setUser(null);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { data } = await api.get(endpoints.auth.signout);
      // if (data.success) {
      setUser(null);
      localStorage.clear();
      // }
      return data;
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  const signIn = useCallback(
    async ({ email, password }) => {
      try {
        const { data } = await api.post(endpoints.auth.signin, {
          email,
          password,
        });
        console.log("Sign in response:", data);
        localStorage.setItem("token", data.access_token);
        if (data) {
          handleFetchUser();
          return data.data;
        }
      } catch (error) {
        console.error("Error signing in:", error);
      }
    },
    [handleFetchUser]
  );

  const signUp = useCallback(async (data) => {
    try {
      const response = await api.post(endpoints.auth.signup, data);
      if (response.data.success) {
        return response.data;
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      handleFetchUser();
    }
  }, [handleFetchUser, user]);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
