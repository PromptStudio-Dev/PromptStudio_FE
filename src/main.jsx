import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import HubPage from "./pages/HubPage/HubPage.jsx";
import ArchivePage from "./pages/ArchivePage/ArchivePage.jsx";
import MakerPage from "./pages/MakerPage/MakerPage.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HubPage />,
      },
      {
        path: "archive",
        element: <ArchivePage />,
      },
      {
        path: "maker",
        element: <MakerPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
