import CommonIcons from "../Components/CommonIcons";

const Routes = {
  common: {
    HOME: {
      path: "/home",
      icon: <CommonIcons.Home />,
    },
    ROOM: {
      path: "/room",
      icon: <CommonIcons.MeetingRoom />,
    },
    Guest: {
      path: "/guest",
      icon: <CommonIcons.Person />,
    },
    Bill: {
      path: "/bill",
      icon: <CommonIcons.Payment />,
    },
  },
};

export const Paths = {
  house: "/house",
  guest: "/guest",
  bill: "/bill",
  room: "/room",
  login: "/login",
  register: "/register",
};

export default Routes;
