import React from "react";
import { useAppDispatch } from "../../hooks";
import { registerRequest } from "../../redux/userGlobalSlice";
import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom'
import { IUserRegisterInput } from "../../redux/userGlobalSlice";

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
        <div>
            <form id="form" method="post" onSubmit={handleSubmit}>
                <fieldset>
                    <ul>
                        <li>
                            <label htmlFor="name">
                                <span>Name</span>
                                <strong><abbr title="required">*</abbr></strong>
                            </label>
                            <input type="text" id="name" name="name" required />
                        </li>
                        <li>
                            <label htmlFor="surname">
                                <span>Surname</span>
                                <strong><abbr title="required">*</abbr></strong>
                            </label>
                            <input type="text" id="surname" name="surname" required />
                        </li>
                        <li>
                            <label htmlFor="email">
                                <span>E-mail</span>
                                <strong><abbr title="required">*</abbr></strong>
                            </label>
                            <input type="email" id="email" name="email" required />
                        </li>
                        <li>
                            <label htmlFor="pwd">
                                <span>Create password</span>
                                <strong><abbr title="required">*</abbr></strong>
                            </label>
                            <input type="password" id="pwd" name="password" required />
                        </li>
                        <li>
                            <label htmlFor="repeat-pwd">
                                <span>Repeat password</span>
                                <strong><abbr title="required">*</abbr></strong>
                            </label>
                            <input type="password" id="repeat-pwd" name="repeat-password" required />
                        </li>
                    </ul>
                </fieldset>
                <p>
                    <button type="submit">Register</button>
                </p>
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