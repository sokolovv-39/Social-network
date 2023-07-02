import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchChatsPreview } from '../redux/chatsSlice'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { chatPreviewType } from '../redux/chatsSlice'

type chatStringifyType = {
    id: string | null,
    name: string | null,
    surname: string | null,
    isOnline: string | null
}

const ChatsPreviewComp: React.FC = () => {
    const chatsPreviewList = useAppSelector(state => state.chatsGlobal.chatsPreviewList)
    const userId = useAppSelector(state => state.userGlobal.global.id)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const goToChat = (chat: chatPreviewType) => {
        let chatStringify = {
            id: String(chat.id),
            name: String(chat.senderName),
            surname: String(chat.senderSurname),
            isOnline: String(chat.isOnline)
        }
        const urlParams = new URLSearchParams(chatStringify)
        navigate(`/profile/${userId}/chats/${chat.id}?${urlParams}`)
    }

    useEffect(() => {
        dispatch(fetchChatsPreview())
    }, [])
    return (
        <div>
            <h1>ChatsPreview</h1>
            <ul>
                {
                    chatsPreviewList.map(chat => {
                        return (
                            <li key={chat.id}>
                                <button type='button' onClick={() => goToChat(chat)}>
                                    <h6>{chat.senderName} {chat.senderSurname}</h6>
                                    <p>{chat.lastMessage}</p>
                                    <p>{new Date(chat.datetime!).toString()}</p>
                                    <p>{chat.isOnline ? 'Онлайн' : 'Не онлайн'}</p>
                                </button>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default ChatsPreviewComp