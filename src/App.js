
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import StudentSignUp from './Components/StudentSignUp';
import TeacherSignUp from './Components/TeacherSignUp';
import SignIn from './Components/SignIn'
import Guest from './Components/Guest';
import ProfilePage from './Components/ProfilePage';
import ProfileList from './Components/ProfileList';
import Home from './Components/Home';
import CourseDashboard from './Components/CourseDashboard';
import NotFound from './Components/NotFound';



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
    <Route path="/home" element={<Home/>} />
    <Route path="/course/:id/edit" element={<CourseDashboard />} />
    <Route path="*" element={<NotFound />} />
    </Routes>
     </Router>
  );
}

export default App;
