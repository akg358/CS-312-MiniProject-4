import React, { useState } from 'react';
import axios from 'axios';

function BlogPostForm({ fetchPosts }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/blogs', { postTitle: title, postBody: body })
        .then(() => {
            setTitle('');
            setBody('');
            fetchPosts();
        });
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows="4" placeholder="Type" required />
            <button type="submit">Post</button>
        </form>
    );
}

export default BlogPostForm;