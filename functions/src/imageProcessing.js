const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sharp = require('sharp');
const axios = require('axios');

// Compress image (server-side fallback)
exports.compressImage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
    );
  }

  try {
    const {imageUrl, maxWidth = 1920, quality = 80} = data;

    // Download image
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    // Compress image
    const compressed = await sharp(response.data)
        .resize(maxWidth, null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({quality})
        .toBuffer();

    return {
      success: true,
      size: compressed.length,
    };
  } catch (error) {
    console.error('Image compression error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Upload to Cloudinary (with signature)
exports.uploadToCloudinary = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
    );
  }

  const db = admin.firestore();
  const userDoc = await db.collection('users').doc(context.auth.uid).get();

  if (!userDoc.exists || userDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError(
        'permission-denied',
        'Only admins can upload images'
    );
  }

  try {
    // Generate signature for secure upload
    const crypto = require('crypto');
    const timestamp = Math.round(Date.now() / 1000);
    const cloudinarySecret = functions.config().cloudinary.api_secret;

    const signature = crypto
        .createHash('sha1')
        .update(`timestamp=${timestamp}${cloudinarySecret}`)
        .digest('hex');

    return {
      success: true,
      timestamp,
      signature,
    };
  } catch (error) {
    console.error('Cloudinary signature error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Delete from Cloudinary
exports.deleteFromCloudinary = functions.https.onCall(
    async (data, context) => {
      if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User must be authenticated'
        );
      }

      const db = admin.firestore();
      const userDoc = await db.collection('users').doc(context.auth.uid).get();

      if (!userDoc.exists || userDoc.data().role !== 'admin') {
        throw new functions.https.HttpsError(
            'permission-denied',
            'Only admins can delete images'
        );
      }

      try {
        const {publicId} = data;
        const cloudinary = require('cloudinary').v2;

        cloudinary.config({
          cloud_name: functions.config().cloudinary.cloud_name,
          api_key: functions.config().cloudinary.api_key,
          api_secret: functions.config().cloudinary.api_secret,
        });

        await cloudinary.uploader.destroy(publicId);

        return {success: true};
      } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new functions.https.HttpsError('internal', error.message);
      }
    }
);
