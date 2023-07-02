import { configureStore } from '@reduxjs/toolkit'
import userGlobalReducer from './userGlobalSlice'
import friendsRequestsReducer from './friendsRequestsSlice'
import peopleGlobalReducer from './peopleGlobalSlice'
import postsReducer from './postsSlice'
import socketStoreSliceReducer from './socketSlice'
import chatsSliceReducer from './chatsSlice'

const store = configureStore({
    reducer: {
        userGlobal: userGlobalReducer,
        friendsRequests: friendsRequestsReducer,
        peopleGlobal: peopleGlobalReducer,
        posts: postsReducer,
        socketStore: socketStoreSliceReducer,
        chatsGlobal: chatsSliceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch