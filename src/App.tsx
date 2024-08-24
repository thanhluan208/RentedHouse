import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import Home from "./Pages/Home";
import DefaultLayout from "./Components/DefaultLayout";
import { Paths } from "./Constants/routes";
import HouseDetail from "./Pages/HouseDetail";
import GuestDetail from "./Pages/GuestDetail";
import Bill from "./Pages/Bill";
import { useAuth } from "./Providers/AuthenticationProvider";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import GuestList from "./Pages/Guest";

function App() {
  //! State
  const { isLogged } = useAuth();
  const router = createBrowserRouter([
    {
      element: <DefaultLayout />,
      children: [
        {
          path: "*",
          element: <Home />,
        },
        {
          path: `${Paths.house}/:id`,
          element: <HouseDetail />,
        },

        {
          path: `${Paths.guest}/:guestId`,
          element: <GuestDetail />,
        },
        {
          path: Paths.bill,
          element: <Bill />,
        },
        {
          path: Paths.guest,
          element: <GuestList />,
        },
      ],
      loader: () => {
        if (!isLogged) {
          return redirect(Paths.login);
        }
        return null;
      },
    },
    {
      path: Paths.login,
      element: <Login />,
      loader: () => {
        if (isLogged) {
          return redirect(Paths.house);
        }
        return null;
      },
    },
    {
      path: Paths.register,
      element: <Register />,
      loader: () => {
        if (isLogged) {
          return redirect(Paths.house);
        }
        return null;
      },
    },
  ]);

  //! Function

  //! Render
  return <RouterProvider router={router} />;
}

export default App;
