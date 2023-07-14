import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchPosts, publishPost } from '../../redux/postsSlice'
import PostComp from '../../components/PostComp/PostComp'
import { localExit } from '../../redux/userGlobalSlice'
import { addNewMessage, establishConnection, markAsViewed } from '../../redux/socketSlice'
import * as socketIO from 'socket.io-client'
import axios from 'axios'
import { fetchChatsPreview } from '../../redux/chatsSlice'
import { fetchUserPhotos, uploadUserPhoto } from '../../redux/photosSlice'
import { nanoid } from 'nanoid'
import classes from './ProfilePage.module.scss'
import AlbumComp from '../../components/AlbumComp/AlbumComp'

const MyProfile: React.FC = () => {
    const posts = useAppSelector(state => state.posts.postsList)
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.userGlobal.global)
    const navigate = useNavigate()
    const socket = useAppSelector(state => state.socketStore.socket)
    const avatar = useAppSelector(state => state.photosStore.avatar)
    const [avatarObjURL, setAvatarObjURL] = useState<ReturnType<typeof URL.createObjectURL>>('')

    const handlePost: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const postForm = new FormData(e.currentTarget)
        let files = postForm.getAll('photo') as File[] | null
        if (!files![0].name) files = null
        const postData = {
            title: postForm.get('title') as string,
            content: postForm.get('content') as string,
            photoData: files
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

    const uploadFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        if (e.currentTarget.files) {
            console.log(Object.prototype.toString.call(e.currentTarget.files[0]))
            //@ts-ignore
            console.log(e.currentTarget.files[0].buffer)
            console.log('IS HOW')
            console.log(e.currentTarget.id === 'avatar' ? true : false)
            dispatch(uploadUserPhoto({
                fileData: e.currentTarget.files[0],
                isAvatar: e.currentTarget.id === 'avatar' ? true : false
            }))
        }
        /*  dispatch(uploadNewUserPhoto({
             fileData: e.currentTarget.files![0],
             isAvatar: false
         }))
         setObjURL1(URL.createObjectURL(e.currentTarget.files![0]))
         const form = new FormData()
         form.append('avatar', e.currentTarget.files![0])
         console.log('FILE')
         console.log(Object.prototype.toString.call(e.currentTarget.files![0]))
         console.log(e.currentTarget.files![0])
         axios.post('http://localhost:3000/uploadPhoto', form, {
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
             }
         }).then((res) => {
             console.log('res.data')
             console.log(res.data)
             console.log(Object.prototype.toString.call(res.data.buffer))
             setObjURL2(URL.createObjectURL(new Blob([new Uint8Array(res.data.buffer.data)])))
         }) */
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
                dispatch(fetchUserPhotos())

                if (socket) {
                    socket.on('user:newMessage', messageData => {
                        dispatch(addNewMessage(messageData))
                    })
                    socket.on('user:markAsViewed', messageData => {
                        dispatch(markAsViewed(messageData))
                    })
                }
            }
        })()
    }, [user])

    useEffect(() => {
        if (avatar) {
            setAvatarObjURL(URL.createObjectURL(avatar!))
        }
    }, [avatar])

    return (
        <div>
            <label htmlFor="avatar" className={classes.Files}>Сменить фото профиля</label>
            <input type="file" id='avatar' onChange={(e) => uploadFile(e)} style={{
                visibility: 'hidden'
            }} />
            <img src={avatarObjURL} alt="avatar_photo" />
            <div>
                <h1>{user.name}</h1>
                <h1>{user.surname}</h1>
                <button type='button' onClick={handleExit}>Выйти из аккаунта</button>
            </div>
            <form id='postPublisher' method='post' onSubmit={handlePost}>
                <fieldset>
                    <input placeholder='Расскажите о чем-нибудь...' type="text" id='title' name='title' required />
                    <textarea name="content" id="content" placeholder='А поподробней...'></textarea>
                    <label htmlFor="photos">Загрузите фотографии</label>
                    <input type="file" id='photos' name='photo' multiple />
                    <button type='submit'>Рассказать!</button>
                </fieldset>
            </form>
            <label htmlFor="addPhoto" className={classes.Files}>Добавить фото в альбом</label>
            <input type="file" name='newPhoto' id='addPhoto' onChange={(e) => uploadFile(e)} style={
                {
                    visibility: 'hidden',
                }
            } />
            <AlbumComp />
            <div>
                <h2>Мои записи</h2>
                <ul>
                    {posts.map(post => {
                        return (
                            <li key={nanoid()}>
                                <PostComp id={post.id} title={post.name!} content={post.content} likesId={post.likesId} type='profile' photoData={post.photoData!} />
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div >
    )
}

export default MyProfile