const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

/**
 * GET /api/inquiries
 * Get inquiries (sent or received)
 */
router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query; // type: 'sent' | 'received', status: 'new' | 'responded' | 'archived'

    let query = supabase
      .from('inquiries')
      .select(`
        *,
        sender:users!inquiries_sender_id_fkey(id, name, email),
        recipient:users!inquiries_recipient_id_fkey(id, name, email),
        event:events(id, event_name, date)
      `);

    if (type === 'sent') {
      query = query.eq('sender_id', req.user.id);
    } else if (type === 'received') {
      query = query.eq('recipient_id', req.user.id);
    } else {
      // Get both sent and received
      query = query.or(`sender_id.eq.${req.user.id},recipient_id.eq.${req.user.id}`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: inquiries, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.json(inquiries || []);
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

/**
 * GET /api/inquiries/:id
 * Get inquiry details
 */
router.get('/:id', async (req, res) => {
  try {
    const { data: inquiry, error } = await supabase
      .from('inquiries')
      .select(`
        *,
        sender:users!inquiries_sender_id_fkey(id, name, email),
        recipient:users!inquiries_recipient_id_fkey(id, name, email),
        event:events(id, event_name, date, venue)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    // Check permissions
    if (inquiry.sender_id !== req.user.id && inquiry.recipient_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(inquiry);
  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({ error: 'Failed to fetch inquiry' });
  }
});

/**
 * POST /api/inquiries
 * Create new inquiry
 */
router.post('/', async (req, res) => {
  try {
    const { recipient_id, event_id, subject, message, tags } = req.body;

    if (!recipient_id || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: inquiry, error } = await supabase
      .from('inquiries')
      .insert({
        sender_id: req.user.id,
        recipient_id,
        event_id: event_id || null,
        subject,
        message,
        tags: tags || [],
        status: 'new',
      })
      .select(`
        *,
        sender:users!inquiries_sender_id_fkey(id, name, email),
        recipient:users!inquiries_recipient_id_fkey(id, name, email),
        event:events(id, event_name, date)
      `)
      .single();

    if (error) throw error;

    // Create notification for recipient
    await supabase
      .from('notifications')
      .insert({
        user_id: recipient_id,
        event_id: event_id || null,
        type: 'inquiry',
        message: `New inquiry from ${req.user.name}: ${subject}`,
        sent: false,
      });

    res.status(201).json(inquiry);
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ error: 'Failed to create inquiry' });
  }
});

/**
 * PATCH /api/inquiries/:id
 * Update inquiry (mainly status)
 */
router.patch('/:id', async (req, res) => {
  try {
    // Get inquiry to check permissions
    const { data: inquiry, error: inquiryError } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (inquiryError) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    // Only recipient can update status
    if (inquiry.recipient_id !== req.user.id) {
      return res.status(403).json({ error: 'Only recipient can update inquiry' });
    }

    const { data: updatedInquiry, error } = await supabase
      .from('inquiries')
      .update(req.body)
      .eq('id', req.params.id)
      .select(`
        *,
        sender:users!inquiries_sender_id_fkey(id, name, email),
        recipient:users!inquiries_recipient_id_fkey(id, name, email),
        event:events(id, event_name, date)
      `)
      .single();

    if (error) throw error;

    res.json(updatedInquiry);
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

module.exports = router;
