import PersonCard from '../PersonCardComp/PersonCardComp'
import { useAppSelector } from '../../hooks'

const FriendRequestsComp: React.FC = () => {
    const reqList = useAppSelector(state => state.friendsRequests.friendsReqList)

    return (
        <div>
            <ul>
                {reqList.map((friend) => {
                    if (friend.isSeen !== true) {
                        return (
                            <li key={friend.id}>
                                <PersonCard name={friend.name} surname={friend.surname} id={friend.id} type={friend.isSeen === null ? 'inRequest' : 'outRequest'} isOnline={friend.isOnline} />
                            </li>
                        )
                    }
                })}
            </ul>
        </div>
    )
}

export default FriendRequestsComp