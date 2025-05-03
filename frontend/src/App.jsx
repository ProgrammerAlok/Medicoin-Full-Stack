import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Model from "./screens/Model";
import Signin from "./screens/Signin";
import Signup from "./screens/Signup";
import AuthProvider from "./context/AuthProvider";
import GuestRoutes from "./routes/GuestRoutes";
import MainLayout from "./layout/MainLayout";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/m",
        element: <Model />,
      },
      {
        path: "/profile",
        element: <div>Profile Page</div>,
      },
      {
        path: "/appointments",
        element: <div>Appointments Page</div>,
      },
      {
        path: "/patients",
        element: <div>Patients Page</div>,
      },
      {
        path: "/settings",
        element: <div>Settings Page</div>,
      },
    ],
  },
  {
    path: "/",
    element: (
      <GuestRoutes>
        <Outlet />
      </GuestRoutes>
    ),
    children: [
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signin />,
      },
    ],
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
