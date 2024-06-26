
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import StudentSignUp from './Components/StudentSignUp';
import TeacherSignUp from './Components/TeacherSignUp';
import Guest from './Components/Guest';
import ProfilePage from './Components/ProfilePage';
import ProfileList from './Components/ProfileList';
import Home from './Components/Home';
import CourseDashboard from './Components/CourseDashboard';
import NotFound from './Components/NotFound';
import StudentCourseView from './Components/StudentCourseView';
import Courses from './Components/Courses';
import TeacherCourses from './Components/TeacherCourses';
import Unauthorized from './Components/Unauthorized';
import ChatList from './Components/ChatList'
import CreateGroupChat from './Components/CreateGroupChat';
import CreatePrivateChat from './Components/CreatePrivateChat';
import GroupChat from './Components/GroupChat';
import PrivateChat from './Components/PrivateChat';
import Reset from './Components/Reset';
import MakePass from './Components/MakePass';
import { Analytics } from "@vercel/analytics/react"
import SignIn from './Components/Sign';
import SettingsPage from './Components/SettingsPage';
import Notifications from './Components/Notifications';
import HelpCenter from './Components/HelpCenter';


function App() {
  return (
    <>
    <Analytics/>
    <Router>
    <Routes>
    <Route path="/in" element={ <SignIn/>} />
    <Route path="/chat" element={<ChatList/>}/>
    <Route path='/group-chat/:groupId' element={<GroupChat />} />
    <Route path='/private-chat/:userId' element={<PrivateChat />} />
    <Route path='/create-group-chat' element={<CreateGroupChat />} />
    <Route path='/create-private-chat' element={<CreatePrivateChat />} />
    <Route path="/coursesS" element={<Courses/>} />
    <Route path="/user/:username" element={<ProfilePage />} />
    <Route path="/StudentSignUp"element={<StudentSignUp/>} />
    <Route path="/TeacherSignUp"element={<TeacherSignUp/>} />
    <Route path="/community"element={<ProfileList/>} />
    <Route path="/" element={<Guest/>}/>
    <Route path="/home" element={<Home/>} />
    <Route path="/course/:id/edit" element={<CourseDashboard />} />
    <Route path="/course/:id/learn" element={<StudentCourseView />} />
    <Route path="/coursesT" element={<TeacherCourses />} />
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path='/reset' element={<Reset />} />
    <Route path='/password-reset-confirm/:uidb64/:token' element={<MakePass />} />
    <Route path='/notifications' element={<Notifications />} />
    <Route path='/settings' element={<SettingsPage />} />
    <Route path='/help' element={<HelpCenter />} />
    <Route path="*" element={<NotFound />} />
    </Routes>
    </Router>
     </>
  );
}

export default App;