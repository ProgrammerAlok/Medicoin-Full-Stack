import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Model from "./screens/Model";
import Signin from "./screens/Signin";
import Signup from "./screens/Signup";
import AuthProvider from "./context/AuthProvider";
import GuestRoutes from "./routes/GuestRoutes";
import MainLayout from "./layout/MainLayout";
import Landing from "./screens/Landing"; // new landing page
import History from "./screens/History";
import Settings from "./screens/Settings";
import Models from "./screens/Models";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-5xl font-bold mb-4">404 Not Found</h1>
      <p className="text-lg mb-8">The page you are looking for does not exist.</p>
      <a
        href="/"
        className="px-6 py-3 rounded-xl bg-white text-black font-bold shadow hover:bg-black hover:text-white border border-white transition-all duration-300"
      >
        Go Home
      </a>
    </div>
  );
}

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Landing />, // Show landing page at root
  },
  {
    path: "/signin",
    element: (
      <GuestRoutes>
        <Signin />
      </GuestRoutes>
    ),
  },
  {
    path: "/signup",
    element: (
      <GuestRoutes>
        <Signup />
      </GuestRoutes>
    ),
  },
  {
    path: "/app",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "m",
        element: <Model />,
      },
      {
        path: "models",
        element: <Models />,
      },
      {
        path: "profile",
        element: <div>Profile Page</div>,
      },
      {
        path: "appointments",
        element: <div>Appointments Page</div>,
      },
      {
        path: "patients",
        element: <div>Patients Page</div>,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "history",
        element: <History />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
};

export default App;
