import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { answerFriendRequest, fetchFriendsRequests, sendFriendRequest } from '../../redux/friendsRequestsSlice'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'

type IpropsPerC = {
    id: number | null
    name: string | null,
    surname: string | null,
    type: string,
    isOnline: boolean
}

type propsStringifyType = {
    id: string | null,
    name: string | null,
    surname: string | null,
    type: string | null
    isOnline: string | null
}

const PersonCardComp: React.FC<IpropsPerC> = (props) => {
    const userId = useAppSelector(state => state.userGlobal.global.id)
    const navigate = useNavigate()
    let propsStringify: propsStringifyType = {
        id: null,
        name: null,
        surname: null,
        type: null,
        isOnline: null
    }
    for (let key in props) {
        propsStringify[key as keyof propsStringifyType] = String(props[key as keyof IpropsPerC])
    }
    const urlParams = new URLSearchParams(propsStringify as Record<'id' | 'name' | 'surname' | 'type' | 'isOnline', string>)
    if (props.type === 'messagesSearch') {
        return (
            <button type='button' onClick={() => navigate(`/profile/${userId}/chats/${urlParams.get('id')}?${urlParams}`)}>
                <h6>{props.name}</h6>
                <h6>{props.surname}</h6>
                {props.isOnline ? <p>Онлайн</p> : <p>Не Онлайн</p>}
            </button>
        )
    }
    else return (
        <li>
            <h3>{props.name}</h3>
            <h3>{props.surname}</h3>
            {props.isOnline ? <p>Онлайн</p> : <p>Не Онлайн</p>}
            {props.type === 'people' && <AddToFriend id={props.id} />}
            {props.type === 'inRequest' && <InFriendRequest id={props.id} />}
            {props.type === 'outRequest' && <OutFriendRequest id={props.id} />}
            {props.type === 'friend' && <FriendComp id={props.id} />}
        </li>
    )
}

type IPropsButtons = {
    id: number | null
}

const AddToFriend: React.FC<IPropsButtons> = ({ id }) => {
    const [isSent, setIsSent] = useState(false)
    const dispatch = useAppDispatch()

    if (!isSent) {
        return (
            <button type="button" onClick={async () => {
                const dispReturn = await dispatch(sendFriendRequest(`${id}`))
                if (dispReturn.meta.requestStatus === 'fulfilled') setIsSent(true)
            }}>Добавить в друзья</button>
        )
    }
    else return (
        <button type='button' disabled>
            Заявка отправлена
        </button>
    )
}

const InFriendRequest: React.FC<IPropsButtons> = ({ id }) => {
    const dispatch = useAppDispatch()
    const loading = useAppSelector(state => state.friendsRequests.loading)

    return (
        <div>
            <button type='button' onClick={async () => {
                await dispatch(answerFriendRequest({
                    status: 'accept',
                    id: `${id}`
                }))
                dispatch(fetchFriendsRequests('http://localhost:3000/api/friends/getInFriendReq'))
            }}>{loading ? 'Загрузка' : 'Принять заявку'}</button>
            <button type='button' onClick={() => {
                dispatch(answerFriendRequest({
                    status: 'reject',
                    id: `${id}`
                }))
            }}>{loading ? 'Загрузка' : 'Отклонить'}</button>
        </div>
    )
}

const OutFriendRequest: React.FC<IPropsButtons> = ({ id }) => {
    return (
        <div>
            <button type='button'>Отменить заявку</button>
        </div>
    )
}

const FriendComp: React.FC<IPropsButtons> = ({ id }) => {
    const dispatch = useAppDispatch()

    return (
        <button type='button' onClick={async () => {
            await dispatch(answerFriendRequest({
                id: `${id}`,
                status: 'delete'
            }))
            dispatch(fetchFriendsRequests('http://localhost:3000/api/friends/getFriends'))
        }}>Удалить из друзей</button>
    )
}

export default PersonCardComp