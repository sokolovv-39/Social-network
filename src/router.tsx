import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import PeoplePage from "./pages/PeoplePage/PeoplePage";
import FriendRequestsPage from "./pages/FriendRequestsPage/FriendRequestsPage";
import FriendsPage from "./pages/FriendsPage/FriendsPage";
import NewsPage from "./pages/NewsPage/NewsPage";
import ChatsListPage from "./pages/ChatsListPage/ChatsListPage";
import ChatPage from "./pages/ChatPage/ChatPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: 'signUp',
                element: <SignUpPage />
            },
            {
                path: 'profile/:userId',
                element: <ProfilePage />,
            },
            {
                path: 'profile/:userId/people',
                element: <PeoplePage />
            },
            {
                path: 'profile/:userId/friendRequests',
                element: <FriendRequestsPage />
            },
            {
                path: 'signIn',
                element: <SignInPage />
            },
            {
                path: 'profile/:userId/friends',
                element: <FriendsPage />
            },
            {
                path: 'profile/:userId/news',
                element: <NewsPage />
            },
            {
                path: 'profile/:userId/chats/',
                element: <ChatsListPage />,
            },
            {
                path: 'profile/:userId/chats/:chatId',
                element: <ChatPage />
            }
        ]
    }
])