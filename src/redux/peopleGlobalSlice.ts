import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type IPeople = {
    peopleList: IPeopleList[]
}
type IPeopleList = {
    id: number | null,
    name: string | null,
    surname: string | null,
    isOnline: boolean
}

const initialState: IPeople = {
    peopleList: []
}

export const fetchPeople = createAsyncThunk<IPeopleList[], undefined, { rejectValue: string }>(
    "peopleGlobal/fetch",
    async function fetchPeople(_, { rejectWithValue }) {
        const response = await fetch('http://localhost:3000/api/people/getPeople', {
            credentials: 'include'
        })
        if (!response.ok) {
            rejectWithValue('Failed to upload people')
        }
        else {
            return await response.json()
        }
    }
)

const peopleGlobalSlice = createSlice({
    name: "peopleGlobal",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPeople.fulfilled, (state, action) => {
                state.peopleList = action.payload
            })
    }
})

export default peopleGlobalSlice.reducer