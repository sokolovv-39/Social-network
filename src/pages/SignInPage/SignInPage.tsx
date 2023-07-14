import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IUserAuthInput, authenticateUser } from "../../redux/userGlobalSlice";
import { useAppDispatch } from "../../hooks";
import { useState } from 'react'

const SignInPage: React.FC = () => {
    const [isWrongPwd, setIsWrongPwd] = useState(false)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const handleSumbit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const input: IUserAuthInput = {
            email: formData.get('email') as string,
            password: formData.get('password') as string
        }
        const user = await dispatch(authenticateUser(input))
        if (user.meta.requestStatus === 'rejected') {
            setIsWrongPwd(true)
        }
        else {
            setIsWrongPwd(false)
            //@ts-ignore
            navigate(`/profile/${user.payload!.id}`)
        }

    }
    return (
        <>
            <h1>Войдите</h1>
            <form id="form" method="post" onSubmit={handleSumbit}>
                <fieldset>
                    <ul>
                        <li>
                            <label htmlFor="email">E-mail</label>
                            <input type="email" id="email" name="email" />
                        </li>
                        <li>
                            <label htmlFor="pwd">Пароль</label>
                            <input type="password" id="pwd" name="password" />
                        </li>
                    </ul>
                    <p>
                        <button type="submit">Sign in</button>
                    </p>
                </fieldset>
            </form>
            {isWrongPwd && <WrongPwd />}
            <p>Еще не пользовались InTouch? <Link to="/signUp">Зарегистрируйтесь</Link></p>
        </>
    )
}

export default SignInPage

const WrongPwd: React.FC = () => {
    return (
        <p>Неправильный пароль</p>
    )
}