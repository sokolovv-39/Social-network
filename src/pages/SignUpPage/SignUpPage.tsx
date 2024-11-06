import React from "react";
import { useAppDispatch } from "../../hooks";
import { registerRequest } from "../../redux/userGlobalSlice";
import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom'
import { IUserRegisterInput } from "../../redux/userGlobalSlice";
import classes from './SignUpPage.module.scss'

const SignUpPage: React.FC = () => {
    const dispatch = useAppDispatch()
    const [matchPwds, setMatchPwds] = useState(false)
    const navigate = useNavigate()
    const [error, setError] = useState(false)

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        if (formData.get('password') !== formData.get('repeat-password')) {
            setMatchPwds(true)
        }
        else {
            setMatchPwds(false)
            formData.delete('repeat-password')
            let input: IUserRegisterInput = {
                name: formData.get('name') as string,
                surname: formData.get('surname') as string,
                email: formData.get('email') as string,
                password: formData.get('password') as string
            }
            const user = await dispatch(registerRequest(input))
            if (user.meta.requestStatus !== 'rejected') {
                setError(false)
                //@ts-ignore
                navigate(`/profile/${user.payload!.id}`)
            }
            else {
                setError(true)
            }
        }
    }
    return (
        <div className={classes.Wrapper}>
            <form onSubmit={handleSubmit}>
                <div className={classes.InputBlock}>
                <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" required />
                </div>
                <div className={classes.InputBlock}>
                <label htmlFor="surname">Surname</label>
                            <input type="text" id="surname" name="surname" required />
                </div>
                <div className={classes.InputBlock}>
                <label htmlFor="email">E-mail</label>
                            <input type="email" id="email" name="email" required />
                </div>
                <div className={classes.InputBlock}>
                <label htmlFor="pwd">Create password</label>
                            <input type="password" id="pwd" name="password" required />
                </div>
                <div className={classes.InputBlock}>
                <label htmlFor="repeat-pwd">Repeat password</label>
                <input type="password" id="pwd" name="repeat-password" required />
                </div>
                <button type="submit">Register</button>
            </form>
            {matchPwds && <PwdsNotMath />}
            {error && <Error />}
            <p>Уже зарегистрированы? <Link to="/signIn">Войдите</Link></p>
        </div>
    )
}

const PwdsNotMath: React.FC = () => {
    return (
        <div>
            <p>Пароли не совпадают</p>
        </div>
    )
}

const Error: React.FC = () => {
    return (
        <p>Возникла ошибка</p>
    )
}

export default SignUpPage