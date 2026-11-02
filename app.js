// loading express library
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const db = require('./db');

// allows react to talk to backend
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// lets us read form data
app.use(express.urlencoded({ extended: true }));
// lets us read json data
app.use(express.json()); 

// KEEPS track of who is signed in
app.use(session({
    secret: 'blog-secret',
    resave: false,
    saveUninitialized: false
}));

// checks who is logged in
app.get('/api/me', (req, res) => {
    res.json(req.session.user || null);
});

// shows all the posts on the home page for users
app.get('/api/blogs', async (req, res) => {
    const result = await db.query('SELECT * FROM blogs ORDER BY blog_id DESC');
    res.json(result.rows);
});

// runs when someone starts to make post
app.post('/api/blogs', async (req, res) => {
    // have to be logged in to post
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });

    await db.query(
        'INSERT INTO blogs (creator_name, creator_user_id, title, body) VALUES ($1, $2, $3, $4)',
        [req.session.user.name, req.session.user.user_id, req.body.postTitle, req.body.postBody]
    );
    res.json({ success: true }); // go back to homepage after posting
});

// handles saving the edited post
app.put('/api/blogs/:id', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });

    // double check they own it
    const check = await db.query('SELECT * FROM blogs WHERE blog_id = $1', [req.params.id]);
    const post = check.rows[0];

    // CAN only edit your own posts
    if (post && post.creator_user_id === req.session.user.user_id) {
        await db.query(
            'UPDATE blogs SET title = $1, body = $2, date_created = CURRENT_TIMESTAMP WHERE blog_id = $3',
            [req.body.postTitle, req.body.postBody, req.params.id]
        );
        res.json({ success: true });
    } else {
        res.status(403).json({ error: 'Not authorized' });
    }
});

// gets rid of post through id
app.delete('/api/blogs/:id', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });

    // CAN only delete your own posts
    await db.query(
        'DELETE FROM blogs WHERE blog_id = $1 AND creator_user_id = $2',
        [req.params.id, req.session.user.user_id]
    );
    res.json({ success: true });
});

// runs when someone signs up
app.post('/api/signup', async (req, res) => {
    const { user_id, password, name } = req.body;

    // see if that user_id is already taken
    const existing = await db.query('SELECT * FROM users WHERE user_id = $1', [user_id]);

    if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'That user_id is taken, try a different one.' });
    }

    // hash the password before saving
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
        'INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)',
        [user_id, hashed, name]
    );
    res.json({ success: true });
});

// runs when someone signs in
app.post('/api/signin', async (req, res) => {
    const { user_id, password } = req.body;

    const result = await db.query('SELECT * FROM users WHERE user_id = $1', [user_id]);

    // no user with that id
    if (result.rows.length === 0) {
        return res.status(400).json({ error: 'Wrong user_id or password.' });
    }

    const user = result.rows[0];

    // check the password against the hashed one
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(400).json({ error: 'Wrong user_id or password.' });
    }

    // save user to session so they stay logged in
    req.session.user = { user_id: user.user_id, name: user.name };
    res.json({ success: true, user: req.session.user });
});

// sign out
app.post('/api/signout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// starts server on 8000 so react can use 3000
app.listen(8000, () => {
    console.log("running on 8000");
});