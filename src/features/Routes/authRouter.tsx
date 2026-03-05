import { createBrowserRouter } from "react-router-dom";
import { Authentication } from "../../pages";
import Terms from "../../pages/Terms/Terms";
import Privacy from "../../pages/Privacy/Privacy";

export const authRouter = createBrowserRouter([
  {
    path: "*",
    element: <Authentication />
  },
  {
    path: "/terms",
    element: <Terms />
  },
  {
    path: "/privacy",
    element: <Privacy />
  }
]);