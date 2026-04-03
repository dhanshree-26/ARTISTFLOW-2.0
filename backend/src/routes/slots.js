const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

/**
 * GET /api/events/:eventId/slots
 * Get slots for an event
 */
router.get('/events/:eventId/slots', async (req, res) => {
  try {
    const { eventId } = req.params;

    // Verify access to event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('company_id')
      .eq('id', eventId)
      .single();

    if (eventError) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check permissions
    if (req.user.role === 'company' && event.company_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data: slots, error } = await supabase
      .from('event_slots')
      .select(`
        *,
        artist_profiles (
          user_id,
          genre,
          city,
          users (name, email)
        )
      `)
      .eq('event_id', eventId)
      .order('slot_number', { ascending: true });

    if (error) throw error;

    res.json(slots || []);
  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

/**
 * POST /api/events/:eventId/slots
 * Assign artist to slot (companies only)
 */
router.post('/events/:eventId/slots', requireRole('company'), async (req, res) => {
  try {
    const { eventId } = req.params;
    const { artist_id, slot_number, slot_type } = req.body;

    if (!artist_id || !slot_number) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify event belongs to company
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('company_id, total_slots')
      .eq('id', eventId)
      .single();

    if (eventError || event.company_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check slot number is within total slots
    if (slot_number > event.total_slots) {
      return res.status(400).json({ error: 'Slot number exceeds total slots' });
    }

    // Check if slot already assigned
    const { data: existingSlot } = await supabase
      .from('event_slots')
      .select('*')
      .eq('event_id', eventId)
      .eq('slot_number', slot_number)
      .single();

    if (existingSlot) {
      return res.status(409).json({ error: 'Slot already assigned' });
    }

    const { data: slot, error } = await supabase
      .from('event_slots')
      .insert({
        event_id: eventId,
        artist_id,
        slot_number,
        slot_type,
        status: 'pending',
      })
      .select(`
        *,
        artist_profiles (
          user_id,
          genre,
          city,
          users (name, email)
        )
      `)
      .single();

    if (error) throw error;

    res.status(201).json(slot);
  } catch (error) {
    console.error('Assign slot error:', error);
    res.status(500).json({ error: 'Failed to assign slot' });
  }
});

/**
 * PATCH /api/slots/:id
 * Update slot status
 */
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    // Get slot to check permissions
    const { data: slot, error: slotError } = await supabase
      .from('event_slots')
      .select(`
        *,
        events (company_id)
      `)
      .eq('id', req.params.id)
      .single();

    if (slotError) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    // Check permissions
    const isCompanyOwner = req.user.role === 'company' && slot.events.company_id === req.user.id;
    const isAssignedArtist = req.user.role === 'artist' && slot.artist_id === req.user.id;

    if (!isCompanyOwner && !isAssignedArtist) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Artists can only update status to confirmed or declined
    if (req.user.role === 'artist' && !['confirmed', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Artists can only confirm or decline slots' });
    }

    const { data: updatedSlot, error } = await supabase
      .from('event_slots')
      .update({ status })
      .eq('id', req.params.id)
      .select(`
        *,
        artist_profiles (
          user_id,
          genre,
          city,
          users (name, email)
        )
      `)
      .single();

    if (error) throw error;

    res.json(updatedSlot);
  } catch (error) {
    console.error('Update slot error:', error);
    res.status(500).json({ error: 'Failed to update slot' });
  }
});

/**
 * DELETE /api/slots/:id
 * Remove artist from slot (companies only)
 */
router.delete('/:id', requireRole('company'), async (req, res) => {
  try {
    // Get slot to verify ownership
    const { data: slot, error: slotError } = await supabase
      .from('event_slots')
      .select(`
        *,
        events (company_id)
      `)
      .eq('id', req.params.id)
      .single();

    if (slotError) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    if (slot.events.company_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { error } = await supabase
      .from('event_slots')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Slot removed successfully' });
  } catch (error) {
    console.error('Delete slot error:', error);
    res.status(500).json({ error: 'Failed to remove slot' });
  }
});

module.exports = router;
