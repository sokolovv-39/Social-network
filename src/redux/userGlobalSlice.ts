import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

type IAuthResponse = {
    name: string | null,
    surname: string | null,
    token: string | null,
    email: string | null,
    id: number | null
}
export type IUserRegisterInput = {
    name: string | null,
    surname: string | null,
    email: string | null,
    password: string | null
}
type IUserGlobal = IAuthResponse & {
    isSignIn: boolean,
    loading: boolean,
    error: string | null,
    currentPath: string | null
}
export type IUserAuthInput = {
    email: string,
    password: string
}
type IUserState = {
    global: IUserGlobal
}


export const authenticateUser = createAsyncThunk<IAuthResponse, IUserAuthInput, { rejectValue: string }>(
    "userGlobal/authenticate",
    async function authUser(userAuthInput, { rejectWithValue }) {
        const response = await fetch('http://localhost:3000/api/auth/authenticate',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(userAuthInput)
            })
        if (response.status === 401) {
            return rejectWithValue("Authentication failed!")
        }
        else if (!response.status) {
            return rejectWithValue("Internal server error")
        }
        else {
            return (await response.json())
        }
    }
)
export const registerRequest = createAsyncThunk<IAuthResponse, IUserRegisterInput, { rejectValue: string }>(
    "userGlobal/register",
    async function register(input, { rejectWithValue }) {
        const response = await fetch('http://localhost:3000/api/auth/registerUser',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(input)
            })
        if (!response.ok) {
            return rejectWithValue('Sorry. Internal server error')
        }
        return (await response.json())
    }
)
export const backgroundAuth = createAsyncThunk<IAuthResponse, undefined, { rejectValue: boolean }>(
    "userGlobal/backgroundAuth",
    async function backgroundAuth(_, { rejectWithValue }) {
        const response = await fetch('http://localhost:3000/api/auth/backgroundAuth', {
            credentials: 'include'
        })
        if (!response.ok) {
            return rejectWithValue(false)
        }
        return (await response.json())
    }
)
export const localExit = createAsyncThunk<undefined, undefined, { rejectValue: string }>(
    "userGlobal/localExit",
    async function localExit(_, { rejectWithValue }) {
        const response = await fetch('http://localhost:3000/api/auth/localExit', {
            credentials: 'include'
        })
        if (!response.ok) {
            return rejectWithValue('Failed to local exit')
        }
    }
)

const initialState: IUserState = {
    global: {
        name: null,
        surname: null,
        token: null,
        isSignIn: false,
        loading: false,
        error: null,
        email: null,
        id: null,
        currentPath: null
    }
}

const userGlobalSlice = createSlice({
    name: 'userGlobal',
    initialState,
    reducers: {
        startLoading(state) {
            state.global.loading = true
        },
        endLoading(state) {
            state.global.loading = false
        },
        setError(state, action) {
            state.global.error = action.payload
        },
        currentPathViewer(state, action) {
            state.global.currentPath = action.payload
            console.log('********CURRENT PATH**********')
            console.log(state.global.currentPath)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerRequest.pending, (state) => {
                state.global.loading = true
                state.global.error = null
            })
            .addCase(registerRequest.fulfilled, (state, action) => {
                state.global = {
                    ...action.payload,
                    error: null,
                    isSignIn: true,
                    loading: false,
                    currentPath: window.location.href
                }
            })
            .addCase(registerRequest.rejected, (state, action) => {
                state.global.loading = false
                state.global.error = action.payload as string
            })
            .addCase(authenticateUser.pending, (state) => {
                state.global.error = null
                state.global.loading = true
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
                state.global = {
                    ...action.payload,
                    error: null,
                    isSignIn: true,
                    loading: false,
                    currentPath: window.location.href
                }
            })
            .addCase(authenticateUser.rejected, (state, action) => {
                state.global.error = action.payload as string
                state.global.loading = false
            })
            .addCase(backgroundAuth.fulfilled, (state, action) => {
                state.global = {
                    ...action.payload,
                    error: null,
                    isSignIn: true,
                    loading: false,
                    currentPath: window.location.href
                }
                console.log('background auth processed')
                console.log(state)
            })
            .addCase(localExit.fulfilled, (state) => {
                state = initialState
            })
    }

})

export const { startLoading, endLoading, setError, currentPathViewer } = userGlobalSlice.actions

export default userGlobalSlice.reducer