import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Spinner, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Routes } from "helpers/routes";
import StartPage from "./startPage";
import { useState, useEffect } from "react";
import App from "./app";
import ExpressEvent from "./expressEvent";

const StylizedSpinner = () => (
  <Spinner
    sx={{ margin: "20rem auto", transform: "translateY(-50%)" }}
    color={["bgAccent", "accentPrimary"]}
  />
);

const EventForm = dynamic(() => import("./eventForm"), {
  loading: () => <StylizedSpinner />,
});

const EventPage = dynamic(() => import("./eventPage"), {
  loading: () => <StylizedSpinner />,
});

const EventExplorer = dynamic(() => import("./eventExplorer"), {
  loading: () => <StylizedSpinner />,
});

const Dashboard = dynamic(() => import("./dashboard"), {
  loading: () => <StylizedSpinner />,
});

const Router: React.FC = () => {
  const router = useRouter();
  const [routePath, setRoutePath] = useState<Routes>();
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setRoutePath(router.asPath.split("?")[0] as Routes);
  }, [router.asPath]);

  useEffect(() => {
    routePath !== Routes.ExpressEvent && setColorMode("light");
  }, [routePath]);

  const RouteToComponentMap = {
    [Routes.StartPage]: () => <StartPage />,
    [Routes.EventForm]: () => <EventForm />,
    [Routes.EventPage]: () => <EventPage />,
    [Routes.EventExplorer]: () => <EventExplorer />,
    [Routes.ExpressEvent]: () => <ExpressEvent />,
    [Routes.FAQ]: () => <StartPage />,
    [Routes.Dashboard]: () => <Dashboard />,
  };

  return routePath ? (
    <App>
      {(
        RouteToComponentMap[routePath] || RouteToComponentMap[Routes.StartPage]
      )()}
    </App>
  ) : (
    <></>
  );
};

export default Router;
