import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import ProfileIcon from './ProfileIcon';
import '../styles/Profil.css';  // Ensure this path is correct
import {
  getUserByUsername,
  getPostsByUser,
  getUserFollowers,
  getUserFollowing,
  getUserById,
  followUser,
  unfollowUser,
  updateFirstName,
  updateLastName,
  updateBio,
  getCoursesByTeacher,  // Add this import
} from '../API/users';
import { getLoggedInUser } from '../API/auth';

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('posts');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [courses, setCourses] = useState([]); // Add this state
  
  const userData = JSON.parse(localStorage.getItem('user'));
  const accessToken = userData ? userData.access : null;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUser = await getUserByUsername(username, accessToken);
        if (!fetchedUser) {
          throw new Error('Failed to fetch user by username');
        }
      
        setUser(fetchedUser);
        setFirstName(fetchedUser.first_name || '');
        setLastName(fetchedUser.last_name || '');
        setBio(fetchedUser.bio || '');
  
        const loggedInUser = await getLoggedInUser(accessToken);
        if (!loggedInUser) {
          throw new Error('Failed to fetch logged-in user');
        }
        setIsOwnProfile(loggedInUser.username === username);
  
        if (loggedInUser.username !== username) {
          const followingUsers = await getUserFollowing(loggedInUser.id, accessToken);
          if (!followingUsers) {
            throw new Error('Failed to fetch following users');
          }
          const isFollowingUser = followingUsers.some(followedUser => followedUser.followed_user === fetchedUser.id);
          setIsFollowing(isFollowingUser);
        }

        // Fetch courses if the user is a teacher
        if (fetchedUser.is_teacher) {
          const userCourses = await getCoursesByTeacher(fetchedUser.id, accessToken);
          setCourses(userCourses);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
  
    fetchData();
  }, [username, accessToken, navigate]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userPosts = await getPostsByUser(username, accessToken);
        setPosts(userPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user posts:', error.message);
        navigate('/in');
      }
    };

    fetchData();
  }, [username, accessToken, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const userFollowers = await getUserFollowers(user.id, accessToken);
          const followerDetails = await Promise.all(userFollowers.map(async (follower) => {
            const userDetails = await getUserById(follower.follower, accessToken);
            return { ...follower, user: userDetails };
          }));
          setFollowers(followerDetails);

          const userFollowing = await getUserFollowing(user.id, accessToken);
          const followingDetails = await Promise.all(userFollowing.map(async (followedUser) => {
            const userDetails = await getUserById(followedUser.followed_user, accessToken);
            return { ...followedUser, user: userDetails };
          }));
          setFollowing(followingDetails);
        }
      } catch (error) {
        console.error('Error fetching followers and following:', error.message);
        navigate('/in');
      }
    };

    fetchData();
  }, [user, accessToken, navigate]);

  const handleFollowToggle = async () => {
    try {
      if (!user || !user.id) {
        console.error('User ID is invalid.');
        return;
      }

      if (isFollowing) {
        const unfollowResponse = await unfollowUser(user.id, accessToken);
        setIsFollowing(false);
      } else {
        const followResponse = await followUser(user.id, accessToken);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error.message);
    }
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const formatRelativeDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleUpdateFirstName = async () => {
    try {
      const updatedUser = await updateFirstName(user.id, firstName, accessToken);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating first name:', error.message);
    }
  };

  const handleUpdateLastName = async () => {
    try {
      const updatedUser = await updateLastName(user.id, lastName, accessToken);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating last name:', error.message);
    }
  };

  const handleUpdateBio = async () => {
    try {
      const updatedUser = await updateBio(user.id, bio, accessToken);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating bio:', error.message);
    }
  };

  const handleSaveChanges = () => {
    handleUpdateFirstName();
    handleUpdateLastName();
    handleUpdateBio();
    setIsEditingProfile(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="top-section">
          <ProfileIcon firstName={user?.first_name} lastName={user?.last_name} />
          <div className="name-and-username">
            {isEditingProfile ? (
              <>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </>
            ) : (
              <>
                <h1>{user?.first_name} {user?.last_name}</h1>
                <p className="username">@{user?.username}</p>
              </>
            )}
          </div>
        </div>
        {isEditingProfile ? (
          <div className="edit-profile-section">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
            />
            <div className="button-container">
              <button className="btn save-changes-btn" onClick={handleSaveChanges}>Save Changes</button>
              <button className="btn cancel-edit-btn" onClick={() => setIsEditingProfile(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <p className="bio">{user?.bio}</p>
            <div className="button-container">
              {isOwnProfile ? (
                <button className="btn edit-profile-btn" onClick={() => setIsEditingProfile(true)}>Edit Profile</button>
              ) : (
                <>
                  <button className="btn follow-btn" onClick={handleFollowToggle}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                  <button className="btn message-btn">Message</button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div className="tabs-container">
        <button className={`tab ${selectedTab === 'posts' ? 'active' : ''}`} onClick={() => handleTabClick('posts')}>Posts</button>
        <button className={`tab ${selectedTab === 'following' ? 'active' : ''}`} onClick={() => handleTabClick('following')}>Following</button>
        <button className={`tab ${selectedTab === 'followers' ? 'active' : ''}`} onClick={() => handleTabClick('followers')}>Followers</button>
        {user?.is_teacher && (
          <button className={`tab ${selectedTab === 'courses' ? 'active' : ''}`} onClick={() => handleTabClick('courses')}>Courses</button>
        )}
      </div>

      {selectedTab === 'posts' && (
        <div className="posts-container">
          {loading ? (
            <p>Loading...</p>
          ) : posts.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <ProfileIcon firstName={user?.first_name} lastName={user?.last_name} />
                  <div className="post-info">
                    <h3>{user?.first_name} {user?.last_name}</h3>
                    <p className="username">@{user?.username}</p>
                    <p className="post-date">{formatRelativeDate(post.created)}</p>
                  </div>
                </div>
                <div className="post-content">
                  <p>{post.text}</p>
                  {post.image && <img src={post.image} alt="Post visual" />}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedTab === 'followers' && (
        <div className="followers-container">
          {followers.length === 0 ? (
            <p>No followers found.</p>
          ) : (
            followers.map(follower => (
              <div key={follower.id} className="follower-card">
                <ProfileIcon firstName={follower.user?.first_name} lastName={follower.user?.last_name} />
                <div className="follower-info">
                  <h3>{follower.user?.first_name} {follower.user?.last_name}</h3>
                  <p className="username">@{follower.user?.username}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedTab === 'following' && (
        <div className="following-container">
          {following.length === 0 ? (
            <p>Not following anyone.</p>
          ) : (
            following.map(followedUser => (
              <div key={followedUser.id} className="following-card">
                <ProfileIcon firstName={followedUser.user?.first_name} lastName={followedUser.user?.last_name} />
                <div className="following-info">
                  <h3>{followedUser.user?.first_name} {followedUser.user?.last_name}</h3>
                  <p className="username">@{followedUser.user?.username}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedTab === 'courses' && user?.is_teacher && (
        <div className="courses-container">
          {courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            courses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
