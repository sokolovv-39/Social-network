import { PayloadAction, createAsyncThunk, createSlice, current } from "@reduxjs/toolkit"
import { ServerFileType } from "./photosSlice"

type IPost = {
    id?: number,
    title: string,
    content: string,
    userName?: string,
    userSurname?: string,
    likesId?: [],
    photoData?: Array<File> | null,
    name?: string
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
            .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<IPost[]>) => {
                state.postsList = []
                action.payload.forEach(post => {
                    if (!post.photoData) {
                        state.postsList.push({
                            ...post,
                            photoData: []
                        })
                    }
                    else {
                        let files: Array<File> = []
                        //@ts-ignore
                        const serverFilesArr = JSON.parse(post.photoData)
                        serverFilesArr.forEach((serverFile: ServerFileType) => {
                            const fileBytes = new Uint8Array(serverFile.buffer.data)
                            const fileName = serverFile.originalname
                            const fileOptions = {
                                type: serverFile.mimetype
                            }
                            files.push(new File([fileBytes], fileName, fileOptions))
                        })
                        state.postsList.push({
                            ...post,
                            photoData: files
                        })
                    }
                })
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
        const formData = new FormData()
        formData.append('title', postData.title)
        formData.append('content', postData.content)
        console.log(postData.photoData)
        if (postData.photoData) {
            console.log('is true')
            postData.photoData.forEach(file => {
                formData.append('photo', file)
            })
        }
        console.log('FILES FROM STORE')
        console.log(formData.getAll('photo'))
        const response = await fetch('http://localhost:3000/api/posts/publishPost', {
            method: 'POST',
            credentials: 'include',
            body: formData
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