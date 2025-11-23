import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// CSS를 가장 먼저 import하여 styled-components보다 우선순위 보장
import "./index.css";
import App from "./App.jsx";
import HubPage from "./pages/HubPage/HubPage.jsx";
import ArchivePage from "./pages/ArchivePage/ArchivePage.jsx";
import MakerShellPage from "./pages/MakerPage/MakerShellPage.jsx";
import UploadPage from "./pages/UploadPage/UploadPage.jsx";
import PromptDetailPage from "./pages/PromptDetailPage/PromptDetailPage.jsx";

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
        element: <MakerShellPage />,
      },
      {
        path: "maker/:makerId",
        element: <MakerShellPage />,
      },
      {
        path: "upload",
        element: <UploadPage />,
      },
      {
        path: "prompt/:promptId",
        element: <PromptDetailPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
