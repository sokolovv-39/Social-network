import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { deletePost, fetchPosts, likePost, getPost } from '../redux/postsSlice'

type IProps = {
    id?: number,
    title: string,
    content: string,
    type: string,
    userName?: string | undefined,
    userSurname?: string | undefined,
    likesId?: []
}

const PostComp: React.FC<IProps> = ({ id, title, content, type, userName, userSurname, likesId }) => {
    const dispatch = useAppDispatch()
    const userId = useAppSelector(state => state.userGlobal.global.id)
    const [isLiked, setIsLiked] = useState(false)
    const [likesNumber, setLikesNumber] = useState<number>(likesId!.length)

    const handleDelete = async () => {
        await dispatch(deletePost(id!))
        dispatch(fetchPosts())
    }
    function handleLike() {
        dispatch(likePost(id!))
        setIsLiked(true)
        setLikesNumber(likesNumber + 1)
    }

    useEffect(() => {
        (async function getUpdatedPost() {
            const updatedPost = await dispatch(getPost(id!))
            //@ts-ignore
            const likesIdArr = updatedPost.payload.likesId
            //@ts-ignore
            if (likesIdArr.find(likeId => +likeId === +userId)) {
                setIsLiked(true)
            }
        })()
        //Зачем два раза getPost???
        dispatch(getPost(id!))
    })//[]???

    return (
        <div>
            <h6>{userName} {userSurname}</h6>
            <h3>{title}</h3>
            <p>{content}</p>
            <p>Post id: {id}</p>
            {!isLiked ? <button type='button' onClick={handleLike}>Лайкнуть!</button> : <p>Вам понравилось</p>}
            <p>Понравилось {likesNumber} людям</p>
            {type === 'profile' && <button type='button' onClick={handleDelete}>Удалить пост</button>}
        </div >
    )
}

export default PostComp