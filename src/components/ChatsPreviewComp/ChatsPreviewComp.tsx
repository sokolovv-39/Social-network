import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchChatsPreview, updateLastMessage } from '../../redux/chatsSlice'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { chatPreviewType } from '../../redux/chatsSlice'

const ChatsPreviewComp: React.FC = () => {
    const chatsPreviewList = useAppSelector(state => state.chatsGlobal.chatsPreviewList)
    const userId = useAppSelector(state => state.userGlobal.global.id)
    const socket = useAppSelector(state => state.socketStore.socket)
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
        (async function () {
            await dispatch(fetchChatsPreview())
            console.log('USE EFFECT TRIGGERED')
            if (socket) {
                console.log('socketOn initialized')
                //@ts-ignore
                socket.on('user:updateLastMessage', lastMessageObj => {
                    console.log('socket triggered')
                    console.log(lastMessageObj)
                    dispatch(updateLastMessage(lastMessageObj))
                })
            }
        })()
    }, [socket])
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
                                    <p>{chat.datetime}</p>
                                    <p>{chat.isOnline ? 'Онлайн' : 'Не онлайн'}</p>
                                    <p>{chat.viewed ? 'Просмотрено' : 'Не просмотрено'}</p>
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