import { createSlice, createAsyncThunk, current, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type PhotosStoreType = {
    photosList: File[],
    avatar: File | null
}

export type ServerFileType = {
    encoding: string,
    fieldName: string,
    mimetype: string,
    originalname: string,
    size: string,
    buffer: {
        type: string,
        data: Array<number>
    }
}

const initialState: PhotosStoreType = {
    photosList: [],
    avatar: null
}

const photosSlice = createSlice({
    name: 'photosStore',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(uploadUserPhoto.fulfilled, (state, action: PayloadAction<uploadServerPhotoType>) => {
                const fileBytes = new Uint8Array(action.payload.fileData.buffer.data)
                const fileName = action.payload.fileData.originalname
                const fileOptions = {
                    type: action.payload.fileData.mimetype
                }
                const file = new File([fileBytes], fileName, fileOptions)
                state.photosList.push(file)
                if (action.payload.isAvatar) {
                    state.avatar = file
                }
            })
            .addCase(fetchUserPhotos.fulfilled, (state, action) => {
                state.photosList = []
                state.avatar = null
                const photos = action.payload
                photos.forEach(photo => {
                    photo = {
                        isAvatar: photo.isAvatar,
                        fileData: JSON.parse(photo.fileData.toString())
                    }
                    const fileBytes = new Uint8Array(photo.fileData.buffer.data)
                    const fileName = photo.fileData.originalname
                    const fileOptions = {
                        type: photo.fileData.mimetype
                    }
                    const file = new File([fileBytes], fileName, fileOptions)
                    state.photosList.push(file)
                    if (photo.isAvatar) {
                        state.avatar = file
                    }
                })
            })
    }
})

type uploadFilePhotoType = {
    fileData: File
    isAvatar: boolean
}
type uploadServerPhotoType = {
    fileData: ServerFileType,
    isAvatar: boolean
}

export const uploadUserPhoto = createAsyncThunk<uploadServerPhotoType, uploadFilePhotoType, { rejectValue: string }>(
    'photoStore/uploadUserPhoto',
    async function uploadUserPhoto(fileObj, { rejectWithValue }) {
        const form = new FormData()
        form.append('newUserPhoto', fileObj.fileData as File)
        const response = await axios.post('http://localhost:3000/api/auth/uploadUserPhoto', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            params: {
                isAvatar: fileObj.isAvatar
            },
            withCredentials: true
        })
        if (response.status !== 200) {
            return rejectWithValue('Failed to upload photo')
        }
        else {
            const data = {
                fileData: JSON.parse(response.data.fileData.toString()),
                isAvatar: response.data.isAvatar
            }
            return data
        }
    }
)

export const fetchUserPhotos = createAsyncThunk<uploadServerPhotoType[], undefined, { rejectValue: string }>(
    'photoStore/fetchUserPhotos',
    async function fetchUserPhotos(_, { rejectWithValue }) {
        const response = await axios.get('http://localhost:3000/api/auth/getUserPhotos', {
            withCredentials: true
        })
        if (response.status !== 200) {
            rejectWithValue(`Failed to get user's photos`)
        }
        else {
            console.log('RESPONSE DATA')
            console.log(response.data)
            return response.data
        }
    }
)

export default photosSlice.reducer