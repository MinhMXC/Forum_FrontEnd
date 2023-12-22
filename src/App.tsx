import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React, {useLayoutEffect, useState} from 'react';
import './App.css';
import Header from "./components/Header";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import PostRoute from "./routes/PostRoute";
import AllPostRoute from "./routes/AllPostRoute";
import ErrorSection from "./components/ErrorSection";
import postLoader from "./loader/postLoader";
import UserRoute from "./routes/UserRoute";
import userLoader from "./loader/userLoader";
import allPostLoader from "./loader/allPostLoader";
import AuthRoute from "./routes/AuthRoute";

const WIDTH = window.screen.width;
const HEIGHT = window.screen.height;
const COL_SIZE = 0.30;

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([document.body.clientWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

function App() {
    let [width, height] = useWindowSize();
    if (width >= WIDTH * COL_SIZE)
        width = WIDTH * COL_SIZE

    const router = createBrowserRouter([
        {
            path: "/",
            element: <AllPostRoute width={width} />,
            loader: allPostLoader,
        },
        {
            path: "/posts/:id",
            element: <PostRoute width={width} />,
            loader: postLoader,
            errorElement: <ErrorSection />,
        },
        {
            path: "users/:id",
            element: <UserRoute width={width} />,
            loader: userLoader,
            errorElement: <ErrorSection />,
        },
        {
          path: "/auth",
            element: <AuthRoute width={width} />
        },
        {
            path: "*",
            element: <Navigate to="/" replace />
        }
    ])

    return (
        <div id="main-wrapper">
            <Header />
            <RouterProvider router={router}/>
        </div>
    );
}

export default App;

