
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import './App.css';
import StudentSignUp from './Components/StudentSignUp';
import TeacherSignUp from './Components/TeacherSignUp';
import SignIn from './Components/SignIn'
import Guest from './Components/Guest';


function App() {
  return (
    <Router>

    <Routes>

    <Route path="/in" element={ <SignIn/>} />
    <Route path="/StudentSignUp"element={<StudentSignUp/>} />
    <Route path="/TeacherSignUp"element={<TeacherSignUp/>} />
    <Route path="/" element={<Guest/>}/>
    </Routes>
     </Router>
  );
}

export default App;
