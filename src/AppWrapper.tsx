import React, { useEffect } from "react";
import { currentPathViewer } from "./redux/userGlobalSlice";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";

const AppWrapper: React.FC = () => {
    const user = useAppSelector(state => state.userGlobal.global)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(currentPathViewer(window.location.href))
    }, [window.location.href])

    return (
        <div>
            <Link to='/testPage'>Test Page</Link>
            {(!user.currentPath?.match(/signIn/) && !user.currentPath?.match(/signUp/)) && <Header />}
            <div>
                Боковая панель
            </div>
            <Outlet />
            <Footer />
        </div >
    )
}

export default AppWrapper