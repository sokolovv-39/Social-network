import React, { useEffect } from 'react'
import SearchComp from '../components/SearchComp'
import { useAppSelector, useAppDispatch } from '../hooks'
import { fetchFriendsRequests } from '../redux/friendsRequestsSlice'
import ChatsPreviewComp from '../components/ChatsPreviewComp'

const ChatsListPage: React.FC = () => {
    const friendsArr = useAppSelector(state => state.friendsRequests.friendsList)
    const isOnlineArr: Number[] = []
    friendsArr.forEach(friend => {
        if (friend.isOnline) isOnlineArr.push(friend.id!)
    })
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchFriendsRequests('http://localhost:3000/api/friends/getFriends'))
    }, [])
    useEffect(() => {
        console.log('CHATS MOUNTED')
        return () => {
            console.log('CHATS UNMOUNTED')
        }
    })

    return (
        <div>
            <h1>Сообщения</h1>
            <SearchComp dataArr={friendsArr} />
            <ChatsPreviewComp />
        </div>
    )
}

export default ChatsListPage