import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks"
import PersonCard from "../../components/PersonCardComp/PersonCardComp"
import { fetchFriendsRequests } from "../../redux/friendsRequestsSlice"

const FriendsPage: React.FC = () => {
    const friends = useAppSelector(state => state.friendsRequests.friendsList)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchFriendsRequests('http://localhost:3000/api/friends/getFriends'))
    }, [])

    return (
        <div>
            <h1>Друзья</h1>
            {friends.map(friend => {
                return <PersonCard key={friend.id} id={friend.id} name={friend.name} surname={friend.surname} type="friend" isOnline={friend.isOnline} />
            })}
        </div>
    )
}

export default FriendsPage