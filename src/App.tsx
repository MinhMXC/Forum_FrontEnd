import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import './App.css';
import Header from "./components/Header";
import {createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router-dom";
import PostRoute from "./routes/PostRoute";
import AllPostRoute from "./routes/AllPostRoute";
import ErrorSection from "./components/ErrorSection";
import postLoader from "./loader/postLoader";
import UserRoute from "./routes/UserRoute";
import userLoader from "./loader/userLoader";
import allPostLoader from "./loader/allPostLoader";
import AuthRoute from "./routes/AuthRoute";
import MakeUpdatePostRoute from "./routes/MakeUpdatePostRoute";
import makePostLoader from "./loader/makePostLoader";

const WIDTH = window.screen.width
const COL_SIZE = 0.35

function App() {
    const width = WIDTH * COL_SIZE

    const router = createBrowserRouter([
        {
            element: (
                <>
                    <Header/>
                    <Outlet/>
                </>
            ),
            children: [
                {
                    path: "/",
                    element: <AllPostRoute width={width}/>,
                    loader: allPostLoader,
                },
                {
                    path: "/posts/:id",
                    element: <PostRoute width={width}/>,
                    loader: postLoader,
                    errorElement: <ErrorSection/>,
                },
                {
                    path: "/users/:id",
                    element: <UserRoute width={width}/>,
                    loader: userLoader,
                    errorElement: <ErrorSection/>,
                },
                {
                    path: "/auth",
                    element: <AuthRoute width={width}/>
                },
                {
                    path: "/make_post",
                    element: <MakeUpdatePostRoute width={width} />,
                    loader: makePostLoader
                },
                {
                    path: "*",
                    element: <Navigate to="/" replace/>
                },
            ]
        }
    ])

    return (
        <div id="main-wrapper">
            <RouterProvider router={router}/>
        </div>
    );
}

export default App;

