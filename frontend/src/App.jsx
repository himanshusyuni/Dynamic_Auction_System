import { createBrowserRouter, Router, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import UserProfile from "./Pages/User";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/user",
      element: <UserProfile />,
    },
  ]);
  return <RouterProvider router={router} />;
};
export default App;
