import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../hooks'

const NavigateComp: React.FC = () => {
    const user = useAppSelector(state => state.userGlobal.global)

    return (
        <div>
            <Link to={`/profile/${user.id}/chats`}>Сообщения</Link>
            <Link to={`/profile/${user.id}/people`}>Люди</Link>
            <Link to={`/profile/${user.id}/friendRequests`}>Заявки в друзья</Link>
            <Link to={`/profile/${user.id}/friends`}>Друзья</Link>
            <Link to={`/profile/${user.id}/news`}>Новости</Link>
            <Link to={`/profile/${user.id}`}>Профиль</Link>
        </div>
    )
}

export default NavigateComp