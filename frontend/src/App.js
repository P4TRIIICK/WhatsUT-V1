import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';
import ChatProvider from './Context/ChatProvider';

function App() {
  return (
    <div className="App">
      <Router>
        <ChatProvider>
          <Route path="/" component={Homepage} exact />
          <Route path="/chats" component={ChatPage} />
        </ChatProvider>
      </Router>
    </div>
  );
}

export default App;
