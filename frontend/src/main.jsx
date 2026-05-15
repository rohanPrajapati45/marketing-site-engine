import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./routes/App.jsx";
import Home from "./routes/Home.jsx";
import Work from "./routes/Work.jsx";
import What_we_do from "./routes/What_we_do.jsx";
import Solutions from "./routes/Solutions.jsx";
import Blog from "./routes/Blog.jsx";
import Contact from "./routes/Contact.jsx";
import Agency from "./routes/Agency.jsx";
import Blog_details from "./routes/Blog_details.jsx";
import CaseStudy from "./routes/CaseStudy.jsx";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/work",
        element: <Work />,
      },
      {
        path: "/work/:slug",
        element: <CaseStudy />,
      },
      {
        path: "/agency",
        element: <Agency />,
      },
      {
        path: "/what-we-do",
        element: <What_we_do />,
      },
      {
        path: "/solutions",
        element: <Solutions />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/blog-details/:id",
        element: <Blog_details />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </StrictMode>,
);
