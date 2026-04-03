const express = require('express');
const crypto = require('crypto');
const { supabase } = require('../config/supabase');
const { verifyGoogleToken } = require('../config/googleAuth');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user (creates in Supabase Auth first, then public.users)
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['artist', 'company'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be "artist" or "company"' });
    }

    // 1. Create user in Supabase Auth (required: public.users.id references auth.users.id)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role },
    });

    if (authError) {
      if (authError.message && authError.message.toLowerCase().includes('already been registered')) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      return res.status(400).json({ error: authError.message || 'Registration failed' });
    }

    const authUser = authData?.user;
    if (!authUser?.id) {
      return res.status(500).json({ error: 'Registration failed' });
    }

    // 2. Insert into public.users (id must match auth.users.id)
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: authUser.id,
        email: authUser.email || email,
        name,
        role,
      })
      .select()
      .single();

    if (userError) {
      if (userError.code === '23505') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: userError.message || 'Registration failed' });
    }

    // 3. Create artist profile if role is artist
    if (role === 'artist') {
      await supabase
        .from('artist_profiles')
        .insert({
          user_id: user.id,
        });
    }

    const token = generateToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password (verify via Supabase Auth, then return public.users + JWT)
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData?.user?.id) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/google
 * Login/Register with Google OAuth (create in Auth if new, then public.users)
 */
router.post('/google', async (req, res) => {
  try {
    const { token, platform } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Google token required' });
    }

    const googleUser = await verifyGoogleToken(token, platform || 'web');

    let { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', googleUser.email)
      .single();

    if (userError || !user) {
      // Create in Supabase Auth (random password; user signs in with Google)
      const randomPassword = crypto.randomBytes(24).toString('hex');
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: googleUser.email,
        password: randomPassword,
        email_confirm: true,
        user_metadata: { name: googleUser.name, role: 'artist', picture: googleUser.picture },
      });

      if (authError || !authData?.user?.id) {
        return res.status(400).json({ error: authError?.message || 'Google sign-up failed' });
      }

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: googleUser.email,
          name: googleUser.name || googleUser.email,
          role: 'artist',
        })
        .select()
        .single();

      if (createError) {
        return res.status(500).json({ error: createError.message || 'Google sign-up failed' });
      }

      user = newUser;

      await supabase
        .from('artist_profiles')
        .insert({ user_id: user.id });
    }

    const jwtToken = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        picture: googleUser.picture,
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Google authentication failed' });
  }
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { data: artistProfile } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    res.json({
      ...req.user,
      artistProfile: artistProfile || null,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;
