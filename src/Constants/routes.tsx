import CommonIcons from "../Components/CommonIcons";

const Routes = {
  common: {
    HOME: {
      path: "/home",
      icon: <CommonIcons.Home />,
    },
    PERSONAL: {
      path: "/personal",
      icon: <CommonIcons.Person />,
    },
  },
  explore: {
    BOT_STORE: {
      path: "/bot-store",
      icon: <CommonIcons.SmartToy />,
    },
    PLUGIN_STORE: {
      path: "/plugin-store",
      icon: <CommonIcons.Extension />,
    },
  },
};

export default Routes;
