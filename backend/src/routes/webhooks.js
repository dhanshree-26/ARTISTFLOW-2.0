const express = require('express');
const { supabase } = require('../config/supabase');

const router = express.Router();

// Webhook secret for Zapier (set in environment)
const WEBHOOK_SECRET = process.env.ZAPIER_WEBHOOK_SECRET;

/**
 * Middleware to verify webhook secret
 */
function verifyWebhookSecret(req, res, next) {
  const providedSecret = req.headers['x-webhook-secret'];
  
  if (!WEBHOOK_SECRET || providedSecret !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
}

/**
 * POST /api/webhooks/zapier/reminder
 * Trigger reminder workflow via Zapier
 */
router.post('/zapier/reminder', verifyWebhookSecret, async (req, res) => {
  try {
    const { event_id, user_id, reminder_type, scheduled_at } = req.body;

    if (!event_id || !user_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create notification record
    const notificationMessage = reminder_type === 't-2' 
      ? `Reminder: ${event.event_name} is in 2 days`
      : `Reminder: ${event.event_name} is today at ${event.time}`;

    const { data: notification, error: notifError } = await supabase
      .from('notifications')
      .insert({
        user_id,
        event_id,
        type: 'reminder',
        message: notificationMessage,
        scheduled_at: scheduled_at || new Date().toISOString(),
        sent: true, // Mark as sent since Zapier will handle delivery
      })
      .select()
      .single();

    if (notifError) throw notifError;

    // Return data for Zapier to use
    res.json({
      success: true,
      notification,
      event: {
        id: event.id,
        event_name: event.event_name,
        venue: event.venue,
        date: event.date,
        time: event.time,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Reminder webhook error:', error);
    res.status(500).json({ error: 'Failed to process reminder' });
  }
});

/**
 * POST /api/webhooks/zapier/notification
 * Send notification via Zapier
 */
router.post('/zapier/notification', verifyWebhookSecret, async (req, res) => {
  try {
    const { user_id, event_id, type, message } = req.body;

    if (!user_id || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id,
        event_id: event_id || null,
        type: type || 'reminder',
        message,
        sent: true,
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, notification });
  } catch (error) {
    console.error('Notification webhook error:', error);
    res.status(500).json({ error: 'Failed to process notification' });
  }
});

/**
 * POST /api/webhooks/zapier/event-created
 * Trigger when event is created (for scheduling reminders)
 */
router.post('/zapier/event-created', verifyWebhookSecret, async (req, res) => {
  try {
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({ error: 'Event ID required' });
    }

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select(`
        *,
        event_slots (
          artist_id
        )
      `)
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get all users who need reminders (company + assigned artists)
    const userIds = [event.company_id];
    if (event.event_slots) {
      event.event_slots.forEach(slot => {
        if (slot.artist_id) {
          userIds.push(slot.artist_id);
        }
      });
    }

    // Calculate reminder dates
    const eventDate = new Date(event.date);
    const tMinus2Days = new Date(eventDate);
    tMinus2Days.setDate(tMinus2Days.getDate() - 2);
    
    const eventDay = new Date(eventDate);
    eventDay.setHours(10, 0, 0, 0); // 10 AM on event day

    // Create notification records for scheduling
    const notifications = [];
    userIds.forEach(userId => {
      // T-2 days reminder
      notifications.push({
        user_id: userId,
        event_id: event.id,
        type: 'reminder',
        message: `Reminder: ${event.event_name} is in 2 days`,
        scheduled_at: tMinus2Days.toISOString(),
        sent: false,
      });

      // Event day reminder (10 AM)
      notifications.push({
        user_id: userId,
        event_id: event.id,
        type: 'reminder',
        message: `Reminder: ${event.event_name} is today at ${event.time}`,
        scheduled_at: eventDay.toISOString(),
        sent: false,
      });
    });

    if (notifications.length > 0) {
      const { error: notifError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notifError) throw notifError;
    }

    res.json({
      success: true,
      event_id: event.id,
      notifications_scheduled: notifications.length,
      reminder_dates: {
        t_minus_2: tMinus2Days.toISOString(),
        event_day_10am: eventDay.toISOString(),
      },
    });
  } catch (error) {
    console.error('Event created webhook error:', error);
    res.status(500).json({ error: 'Failed to process event creation' });
  }
});

module.exports = router;
