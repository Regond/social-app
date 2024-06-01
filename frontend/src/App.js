import { createBrowserRouter, RouterProvider, Outlet,Navigate, } from "react-router-dom";
import { useContext } from "react";

import Login from './pages/userLogin/userLogin.jsx';
import Register from './pages/userRegister/userRegister.jsx';
import LeftBar from './components/leftBar/leftbar.jsx';
import RightBar from './components/rightBar/rightbar.jsx';
import Navbar from './components/nav/nav.jsx';
import Home from './pages/userHome/userHome.jsx';
import Profile from './pages/userProfile//userProfile';
import Chats from './pages/userChats/userChat.jsx';
import Group from './pages/userGroup/userGroup.jsx';
import Groups from './pages/groups/groups.jsx';
import {AuthContext} from  './components/auth.js';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

const App = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <div>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar user={currentUser} />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar user={currentUser} />
        </div>
      </div>
    );
  };

  const ProtectFromUnauth = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectFromUnauth>
          <Layout />
        </ProtectFromUnauth>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/group/:id",
          element: <Group />,
        },
        {
          path: "/groups",
          element: <Groups />,
        },
      ],
    },
    {
      path: "/login",
      element: currentUser ? <Navigate to="/" /> : <Login />,
    },
    {
      path: "/chats",
      element: <Chats user={currentUser} />,
    },
    {
      path: "/register",
      element: currentUser ? <Navigate to="/" /> : <Register />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  );
};

export default App;

