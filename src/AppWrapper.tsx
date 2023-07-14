import React, { useEffect } from "react";
import { currentPathViewer } from "./redux/userGlobalSlice";
import HeaderComp from "./components/HeaderComp/HeaderComp";
import FooterComp from "./components/FooterComp/FooterComp";
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
            {(!user.currentPath?.match(/signIn/) && !user.currentPath?.match(/signUp/)) && <HeaderComp />}
            <div>
                Боковая панель
            </div>
            <Outlet />
            <FooterComp />
        </div >
    )
}

export default AppWrapper