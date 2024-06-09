import React, { useEffect, useState } from 'react';
import '../styles/Courses.css';
import { getAllCourses } from '../API/courses';
import { getUserById, getCoursesEnrolledByStudent } from '../API/users'; // Import getCoursesEnrolledByStudent
import { initializePayment, verifyPayment } from '../API/pay';
import { getLoggedInUser } from '../API/auth';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]); // New state for enrolled courses
  const [selectedCourse, setSelectedCourse] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [loggedInUser, setLoggedInUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('recommended'); // State for active tab
  const [paymentDetails, setPaymentDetails] = useState(null);
  
  const accessToken = JSON.parse(localStorage.getItem('user')).access;
  const backendUrl = 'http://localhost:8000';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseData = await getAllCourses(accessToken);
        const coursePromises = courseData.map(async (course) => {
          const teacherData = await getUserById(course.teacher, accessToken);
          return { ...course, teacher: teacherData };
        });
        const coursesWithTeachers = await Promise.all(coursePromises);
        setCourses(coursesWithTeachers);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();

    const fetchUser = async () => {
      try {
        const user = await getLoggedInUser(accessToken);
        setLoggedInUser(user);

        // Fetch enrolled courses for the logged-in user
        const enrolledCoursesData = await getCoursesEnrolledByStudent(user.id, accessToken);
        setEnrolledCourses(enrolledCoursesData);
      } catch (error) {
        console.error('Error fetching logged-in user or enrolled courses:', error);
      }
    };

    fetchUser();
  }, [accessToken]);

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const proceedToPayment = async () => {
    try {
      const paymentData = {
        amount: selectedCourse.price,
        course: selectedCourse.id,
      };
  
      const response = await initializePayment(paymentData, accessToken);
      
      if (response && response.checkout_url) {
        const { checkout_url } = response;
        window.location.href = checkout_url;
        verifyPayment(response.tx_ref, accessToken).then((paymentStatus) => {  
            setPaymentDetails(paymentStatus);
            }).catch((error) => {
                console.error('Error verifying payment:', error);
                });
      } else {
        console.error('Error: Invalid response or missing checkout URL.');
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
    }
  };

  // Filter out enrolled courses from all courses
  const recommendedCourses = courses.filter(course => {
    // Check if the course is not in the enrolled courses list
    return !enrolledCourses.some(enrolledCourse => enrolledCourse.id === course.id);
  });

  return (
    <div className="courses-container">
      <h1>Explore Our Courses</h1>
      <p>Find the perfect course to expand your knowledge and skills.</p>
      <div className="tabs">
        <button onClick={() => setActiveTab('recommended')} className={activeTab === 'recommended' ? 'active' : ''}>
          Recommended Courses
        </button>
        <button onClick={() => setActiveTab('enrolled')} className={activeTab === 'enrolled' ? 'active' : ''}>
          Enrolled Courses
        </button>
      </div>
      <div className="courses-grid">
        {activeTab === 'recommended' && recommendedCourses.map((course) => (
          <div className="course-card" key={course.id}>
            <div className="course-poster">
              <img src={course.poster} alt={course.title} />
            </div>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p className="course-price">ETB{course.price}</p>
            <p className="course-teacher">By {course.teacher.first_name} {course.teacher.last_name}</p>
            <button className="enroll-button" onClick={() => handleEnrollClick(course)}>Enroll</button>
          </div>
        ))}
        {activeTab === 'enrolled' && enrolledCourses.map((course) => (
          <div className="enrolled-course-card" key={course.id}>
            <div className="enrolled-course-poster">
              <img src={`${backendUrl}${course.poster}`}  alt={course.title} />
            </div>
            <div className="enrolled-course-details">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p className="course-price">ETB{course.price}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedCourse && loggedInUser && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Confirm Enrollment</h2>
            <p>You are about to enroll in {selectedCourse.title}.</p>
            <p>Price: ETB{selectedCourse.price}</p>
            <p>Logged-in User: {loggedInUser.email}</p>
            <button className="confirm-enroll-button" onClick={proceedToPayment}>Proceed to Payment</button>
          </div>
        </div>
      )}

      {paymentDetails && (
        <div className="payment-details">
          <h2>Payment Details</h2>
          <p>Status: {paymentDetails.status}</p>
          <p>Message: {paymentDetails.message}</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
