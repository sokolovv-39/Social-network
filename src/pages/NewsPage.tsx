import React, { useEffect, useRef, useState } from 'react'
import PostComp from '../components/PostComp'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchNews } from '../redux/postsSlice'

const NewsPage: React.FC = () => {
    const news = useAppSelector(state => state.posts.newsList)
    const isNewsEnd = useAppSelector(state => state.posts.isEndNews)
    const dispatch = useAppDispatch()
    const endRef = useRef<any>(null)
    const [isFirstRender, setIsFirstRender] = useState(true)

    useEffect(() => {
        (async function () {
            if (isFirstRender) {
                await dispatch(fetchNews(-1))
                setIsFirstRender(false)
            }
        })()
    }, [])
    useEffect(() => {
        (async function () {
            if (!isNewsEnd && !isFirstRender) {
                function callback(entries: any, observer: any): void {
                    entries.forEach(async (entry: any) => {
                        if (entry.isIntersecting) {
                            await dispatch(fetchNews(entry.target.dataset.id - 1))
                            observer.unobserve(entry.target)
                        }
                    })
                }
                const options = {
                    threshold: 1,
                }
                const observer = new IntersectionObserver(callback, options)
                observer.observe(endRef.current)
            }
        })()
    })

    return (
        <div>
            <h1>Новости</h1>
            <ul>
                {news.map((post, index) => {
                    return (
                        <li key={post.id} data-id={post.id} ref={index === news.length - 1 ? endRef : null}>
                            <PostComp id={post.id} title={post.title} content={post.content} userName={post.userName}
                                userSurname={post.userSurname} likesId={post.likesId} type='news' />
                        </li>
                    )
                })}
            </ul>
            {isNewsEnd && <p>Вау! Вы долистали всю ленту до конца!</p>}
        </div>
    )
}

export default NewsPage