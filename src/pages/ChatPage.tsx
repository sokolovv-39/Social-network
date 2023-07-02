import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { nanoid } from 'nanoid'
import { addNewMessage, sendNewMessage, uploadChatHistory } from '../redux/socketSlice'

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

    const sendMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        const message = new FormData(e.currentTarget).get('message')
        //@ts-ignore
        socket.emit('user:sendMessage', {
            senderID: String(userID),
            recipientID: id,
            body: message
        })
        dispatch(sendNewMessage({
            to: id,
            from: userID,
            body: message
        }))
    }

    useEffect(() => {
        dispatch(uploadChatHistory(id!))
    }, [])
    /*     useEffect(() => {
            function callback(entries: any, observer: any): void {
                entries.forEach(async (entry: any) => {
                    if (entry.isIntersecting) {
                        await dispatch(fetchNews(entry.target.dataset.id - 1))
                        observer.unobserve(entry.target)
                    }
                })
            }
            const options = {
                threshold: 1,
            }
            const observer = new IntersectionObserver(callback, options)
        }) */

    return (
        <div>
            <h5>{name} {surname}</h5>
            {isOnline && <p>Онлайн</p>}
            <ul>
                {messagesList.map(message => {
                    console.log(`message.from: ${message.from}`)
                    console.log(`userID: ${userID}`)
                    console.log(`id: ${id}`)
                    console.log(`body: ${message.body}`)
                    return (
                        <li key={nanoid()}>
                            {message.from == id ? <p>{message.body} Собеседник</p> : <p>{message.body} Я</p>}
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