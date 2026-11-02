import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostList from './PostList';
import BlogPostForm from './BlogPostForm';
import SignIn from './SignIn';
import SignUp from './SignUp';

axios.defaults.withCredentials = true;

function App() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [view, setView] = useState('home');

    useEffect(() => {
        fetchPosts();
        axios.get('http://localhost:8000/api/me').then(res => setUser(res.data));
    }, []);

    const fetchPosts = () => {
        axios.get('http://localhost:8000/api/blogs').then(res => setPosts(res.data));
    };

    const handleSignout = () => {
        axios.post('http://localhost:8000/api/signout').then(() => {
            setUser(null);
            setView('home');
            fetchPosts();
        });
    };

    return (
        <div className="wrap">
            <div className="topbar">
                <h1>My Blog</h1>
                <div className="authinfo">
                    {user ? (
                        <>
                            <span>Signed in as <strong>{user.name}</strong></span>
                            <button onClick={handleSignout} className="authlink">Sign out</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setView('signin')} className="authlink">Sign in</button>
                            <button onClick={() => setView('signup')} className="authlink">Sign up</button>
                        </>
                    )}
                </div>
            </div>

            {view === 'signin' && <SignIn setUser={setUser} setView={setView} />}
            {view === 'signup' && <SignUp setView={setView} />}
            
            {view === 'home' && (
                <>
                    {user && <BlogPostForm fetchPosts={fetchPosts} />}
                    <PostList posts={posts} user={user} fetchPosts={fetchPosts} />
                </>
            )}
        </div>
    );
}

export default App;
