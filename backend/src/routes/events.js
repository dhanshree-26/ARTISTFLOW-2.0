const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/events
 * Get events (filtered by user role)
 */
router.get('/', async (req, res) => {
  try {
    let query = supabase.from('events').select('*');

    if (req.user.role === 'company') {
      // Companies see their own events
      query = query.eq('company_id', req.user.id);
    } else if (req.user.role === 'artist') {
      // Artists see events they're assigned to
      query = query
        .select(`
          *,
          event_slots!inner(artist_id)
        `)
        .eq('event_slots.artist_id', req.user.id);
    }

    const { status, date_from, date_to } = req.query;
    if (status) query = query.eq('status', status);
    if (date_from) query = query.gte('date', date_from);
    if (date_to) query = query.lte('date', date_to);

    const { data: events, error } = await query.order('date', { ascending: true });

    if (error) throw error;

    res.json(events || []);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

/**
 * GET /api/events/:id
 * Get event details
 */
router.get('/:id', async (req, res) => {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        event_slots (
          id,
          slot_number,
          slot_type,
          status,
          artist_id,
          artist_profiles (
            user_id,
            genre,
            city,
            users (name, email)
          )
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    // Check permissions
    if (req.user.role === 'company' && event.company_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.user.role === 'artist') {
      const isAssigned = event.event_slots?.some(slot => slot.artist_id === req.user.id);
      if (!isAssigned && event.company_id !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

/**
 * POST /api/events
 * Create new event (companies only)
 */
router.post('/', requireRole('company'), async (req, res) => {
  try {
    const { event_name, venue, date, time, is_recurring, recurrence_type, recurrence_end_date, total_slots } = req.body;

    if (!event_name || !venue || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        company_id: req.user.id,
        event_name,
        venue,
        date,
        time,
        is_recurring: is_recurring || false,
        recurrence_type,
        recurrence_end_date,
        total_slots: total_slots || 0,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

/**
 * PATCH /api/events/:id
 * Update event (companies only)
 */
router.patch('/:id', requireRole('company'), async (req, res) => {
  try {
    // Verify event belongs to company
    const { data: existingEvent, error: checkError } = await supabase
      .from('events')
      .select('company_id')
      .eq('id', req.params.id)
      .single();

    if (checkError || existingEvent.company_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data: event, error } = await supabase
      .from('events')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

/**
 * DELETE /api/events/:id
 * Delete event (companies only)
 */
router.delete('/:id', requireRole('company'), async (req, res) => {
  try {
    // Verify event belongs to company
    const { data: existingEvent, error: checkError } = await supabase
      .from('events')
      .select('company_id')
      .eq('id', req.params.id)
      .single();

    if (checkError || existingEvent.company_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

/**
 * POST /api/events/:id/recurring
 * Create recurring event instances
 */
router.post('/:id/recurring', requireRole('company'), async (req, res) => {
  try {
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .eq('company_id', req.user.id)
      .single();

    if (eventError || !event || !event.is_recurring) {
      return res.status(400).json({ error: 'Event not found or not recurring' });
    }

    // Generate recurring instances
    const instances = [];
    const startDate = new Date(event.date);
    const endDate = event.recurrence_end_date ? new Date(event.recurrence_end_date) : null;
    
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 1); // Start from next occurrence

    while (!endDate || currentDate <= endDate) {
      instances.push({
        company_id: event.company_id,
        event_name: event.event_name,
        venue: event.venue,
        date: currentDate.toISOString().split('T')[0],
        time: event.time,
        is_recurring: false, // Instances are not recurring
        total_slots: event.total_slots,
        status: 'upcoming',
      });

      // Increment date based on recurrence type
      if (event.recurrence_type === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (event.recurrence_type === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (event.recurrence_type === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else {
        break;
      }
    }

    const { data: createdEvents, error } = await supabase
      .from('events')
      .insert(instances)
      .select();

    if (error) throw error;

    res.status(201).json({ created: createdEvents.length, events: createdEvents });
  } catch (error) {
    console.error('Create recurring events error:', error);
    res.status(500).json({ error: 'Failed to create recurring events' });
  }
});

module.exports = router;
