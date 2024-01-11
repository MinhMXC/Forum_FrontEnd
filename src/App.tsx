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
import AuthRoute from "./routes/AuthRoute";
import MakeUpdatePostRoute from "./routes/MakeUpdatePostRoute";
import makePostLoader from "./loader/makePostLoader";
import AccountRoute from "./routes/AccountRoute";
import accountLoader from "./loader/accountLoader";

function App() {
    const router = createBrowserRouter([
        {
            element: (
                <>
                    <Header/>
                    <Outlet/>
                </>
            ),
            errorElement: <ErrorSection errorParams="Something has gone terribly wrong" />,
            children: [
                {
                    path: "/",
                    element: <AllPostRoute />,
                },
                {
                    path: "/posts/:id",
                    element: <PostRoute />,
                    loader: postLoader,
                    errorElement: <ErrorSection/>,
                },
                {
                    path: "/users/:id",
                    element: <UserRoute />,
                    loader: userLoader,
                    errorElement: <ErrorSection/>,
                },
                {
                    path: "/auth",
                    element: <AuthRoute />
                },
                {
                    path: "/make_post",
                    element: <MakeUpdatePostRoute />,
                    loader: makePostLoader
                },
                {
                    path: "/my_account",
                    element: <AccountRoute />,
                    loader: accountLoader,
                    errorElement: <ErrorSection/>,
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

