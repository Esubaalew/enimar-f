
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import './App.css';
import StudentSignUp from './Components/StudentSignUp';
import TeacherSignUp from './Components/TeacherSignUp';
import CreatePost from './Components/CreatePost';
import SignIn from './Components/SignIn'


function App() {
  return (
    <Router>
    <Routes>
      
      
    <Route path="/in" element={ <SignIn/>} />
    <Route path="/StudentSignUp"element={<StudentSignUp/>} />

    <Route path="/TeacherSignUp"element={<TeacherSignUp/>} />

      </Routes>
      </Router>
  );
}

export default App;
