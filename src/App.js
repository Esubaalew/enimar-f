
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import './App.css';
import StudentSignUp from './Components/StudentSignUp';
import TeacherSignUp from './Components/TeacherSignUp';
import CreatePost from './Components/CreatePost';
import SignIn from './components/SignIn';


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
