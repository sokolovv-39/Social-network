import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export type IFriendReq = {
    id: number | null,
    name: string | null,
    surname: string | null,
    isSeen?: boolean | null,
    isOnline: boolean
}

type IFriendsReqState = {
    friendsReqList: IFriendReq[],
    friendsList: IFriendReq[]
    loading: boolean
}

type ansDataRec = Record<'status' | 'id', string>

export const fetchFriendsRequests = createAsyncThunk<IFriendReq[], string, { rejectValue: string }>(
    "friendsRequests/fetch",
    async function fetchFriendsRequests(url, { rejectWithValue }) {
        console.log(`url is ${url}`)
        let response = await fetch(url,
            {
                credentials: 'include'
            })
        if (!response.ok) {
            return rejectWithValue('Failed to upload friend requests')
        }
        else {
            return await response.json()
        }
    }
)

export const sendFriendRequest = createAsyncThunk<undefined, string, { rejectValue: string }>(
    "friendsRequests/sendFriendRequest",
    async function sendFriendRequest(id, { rejectWithValue }) {
        let response = await fetch('http://localhost:3000/api/friends/sendFriendReq', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: id
        })
        if (!response.ok) {
            return rejectWithValue('Failed to send friend request')
        }
    }
)

export const answerFriendRequest = createAsyncThunk<undefined, ansDataRec, { rejectValue: string }>(
    "friendsRequests/answerFriendRequest",
    async function answerFriendRequest(data, { rejectWithValue }) {
        if (data.status !== 'delete') {
            const url = new URL('http://localhost:3000/api/friends/answerFriendRequest')
            const params = new URLSearchParams(data)
            url.search = params.toString()
            let response = await fetch(url.toString(), {
                credentials: 'include'
            })
            if (!response.ok) {
                return rejectWithValue('Failed to process friend request')
            }
        }
        if (data.status === 'delete') {
            let response = await fetch(new URL(`http://localhost:3000/api/friends/deleteFriend?id=${data.id}`), {
                credentials: 'include'
            })
            if (!response.ok) {
                return rejectWithValue('Failed to delete friend')
            }
        }
    }
)

const initialState: IFriendsReqState = {
    friendsReqList: [],
    friendsList: [],
    loading: false
}

const friendRequestsSlice = createSlice({
    name: 'friendsRequests',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFriendsRequests.fulfilled, (state, action) => {
                if (/getInFriendReq/.test(action.meta.arg)) {
                    state.friendsReqList = action.payload
                }
                if (/getFriends/.test(action.meta.arg)) {
                    state.friendsList = action.payload
                }
            })
            .addCase(answerFriendRequest.pending, (state) => {
                state.loading = true
            })
            .addCase(answerFriendRequest.fulfilled, (state) => {
                state.loading = false
            })
    }
})

export default friendRequestsSlice.reducer