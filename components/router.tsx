import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Spinner } from "theme-ui";
import { useRouter } from "next/router";
import { Routes } from "helpers/routes";
import StartPage from "./startPage";
import { useState, useEffect } from "react";
import App from "./app";
import { Route } from "react-router-dom";

const EventForm = dynamic(() => import("./eventForm"), {
  loading: () => (
    <Spinner sx={{ margin: "20rem auto", transform: "translateY(-50%)" }} />
  ),
});

const EventPage = dynamic(() => import("./eventPage"), {
  loading: () => (
    <Spinner sx={{ margin: "20rem auto", transform: "translateY(-50%)" }} />
  ),
});

const EventExplorer = dynamic(() => import("./eventExplorer"), {
  loading: () => (
    <Spinner sx={{ margin: "20rem auto", transform: "translateY(-50%)" }} />
  ),
});

const Router: React.FC = () => {
  const router = useRouter();
  const [routePath, setRoutePath] = useState<Routes>();

  useEffect(() => {
    setRoutePath(router.asPath.split("?")[0] as Routes);
  }, [router.asPath]);

  const RouteToComponentMap = {
    [Routes.StartPage]: () => <StartPage />,
    [Routes.EventForm]: () => <EventForm />,
    [Routes.EventPage]: () => <EventPage />,
    [Routes.EventExplorer]: () => <EventExplorer />,
  };

  return routePath ? (
    routePath !== Routes.StartPage ? (
      <App>{RouteToComponentMap[routePath]()}</App>
    ) : (
      RouteToComponentMap[Routes.StartPage]()
    )
  ) : (
    <></>
  );
};

export default Router;
