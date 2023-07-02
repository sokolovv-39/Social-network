import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

type IPost = {
    id?: number,
    title: string,
    content: string,
    userName?: string,
    userSurname?: string,
    likesId?: []
}

type IPostsSlice = {
    postsList: IPost[],
    newsList: IPost[],
    isEndNews: boolean,
}

const initialState: IPostsSlice = {
    postsList: [],
    newsList: [],
    isEndNews: false,
}

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.postsList = action.payload
            })
            .addCase(fetchNews.fulfilled, (state, action) => {
                if (action.payload.length < 10) state.isEndNews = true
                state.newsList = [...state.newsList, ...action.payload]
            })
    }
})

export const publishPost = createAsyncThunk<undefined, IPost, { rejectValue: string }>(
    'posts/publishPost',
    async function publishPost(postData, { rejectWithValue }) {
        const response = await fetch('http://localhost:3000/api/posts/publishPost', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
        if (!response.ok) {
            return rejectWithValue('Failed to publish a post')
        }
    }
)

export const fetchPosts = createAsyncThunk<IPost[], undefined, { rejectValue: string }>(
    'posts/fetchPosts',
    async function fetchPosts(_, { rejectWithValue }) {
        const response = await fetch('http://localhost:3000/api/posts/getPosts', {
            credentials: 'include'
        })
        if (!response.ok) {
            return rejectWithValue('Failed to upload posts')
        }
        else return await response.json()
    }
)

export const deletePost = createAsyncThunk<undefined, number, { rejectValue: string }>(
    'posts/deletePost',
    async function deletePost(id, { rejectWithValue }) {
        const response = await fetch(`http://localhost:3000/api/posts/deletePost?id=${id}`, {
            credentials: 'include'
        })
        if (!response.ok) {
            return rejectWithValue('Failed to delete post')
        }
    }
)

export const fetchNews = createAsyncThunk<IPost[], number, { rejectValue: string }>(
    'posts/fetchNews',
    async function fetchNews(row, { rejectWithValue }) {
        const response = await fetch(`http://localhost:3000/api/posts/getNews?row=${row}`, {
            credentials: 'include'
        })
        if (!response.ok) {
            return rejectWithValue('Failed to upload news')
        }
        else return await response.json()
    }
)

export const likePost = createAsyncThunk<IPost, number, { rejectValue: string }>(
    'posts/likePost',
    async function likePost(postId, { rejectWithValue }) {
        const response = await fetch(`http://localhost:3000/api/posts/likePost?postId=${postId}`, {
            credentials: 'include'
        })
        if (!response.ok) {
            return rejectWithValue('Failed to like')
        }
        else return await response.json()
    }
)

export const getPost = createAsyncThunk<IPost, number, { rejectValue: string }>(
    'posts/getPost',
    async function getPost(postId, { rejectWithValue }) {
        const response = await fetch(`http://localhost:3000/api/posts/getPost?postId=${postId}`)
        if (!response.ok) {
            return rejectWithValue('Failed to get updated post')
        }
        else return await response.json()
    }
)

export default postSlice.reducer