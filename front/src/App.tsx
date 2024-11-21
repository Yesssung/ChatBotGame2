import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/chat/:genre" element={<ChatWindow />} />
            </Routes>
        </Router>
    );
};

export default App;
