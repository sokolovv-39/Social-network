import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export type chatPreviewType = {
    id: number | null
    senderName: string | null,
    senderSurname: string | null,
    lastMessage: string | null
    datetime: string | null
    isOnline: boolean | null,
    viewed: boolean
}
type chatsGlobalType = {
    chatsPreviewList: chatPreviewType[]
}

const initialState: chatsGlobalType = {
    chatsPreviewList: []
}

const chatsSlice = createSlice({
    name: 'chatsGlobal',
    initialState,
    reducers: {
        updateLastMessage(state, action) {
            const index = state.chatsPreviewList.findIndex(previewObj => previewObj.id == action.payload.id)
            if (index !== -1) {
                console.log('UPDATE LAST MESSAGE IN PROGRESS...')
                console.log(action.payload)
                //@ts-ignore
                state.chatsPreviewList[index] = action.payload
            }
        }
    },
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

export const { updateLastMessage } = chatsSlice.actions

export default chatsSlice.reducer