import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import * as socketIO from 'socket.io-client'

type initialStateType = {
    socket: socketType,
    newMessages: {
        [key: string]: newMessageType[]
    }
}
type socketType = null | socketIO.Socket | socketIO.SocketOptions
type newMessageType = {
    id: string,
    from: string,
    body: string,
    datetime: string,
    viewed: boolean
}

const initialState: initialStateType = {
    socket: null,
    newMessages: {}
}

const socketStoreSlice = createSlice({
    name: 'socketStore',
    initialState,
    reducers: {
        establishConnection(state, action) {
            state.socket = action.payload
        },
        addNewMessage(state, action) {
            if (action.payload.from in state.newMessages) {
                state.newMessages[action.payload.from].push(action.payload)
            }
            else {
                state.newMessages[action.payload.from] = [action.payload]
            }
        },
        sendNewMessage(state, action) {
            if (action.payload.to in state.newMessages) {
                state.newMessages[action.payload.to].push({
                    id: action.payload.id,
                    from: action.payload.from,
                    body: action.payload.body,
                    datetime: action.payload.datetime,
                    viewed: action.payload.viewed,
                })
            }
            else {
                state.newMessages[action.payload.to] = [{
                    id: action.payload.id,
                    from: action.payload.from,
                    body: action.payload.body,
                    datetime: action.payload.datetime,
                    viewed: action.payload.viewed
                }]
            }
        },
        markAsViewed(state, action) {
            if (state.newMessages[action.payload.from]) {
                const viewedMsgIndex = state.newMessages[action.payload.from].findIndex(msgObj => msgObj.id == action.payload.msgID)
                state.newMessages[action.payload.from][viewedMsgIndex].viewed = true
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadChatHistory.fulfilled, (state, action) => {
                //@ts-ignore
                state.newMessages[action.payload.from] = action.payload.messagesArr
            })
    }
})

type uploadChatHistoryType = {
    from: string,
    messagesArr: newMessageType[]
}

export const uploadChatHistory = createAsyncThunk<uploadChatHistoryType, string, { rejectValue: string }>(
    'socketStore/uploadChatHistory',
    async function uploadChatHistory(interlocutorID, { rejectWithValue }) {
        const response = await fetch(`http://localhost:3000/api/chats/uploadChatHistory?interlocutorID=${interlocutorID}`, {
            credentials: 'include'
        })
        if (!response.ok) {
            rejectWithValue('Failed to upload chat history')
        }
        else return await response.json()
    }
)

export const { establishConnection, addNewMessage, sendNewMessage, markAsViewed } = socketStoreSlice.actions

export default socketStoreSlice.reducer