import React, { useState, useEffect } from "react"
import FriendRequests from "../components/FriendRequests"
import { fetchFriendsRequests } from "../redux/friendsRequestsSlice"
import { useAppDispatch, useAppSelector } from "../hooks"

const FriendRequestsPage: React.FC = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchFriendsRequests('http://localhost:3000/api/friends/getInFriendReq'))
    }, [])

    return (
        <div>
            <h1>Заявки в друзья</h1>
            <div>
                <ul>
                    <li>
                        <label htmlFor="incoming">Показать входящие</label>
                        <input type="radio" id="incoming" name="requests" value="incoming" defaultChecked onChange={e => {
                            dispatch(fetchFriendsRequests('http://localhost:3000/api/friends/getInFriendReq'))
                        }} />
                    </li>
                    <li>
                        <label htmlFor="outcoming">Показать исходящие</label>
                        <input type="radio" id="outcoming" name="requests" value="outcoming" onChange={e => {
                            dispatch(fetchFriendsRequests('http://localhost:3000/api/friends/getOutFriendReq'))
                        }} />
                    </li>
                </ul>
            </div>
            <FriendRequests />
        </div>
    )
}

export default FriendRequestsPage