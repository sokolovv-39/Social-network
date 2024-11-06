import React, { useEffect } from "react";
import { currentPathViewer } from "../../redux/userGlobalSlice";
import Header from "../Header/Header";
import Footer from "../Footer";
import { Outlet, Link } from "react-router-dom";
import { useAppSelector,useAppDispatch } from "../../hooks";
import classes from './AppWrapperComp.module.scss'

const AppWrapperComp: React.FC = () => {
    const user = useAppSelector(state => state.userGlobal.global)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(currentPathViewer(window.location.href))
    }, [window.location.href])

    return (
        <div className={classes.Wrapper}>
            {(!user.currentPath?.match(/signIn/) && !user.currentPath?.match(/signUp/)) && <Header />}
            <div className={classes.Content}>
            <Outlet />
            </div>
            <Footer />
        </div >
    )
}

export default AppWrapperComp