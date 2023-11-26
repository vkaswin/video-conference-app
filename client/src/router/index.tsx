import { lazy } from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";

const ConferencePage = lazy(() => import(`@/pages/Conference`));

const routes: RouteObject[] = [
  { path: "/", element: <Navigate to="/conference/123" replace /> },
  { path: "/conference/:conferenceId", element: <ConferencePage /> },
];

const Router = () => {
  return useRoutes(routes);
};

export default Router;
