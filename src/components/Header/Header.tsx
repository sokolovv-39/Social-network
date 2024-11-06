import React from 'react'
import NavigateComp from '../NavigateComp'
import classes from './Header.module.scss'
import {ReactComponent as LogoSVG} from '../../assets/InTouchLogo.svg'

const Header: React.FC = () => {
    return (
        <div className={classes.Wrapper}>
            <div>
<LogoSVG/>
            </div>
            <NavigateComp />
        </div>
    )
}

export default Header