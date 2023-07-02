import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Profile from "./pages/Profile";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import PeoplePage from "./pages/PeoplePage";
import FriendRequestsPage from "./pages/FriendRequestsPage";
import FriendsPage from "./pages/FriendsPage";
import NewsPage from "./pages/NewsPage";
import ChatsListPage from "./pages/ChatsListPage";
import ChatPage from "./pages/ChatPage";
import TestPage from "./pages/TestPage";

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
                element: <Profile />,
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
    },
    {
        path: '/testPage',
        element: <TestPage />
    }
])