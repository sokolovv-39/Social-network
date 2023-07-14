import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks'
import { backgroundAuth } from './redux/userGlobalSlice'
import AppWrapper from './AppWrapper'

export default function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const socket = useAppSelector(state => state.socketStore.socket)
  const userID = useAppSelector(state => state.userGlobal.global.id)

  useEffect(() => {
    (async function () {
      const response = await dispatch(backgroundAuth())
      if (!response.payload) {
        navigate('/signIn')
      }
      //@ts-ignore
      else navigate(`/profile/${response!.payload!.id}`)
    })()
  }, [])
  useEffect(() => {
    return () => {
      if (socket && userID) {
        //@ts-ignore
        socket.emit('user:offline', userID)
        //@ts-ignore
        socket.disconnect()
      }
    }
  }, [socket, userID])

  return (
    <div>
      <AppWrapper />
    </div>
  )
}