import express from 'express';
import { OAuth2Client } from 'google-auth-library';

const app = express();
const port = 3000;

app.use(express.json());

const client = new OAuth2Client("202958853872-agcvp85p91h1tievq08ggi9h9o2lp4ji.apps.googleusercontent.com");

app.post('/verify-token', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "202958853872-agcvp85p91h1tievq08ggi9h9o2lp4ji.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    res.json({ user: payload });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).json({ error: 'Invalid token' });
  }
});

// Simulated user data
const users = {};

app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
  if (users[email]) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  users[email] = { email, password, username };
  res.json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users[email];
  if (!user || user.password !== password) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }
  res.json({ user });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
