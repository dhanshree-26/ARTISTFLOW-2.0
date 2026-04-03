const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

/**
 * GET /api/availability
 * Get availability (artists can see their own, companies can see all)
 */
router.get('/', async (req, res) => {
  try {
    const { artist_id, date_from, date_to } = req.query;

    let query = supabase
      .from('availability')
      .select(`
        *,
        artist_profiles (
          user_id,
          genre,
          city,
          users (name, email)
        )
      `);

    if (req.user.role === 'artist') {
      // Artists see their own availability
      query = query.eq('artist_id', req.user.id);
    } else if (artist_id) {
      // Companies can view specific artist availability
      query = query.eq('artist_id', artist_id);
    } else {
      // Companies can view all artist availability
      query = query.select('*');
    }

    if (date_from) query = query.gte('date', date_from);
    if (date_to) query = query.lte('date', date_to);

    const { data: availability, error } = await query.order('date', { ascending: true });

    if (error) throw error;

    res.json(availability || []);
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

/**
 * POST /api/availability
 * Set availability (artists only)
 */
router.post('/', requireRole('artist'), async (req, res) => {
  try {
    const { date, status, time_slot, note } = req.body;

    if (!date || !status) {
      return res.status(400).json({ error: 'Date and status are required' });
    }

    if (!['available', 'unavailable'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if availability already exists for this date
    const { data: existing } = await supabase
      .from('availability')
      .select('*')
      .eq('artist_id', req.user.id)
      .eq('date', date)
      .single();

    if (existing) {
      // Update existing
      const { data: updated, error } = await supabase
        .from('availability')
        .update({
          status,
          time_slot,
          note,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return res.json(updated);
    }

    // Create new
    const { data: availability, error } = await supabase
      .from('availability')
      .insert({
        artist_id: req.user.id,
        date,
        status,
        time_slot,
        note,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(availability);
  } catch (error) {
    console.error('Set availability error:', error);
    if (error.code === '23505') { // Unique constraint
      return res.status(409).json({ error: 'Availability already exists for this date' });
    }
    res.status(500).json({ error: 'Failed to set availability' });
  }
});

/**
 * PATCH /api/availability/:id
 * Update availability (artists only)
 */
router.patch('/:id', requireRole('artist'), async (req, res) => {
  try {
    // Verify ownership
    const { data: existing, error: checkError } = await supabase
      .from('availability')
      .select('artist_id')
      .eq('id', req.params.id)
      .single();

    if (checkError || existing.artist_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data: availability, error } = await supabase
      .from('availability')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(availability);
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

/**
 * DELETE /api/availability/:id
 * Delete availability (artists only)
 */
router.delete('/:id', requireRole('artist'), async (req, res) => {
  try {
    // Verify ownership
    const { data: existing, error: checkError } = await supabase
      .from('availability')
      .select('artist_id')
      .eq('id', req.params.id)
      .single();

    if (checkError || existing.artist_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { error } = await supabase
      .from('availability')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Availability deleted successfully' });
  } catch (error) {
    console.error('Delete availability error:', error);
    res.status(500).json({ error: 'Failed to delete availability' });
  }
});

module.exports = router;
