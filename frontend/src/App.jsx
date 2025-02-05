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
      src: "/login",
      dest: <Login />,
    },
    {
      src: "/register",
      dest: <Register />,
    },
    {
      src: "/user",
      dest: <UserProfile />,
    },
    {
      src: "/",
      dest: <HomePage />,
    },
    {
      src: "/auction/create",
      dest: <CreateAuctionPage />,
    },
    {
      src: "/auction/:id",
      dest: <ItemDetailsPage />,
    },
    {
      src: "/pending",
      dest: <Pending />,
    },
  ]);
  return <RouterProvider router={router} />;
};
export default App;
