import CommonIcons from "../Components/CommonIcons";

const Routes = {
  common: {
    HOME: {
      path: "/home",
      icon: <CommonIcons.Home />,
    },
    Guest: {
      path: "/guest",
      icon: <CommonIcons.Person />,
    },
    Bill: {
      path: "/bill",
      icon: <CommonIcons.Payment />,
    },
    Scheduler: {
      path: "/scheduler",
      icon: <CommonIcons.Schedule />,
    }
  },
};

export const Paths = {
  house: "/house",
  guest: "/guest",
  bill: "/bill",
  room: "/room",
  login: "/login",
  register: "/register",
  scheduler: "/scheduler",
};

export default Routes;
