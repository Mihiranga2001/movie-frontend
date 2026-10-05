import { createBrowserRouter } from "react-router-dom";

import Layout from "../components/layout/Layout";
import Admin from "../pages/Admin/Admin";
import History from "../pages/History/History";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import MovieDetails from "../pages/MovieDetails/MovieDetails";
import Movies from "../pages/Movies/Movies";
import NotFound from "../pages/NotFound/NotFound";
import Register from "../pages/Register/Register";
import Series from "../pages/Series/Series";
import SeriesDetails from "../pages/SeriesDetails/SeriesDetails";
import Watch from "../pages/Watch/Watch";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },

      { path: "movies", element: <Movies /> },
      { path: "movies/:id", element: <MovieDetails /> },

      { path: "series", element: <Series /> },
      { path: "series/:id", element: <SeriesDetails /> },

      // One route serves both movies and episodes; the component reads
      // :mediaType to decide which endpoint to call.
      { path: "watch/:mediaType/:id", element: <Watch /> },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      {
        element: <ProtectedRoute />,
        children: [{ path: "history", element: <History /> }],
      },
      {
        element: <ProtectedRoute adminOnly />,
        children: [{ path: "admin", element: <Admin /> }],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default AppRoutes;
