import { nanoid } from "nanoid"
import { useAppSelector } from "../../hooks"

export default function AlbumComp() {
    const photos = useAppSelector(state => state.photosStore.photosList)

    return (
        <div>
            <h4>Альбом</h4>
            <ul>
                {photos.map(photo => {
                    return (
                        <li key={nanoid()}>
                            <img src={URL.createObjectURL(photo)} alt={photo.name} />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}