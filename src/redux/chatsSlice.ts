import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export type chatPreviewType = {
    id: number | null
    senderName: string | null,
    senderSurname: string | null,
    lastMessage: string | null
    datetime: string | null
    isOnline: boolean | null
}
type messageObjType = {
    message: string | null,
    datetime: string | null,
    viewed: boolean | null
}
type specificChatType = {
    senderName: string | null,
    senderSurname: string | null,
    messagesArr: messageObjType[] | null
} | {}
type chatsGlobalType = {
    chatsPreviewList: chatPreviewType[],
    specificChat: specificChatType
}

const initialState: chatsGlobalType = {
    chatsPreviewList: [],
    specificChat: {}
}

const chatsSlice = createSlice({
    name: 'chatsGlobal',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchChatsPreview.fulfilled, (state, action) => {
                state.chatsPreviewList = action.payload
            })
    }
})

export const fetchChatsPreview = createAsyncThunk<chatPreviewType[], undefined, { rejectValue: string }>(
    'chats/getPreviews',
    async function fetchChatsPreview(_, { rejectWithValue }) {
        const response = await fetch('http://localhost:3000/api/chats/getChatsPreview', {
            credentials: 'include'
        })
        if (!response.ok) {
            return rejectWithValue('Failed to process friend request')
        }
        else return await response.json()
    }
)

export default chatsSlice.reducer