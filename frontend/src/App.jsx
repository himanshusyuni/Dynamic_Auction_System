import { createBrowserRouter, Router, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import UserProfile from "./Pages/User";
import HomePage from "./Pages/Homepage";
import CreateAuctionPage from "./Pages/CreateAuction";
import ItemDetailsPage from "./Pages/ItemDetailsPage";
import Pending from "./Components/Pending";

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
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/auction/create",
      element: <CreateAuctionPage />,
    },
    {
      path: "/auction/:id",
      element: <ItemDetailsPage />,
    },
    {
      path: "/pending",
      element: <Pending />,
    },
  ]);
  return <RouterProvider router={router} />;
};
export default App;
