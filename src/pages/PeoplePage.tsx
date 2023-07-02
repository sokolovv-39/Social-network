import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchPeople } from "../redux/peopleGlobalSlice";
import PersonCard from "../components/PersonCard";

const PeoplePage: React.FC = () => {
    const people = useAppSelector(state => state.peopleGlobal.peopleList)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchPeople())
    }, [])

    return (
        <div>
            <h1>People</h1>
            <ul>
                {people.map(person => {
                    return <li key={person.id}><PersonCard name={person.name} surname={person.surname} type="people" id={Number(person.id)} isOnline={person.isOnline} /></li>
                })}
            </ul>
        </div>
    )
}

export default PeoplePage