import { createSlice, createAsyncThunk, PayloadAction, CaseReducer, current } from "@reduxjs/toolkit";
import * as socketIO from 'socket.io-client'

type initialStateType = {
    socket: socketType,
    newMessages: {
        [key: string]: newMessageType[]
    }
}
type socketType = null | socketIO.Socket | socketIO.SocketOptions
type newMessageType = {
    from: string,
    body: string,
    datetime: string,
    isRead: boolean
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
            console.log('CONNECTION ESTABLISHED')
            console.log(action)
            state.socket = action.payload
            console.log('socket state is')
            console.log(state)
        },
        addNewMessage(state, action) {
            if (action.payload.from in state.newMessages) {
                state.newMessages[action.payload.from].push(action.payload)
            }
            else {
                state.newMessages[action.payload.from] = [action.payload]
            }
            console.log('state updated!')
            console.log(state.newMessages)
        },
        sendNewMessage(state, action) {
            if (action.payload.to in state.newMessages) {
                state.newMessages[action.payload.to].push({
                    from: action.payload.from,
                    body: action.payload.body,
                    datetime: action.payload.datetime,
                    isRead: action.payload.isRead
                })
            }
            else {
                state.newMessages[action.payload.to] = [{
                    from: action.payload.from,
                    body: action.payload.body,
                    datetime: action.payload.datetime,
                    isRead: action.payload.isRead
                }]
            }
            console.log('state updated')
            console.log(current(state))
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadChatHistory.fulfilled, (state, action) => {
                console.log('payload')
                //@ts-ignore
                state.newMessages[action.payload.from] = action.payload.messagesArr
                console.log(current(state))
            })
    }
})

export const uploadChatHistory = createAsyncThunk<newMessageType[], string, { rejectValue: string }>(
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

export const markAsReadMsg = createAsyncThunk<undefined, string, { rejectValue: string }>(
    'socketStore/markAsReadMsg',
    async function markAsReadMsg(msgID, { rejectWithValue }) {
        const response = await fetch(`http://localhost:3000/api/chats/markAsReadMsg?msgID=${msgID}`)
        if (!response.ok) {
            return rejectWithValue('No network')
        }
    }
)

export const { establishConnection, addNewMessage, sendNewMessage } = socketStoreSlice.actions

export default socketStoreSlice.reducer