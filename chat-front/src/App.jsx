import './App.css';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MemberList from './pages/MemberList';
import GroupChatList from './pages/GroupChatList';
import MemberCreate from './pages/MemberCreate';
import Login from './pages/Login';
import MyChatPage from './pages/MyChatPage';
import SimpleWebsocket from './pages/SimpleWebsocket';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/member/list" element={<MemberList />} />
        <Route path="/groupchatting/list" element={<GroupChatList />} />
        <Route path="/member/create" element={<MemberCreate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my/chat/page" element={<MyChatPage />} />
        <Route path="/simple/chat" element={<SimpleWebsocket />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
