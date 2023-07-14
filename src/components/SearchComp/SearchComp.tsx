import React, { useState, useEffect } from 'react'
import PersonCard from '../PersonCardComp/PersonCardComp'
import { useNavigate } from 'react-router-dom'
import { IFriendReq } from '../../redux/friendsRequestsSlice'
import { useAppSelector } from '../../hooks'

type PropsType = {
    dataArr: IFriendReq[]
}

const SearchComp: React.FC<PropsType> = ({ dataArr }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredArr, setFilteredArr] = useState(dataArr)
    const [showSearch, setShowSearch] = useState(false)
    const navigate = useNavigate()
    const userId = useAppSelector(state => state.userGlobal.global.id)

    const searchData: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const normalizedQuery = searchQuery.replace(/\s/g, '').toLowerCase()
        setSearchQuery(e.currentTarget.value)
        if (e.currentTarget.value === '') setFilteredArr(dataArr)
        else {
            const modifiedArr = dataArr.filter(elem => {
                const variant1 = (elem.name! + elem.surname!).replace(/\s/g, '').toLowerCase()
                const variant2 = (elem.surname! + elem.name!).replace(/\s/g, '').toLowerCase()
                if (variant1.includes(normalizedQuery) || variant2.includes(normalizedQuery)) return true
                else return false
            })
            setFilteredArr(modifiedArr)
        }
    }

    useEffect(() => {
        setFilteredArr(dataArr)
    })

    return (
        <div>
            <input type="text" placeholder='Найди друзей для переписки!' onChange={searchData} onFocus={() => setShowSearch(true)} onBlur={(e) => {
                if (e.relatedTarget?.nodeName === 'BUTTON') {
                    const dataset = (e.relatedTarget as HTMLButtonElement).dataset
                    const urlParams = new URLSearchParams({
                        id: String(dataset.id),
                        name: String(dataset.name),
                        surname: String(dataset.surname),
                        isOnline: String(dataset.isonline)
                    })
                    navigate(`/profile/${userId}/chats/${dataset.id}?${urlParams}`)
                }
            }} />
            {showSearch && <div>
                <h6>Ваши друзья</h6>
                <ul>
                    {filteredArr.map(element => {
                        return (
                            <li key={element.id}>
                                <button data-id={element.id}
                                    data-name={element.name}
                                    data-surname={element.surname}
                                    data-isonline={element.isOnline}>
                                    <h6>{element.name} {element.surname}</h6>
                                    <p>{element.isOnline ? 'Онлайн' : 'Не онлайн'}</p>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>}
        </div>
    )
}

export default SearchComp
