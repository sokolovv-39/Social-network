import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchPosts, publishPost } from '../redux/postsSlice'
import PostComp from '../components/PostComp'
import { localExit } from '../redux/userGlobalSlice'
import { addNewMessage, establishConnection } from '../redux/socketSlice'
import * as socketIO from 'socket.io-client'
import { fetchChatsPreview } from '../redux/chatsSlice'

const MyProfile: React.FC = () => {
    const posts = useAppSelector(state => state.posts.postsList)
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.userGlobal.global)
    const navigate = useNavigate()
    const socket = useAppSelector(state => state.socketStore.socket)

    const handlePost: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const postForm = new FormData(e.currentTarget)
        const postData = {
            title: postForm.get('title') as string,
            content: postForm.get('content') as string
        }
        await dispatch(publishPost(postData))
        dispatch(fetchPosts())
    }
    async function handleExit() {
        //@ts-ignore
        socket!.emit('user:offline', user.id)
        //@ts-ignore
        socket!.disconnect()
        await dispatch(localExit())
        navigate('/signIn')
    }

    useEffect(() => {
        (async function () {
            if (user.id) {
                const socket = socketIO.connect('http://localhost:3000')
                //@ts-ignore
                const chatsID = (await dispatch(fetchChatsPreview())).payload.map(chat => String(chat.id))
                socket.emit('user:online', {
                    userID: user.id,
                    chatsID
                })
                dispatch(fetchPosts())
                dispatch(establishConnection(socket))

                if (socket) {
                    //@ts-ignore
                    socket.on('user:newMessage', messageData => {
                        dispatch(addNewMessage(messageData))
                    })
                }
            }
        })()
    }, [user])

    return (
        <div>
            <img src="../../public/заглушка.jpg" alt="картинка" />
            <div>
                <h1>{user.name}</h1>
                <h1>{user.surname}</h1>
                <button type='button' onClick={handleExit}>Выйти из аккаунта</button>
            </div>
            <form id='postPublisher' method='post' onSubmit={handlePost}>
                <fieldset>
                    <input placeholder='Расскажите о чем-нибудь...' type="text" id='title' name='title' required />
                    <textarea name="content" id="content" placeholder='А поподробней...'></textarea>
                    <button type='submit'>Рассказать!</button>
                </fieldset>
            </form>
            <div>
                <h2>Мои записи</h2>
                <ul>
                    {posts.map(post => {
                        return (
                            <li key={post.id}>
                                <PostComp id={post.id} title={post.title} content={post.content} likesId={post.likesId} type='profile' />
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default MyProfile