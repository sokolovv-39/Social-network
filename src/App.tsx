import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks'
import { backgroundAuth } from './redux/userGlobalSlice'
import AppWrapperComp from './components/AppWrapperComp/AppWrapperComp'
import classes from './App.module.scss'

export default function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const socket = useAppSelector(state => state.socketStore.socket)
  const userID = useAppSelector(state => state.userGlobal.global.id)

  useEffect(() => {
    console.log('background auth');
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
    <div className={classes.Wrapper}>
      <AppWrapperComp />
    </div>
  )
}