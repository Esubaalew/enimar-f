import '../styles/Guest.css';
import guestImage from '../assets/images/guestL.jpeg';
import { useNavigate } from 'react-router-dom';

const Guest = () => {
    const navigate = useNavigate();
    const handleSSignUp = () => {
      navigate('/StudentSignUp');
    };
    const handleTSignUp = () => {
        navigate('/TeacherSignUp');
        }

  return (
    <div className="guest-container">
      <header className="guest-header">
        <div className="logo">Enimar Code Learning</div>
        <nav className="nav-links">
          <button className="btn-signin">Sign In</button>
          <button className="btn-signup">Sign Up</button>
        </nav>
      </header>

      <section className="intro-section">
        <div className="intro-content">
          <div className="intro-text">
            <h1>Unlock Your Coding Potential</h1>
            <p>
              Join our vibrant community of developers and share your ideas, learn
              from experts, and bring your projects to life.
            </p>
            <div className="buttons">
              <button className="btn-primary" onClick={handleSSignUp}>Learn Today</button>
              <button className="btn-secondary" onClick={handleTSignUp} >Start Teaching</button>
            </div>
          </div>
          <div className="intro-image">
            <img src={guestImage} alt="Coding community" />
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features">
          <div className="feature">
            <h3>Learn to Code</h3>
            <p>Explore a wide range of coding tutorials and resources to expand your skills.</p>
          </div>
          <div className="feature">
            <h3>Share Your Ideas</h3>
            <p>Collaborate with like-minded individuals and bring your innovative ideas to life.</p>
          </div>
          <div className="feature">
            <h3>Accelerate Your Growth</h3>
            <p>Unlock new opportunities and propel your coding career forward.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guest;
