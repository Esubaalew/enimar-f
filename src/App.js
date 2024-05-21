
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import StudentSignUp from './Components/StudentSignUp';
import TeacherSignUp from './Components/TeacherSignUp';
import CreatePost from './Components/CreatePost';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/StudentSignUp" element={<StudentSignUp />} />
        <Route path="/TeacherSignUp" element={<TeacherSignUp />} />
        <Route path="/createPost" element={<CreatePost/>} />

      </Routes>
    </Router>
  );
}

export default App;
