import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import Users from "./Pages/Users";
import DefaultLayout from "./Components/DefaultLayout";
import Routes, { Paths } from "./Constants/routes";
import HouseDetail from "./Pages/HouseDetail";
import GuestDetail from "./Pages/GuestDetail";


function App() {
  //! State
  const router = createBrowserRouter([
    {
      element: <DefaultLayout />,
      children: [
        {
          path: Paths.house,
          element: <Home />,
        },
        {
          path: `${Paths.house}/:id`,
          element: <HouseDetail />,
        },
        {
          path: Routes.common.PERSONAL.path,
          element: <Users />,
        },
        {
          path: `${Paths.guest}/:guestId`,
          element: <GuestDetail />,
        }
      ],
    },
  ]);

  //! Function

  //! Render
  return <RouterProvider router={router} />;
}

export default App;
