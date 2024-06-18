import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import '../styles/ProfilePage.css';  
import {
  getUserByUsername,
  getPostsByUser,
  getUserFollowers,
  getUserFollowing,
  getUserById,
  updateFirstName,
  updateLastName,
  updateBio,
  getCoursesByTeacher, 
} from '../API/users';
import { addFollow, deleteFollow } from '../API/follows';
import { getLoggedInUser } from '../API/auth';
import Header from './Header';

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
  const [courses, setCourses] = useState([]);
  
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

        if (fetchedUser?.is_teacher) {
          const userCourses = await getCoursesByTeacher(fetchedUser?.username, accessToken);
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
          const userFollowers = await getUserFollowers(user?.id, accessToken);
          const followerDetails = await Promise.all(userFollowers.map(async (follower) => {
            const userDetails = await getUserById(follower.follower, accessToken);
            return { ...follower, user: userDetails };
          }));
          setFollowers(followerDetails);

          const userFollowing = await getUserFollowing(user?.id, accessToken);
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
        //eslint-disable-next-line
        const unfollowResponse = await deleteFollow(user.id, accessToken);
        setIsFollowing(false);
      } else {
        //eslint-disable-next-line
       
        const followed_user = await getUserByUsername(username, accessToken);
        console.log(followed_user);
        const followData = {followed: followed_user.id, follower: user.id}
        // eslint-disable-next-line
        const followResponse = await addFollow(followData,  accessToken);
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
    <>
      <Header />
      <div className="PPprofile-container">
        <div className="PPprofile-card">
          <div className="PPtop-section">
            <div className="PPavatar">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" />
              ) : (
                <div className="PPavatar-placeholder">
                  {user?.first_name && user?.last_name && (
                    <span>{`${user.first_name[0]}${user.last_name[0]}`}</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="PPname-and-username">
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
      <h1 className="PPname">
        {user?.first_name} {user?.last_name}
        {user?.is_teacher && (
          <span className="PPteacher-check">t &#10003;</span>
        )}
      </h1>
      <p className="PPusername">@{user?.username}</p>
    </>
  )}
</div>

          </div>
          {isEditingProfile ? (
            <div className="PPedit-profile-section">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio"
              />
              <div className="PPbutton-container">
                <button className="PPbtn PPsave-changes-btn" onClick={handleSaveChanges}>Save Changes</button>
                <button className="PPbtn PPcancel-edit-btn" onClick={() => setIsEditingProfile(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p className="PPbio">{user?.bio}</p>
              <div className="PPbutton-container">
                {isOwnProfile ? (
                  <button className="PPbtn PPedit-profile-btn" onClick={() => setIsEditingProfile(true)}>Edit Profile</button>
                ) : (
                  <>
                    <button className="PPbtn PPfollow-btn" onClick={handleFollowToggle}>
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                    <button className="PPbtn PPmessage-btn">Message</button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
  
        <div className="PPtabs-container">
          <button className={`PPtab ${selectedTab === 'posts' ? 'PPactive' : ''}`} onClick={() => handleTabClick('posts')}>Posts</button>
          <button className={`PPtab ${selectedTab === 'following' ? 'PPactive' : ''}`} onClick={() => handleTabClick('following')}>Following</button>
          <button className={`PPtab ${selectedTab === 'followers' ? 'PPactive' : ''}`} onClick={() => handleTabClick('followers')}>Followers</button>
          {user?.is_teacher && (
            <button className={`PPtab ${selectedTab === 'courses' ? 'PPactive' : ''}`} onClick={() => handleTabClick('courses')}>Courses</button>
          )}
        </div>
  
        {selectedTab === 'posts' && (
          <div className="PPposts-container">
            {loading ? (
              <p>Loading...</p>
            ) : posts.length === 0 ? (
              <p>No posts found.</p>
            ) : (
              posts.map(post => (
                <div key={post.id} className="PPpost-card">
                  <div className="PPpost-header">
                    <div className="PPavatar">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" />
                      ) : (
                        <div className="PPavatar-placeholder">
                          {user?.first_name && user?.last_name && (
                            <span>{`${user.first_name[0]}${user.last_name[0]}`}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="PPpost-info">
                      <h3>{user?.first_name} {user?.last_name}</h3>
                      <p className="PPusername">@{user?.username}</p>
                      <p className="PPpost-date">{formatRelativeDate(post.created)}</p>
                    </div>
                  </div>
                  <div className="PPpost-content">
                    <p>{post.text}</p>
                    {post.image && <img src={post.image} alt="Post visual" />}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
  
        {selectedTab === 'followers' && (
          <div className="PPfollowers-container">
            {followers.length === 0 ? (
              <p>No followers found.</p>
            ) : (
              followers.map(follower => (
                <div key={follower.id} className="PPfollower-card">
                  <div className="PPavatar">
                    {follower.user?.avatar ? (
                      <img src={follower.user.avatar} alt="Avatar" />
                    ) : (
                      <div className="PPavatar-placeholder">
                        {follower.user?.first_name && follower.user?.last_name && (
                          <span>{`${follower.user.first_name[0]}${follower.user.last_name[0]}`}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="PPfollower-info">
                    <h3>{follower.user?.first_name} {follower.user?.last_name}</h3>
                    <p className="PPusername">@{follower.user?.username}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
  
        {selectedTab === 'following' && (
          <div className="PPfollowing-container">
            {following.length === 0 ? (
              <p>Not following anyone.</p>
            ) : (
              following.map(followedUser => (
                <div key={followedUser.id} className="PPfollowing-card">
                  <div className="PPavatar">
                    {followedUser.user?.avatar ? (
                      <img src={followedUser.user.avatar} alt="Avatar" />
                    ) : (
                      <div className="PPavatar-placeholder">
                        {followedUser.user?.first_name && followedUser.user?.last_name && (
                          <span>{`${followedUser.user.first_name[0]}${followedUser.user.last_name[0]}`}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="PPfollowing-info">
                    <h3>{followedUser.user?.first_name} {followedUser.user?.last_name}</h3>
                    <p className="PPusername">@{followedUser.user?.username}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
  
        {selectedTab === 'courses' && user?.is_teacher && (
          <div className="PPcourses-container">
            {courses.length === 0 ? (
              <p>No courses found.</p>
            ) : (
              courses.map(course => (
                <div key={course.id} className="PPcourse-card">
                  <div className="PPcourse-info">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
  
};

export default ProfilePage;
