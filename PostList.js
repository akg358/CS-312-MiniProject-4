import React, { useState } from 'react';
import axios from 'axios';

function PostList({ posts, user, fetchPosts }) {
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editBody, setEditBody] = useState('');

    const handleDelete = (id) => {
        if (window.confirm('Delete?')) {
            axios.delete(`http://localhost:8000/api/blogs/${id}`).then(() => fetchPosts());
        }
    };

    const startEdit = (post) => {
        setEditingId(post.blog_id);
        setEditTitle(post.title);
        setEditBody(post.body);
    };

    const saveEdit = (id) => {
        axios.put(`http://localhost:8000/api/blogs/${id}`, { postTitle: editTitle, postBody: editBody })
        .then(() => {
            setEditingId(null);
            fetchPosts();
        });
    };

    return (
        <div>
            {posts.map(post => (
                <div className="card" key={post.blog_id}>
                    {editingId === post.blog_id ? (
                        <div>
                            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                            <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows="4" />
                            <button onClick={() => saveEdit(post.blog_id)}>Save</button>
                            <button onClick={() => setEditingId(null)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <h3>{post.title}</h3>
                            <p className="meta">{post.creator_name} &middot; {new Date(post.date_created).toLocaleString()}</p>
                            <p>{post.body}</p>
                            
                            {user && user.user_id === post.creator_user_id && (
                                <div>
                                    <button className="edit" onClick={() => startEdit(post)}>Edit</button>
                                    <button className="del" onClick={() => handleDelete(post.blog_id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default PostList;