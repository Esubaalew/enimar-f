
import './App.css';
import SignIn from './components/SignIn';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
    <Routes>
      
      
    <Route path="/in" element={ <SignIn/>} />
      </Routes>
      </Router>
  );
}

export default App;
