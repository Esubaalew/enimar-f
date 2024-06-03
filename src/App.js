
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import StudentSignUp from './Components/StudentSignUp';
import TeacherSignUp from './Components/TeacherSignUp';
import SignIn from './Components/SignIn'
import Guest from './Components/Guest';
import ProfilePage from './Components/ProfilePage';
import ProfileList from './Components/ProfileList';



function App() {
  return (
    <Router>
    <Routes>
    <Route path="/in" element={ <SignIn/>} />
    <Route path="/user/:username" element={<ProfilePage />} />
    <Route path="/StudentSignUp"element={<StudentSignUp/>} />
    <Route path="/TeacherSignUp"element={<TeacherSignUp/>} />
    <Route path="/community"element={<ProfileList/>} />
    <Route path="/" element={<Guest/>}/>
    </Routes>
     </Router>
  );
}

export default App;
