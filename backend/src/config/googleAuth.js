const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

// Initialize Google OAuth clients for different platforms
const googleClients = {
  web: process.env.GOOGLE_CLIENT_ID_WEB ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID_WEB) : null,
  ios: process.env.GOOGLE_CLIENT_ID_IOS ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID_IOS) : null,
  android: process.env.GOOGLE_CLIENT_ID_ANDROID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID_ANDROID) : null,
};

/**
 * Verify Google ID token
 * @param {string} token - Google ID token
 * @param {string} platform - Platform: 'web', 'ios', or 'android'
 * @returns {Promise<Object>} User payload
 */
async function verifyGoogleToken(token, platform = 'web') {
  const client = googleClients[platform];
  
  if (!client) {
    throw new Error(`Google OAuth client not configured for platform: ${platform}`);
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: client._clientId,
    });

    const payload = ticket.getPayload();
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified,
    };
  } catch (error) {
    console.error('Google token verification error:', error);
    throw new Error('Invalid Google token');
  }
}

module.exports = { verifyGoogleToken, googleClients };

