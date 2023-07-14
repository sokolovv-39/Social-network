import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { nanoid } from 'nanoid'
import { addNewMessage, sendNewMessage, uploadChatHistory } from '../../redux/socketSlice'

const ChatComp: React.FC = () => {
    const [searchParams] = useSearchParams()
    const id = searchParams.get('id')
    const name = searchParams.get('name')
    const surname = searchParams.get('surname')
    const isOnline = Boolean(searchParams.get('isOnline'))
    const socket = useAppSelector(state => state.socketStore.socket)
    const userID = useAppSelector(state => state.userGlobal.global.id)
    const messagesList = useAppSelector(state => state.socketStore.newMessages)[id!] || []
    const dispatch = useAppDispatch()
    const msgsRef = useRef<(HTMLLIElement | null)[]>([])

    const sendMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        const messageID = nanoid()
        const message = new FormData(e.currentTarget).get('message')
        //@ts-ignore
        socket.emit('user:sendMessage', {
            id: messageID,
            senderID: String(userID),
            recipientID: id,
            body: message
        })
        dispatch(sendNewMessage({
            id: messageID,
            to: id,
            from: userID,
            body: message,
            viewed: false,
            datetime: (new Date()).toString()
        }))
    }

    useEffect(() => {
        dispatch(uploadChatHistory(id!))
    }, [])
    useEffect(() => {
        function callback(entries: any, observer: any): void {
            entries.forEach(async (entry: any) => {
                if (entry.isIntersecting) {
                    if (socket) {
                        //@ts-ignore
                        socket.emit('user:msgViewed', {
                            msgID: entry.target.dataset.id,
                            senderID: userID,
                            recipientID: id
                        })
                    }
                    //@ts-ignore
                }
            })
        }
        const options = {
            threshold: 1,
        }
        const observer = new IntersectionObserver(callback, options)
        msgsRef.current.forEach(msg => observer.observe(msg!))
    })

    return (
        <div>
            <h5>{name} {surname}</h5>
            {isOnline && <p>Онлайн</p>}
            <ul>
                {messagesList.map((message, index) => {
                    const isViewedBlock = message.viewed ? <p>Просмотрено</p> : <p>Не просмотрено</p>
                    return (
                        <li data-id={message.id} key={message.id} ref={element => {
                            if (message.from == id && message.viewed == false) msgsRef.current[index] = element
                        }}>
                            {message.from == id ? <p>{message.body} Собеседник</p> : <p>{message.body} Я</p>}
                            {+message.from == userID && isViewedBlock}
                        </li>
                    )
                })}
            </ul>
            <form onSubmit={(e) => sendMessage(e)}>
                <input type="text" placeholder='Введите сообщение' name='message' />
                <button type='submit'>Написать</button>
            </form>
        </div>
    )
}

export default ChatComp