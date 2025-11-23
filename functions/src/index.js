const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const imageProcessing = require('./imageProcessing');
const cleanup = require('./cleanup');

// Image processing functions
exports.compressImage = imageProcessing.compressImage;
exports.uploadToCloudinary = imageProcessing.uploadToCloudinary;

// Cleanup functions
exports.cleanupDeletedUsers = cleanup.cleanupDeletedUsers;
exports.cleanupOldChats = cleanup.cleanupOldChats;

// Analytics trigger
exports.updateAnalytics = functions.firestore
    .document('products/{productId}')
    .onWrite(async (change, context) => {
      const db = admin.firestore();
      const statsRef = db.collection('storeMeta').doc('analytics');

      try {
        const productsSnapshot = await db.collection('products').get();
        const inStock = productsSnapshot.docs.filter(
            (doc) => doc.data().inStock
        ).length;

        await statsRef.set({
          totalProducts: productsSnapshot.size,
          inStockProducts: inStock,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        }, {merge: true});
      } catch (error) {
        console.error('Analytics update error:', error);
      }
    });

// User creation trigger
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  const db = admin.firestore();

  try {
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'User',
      photoURL: user.photoURL || null,
      role: 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      isBlocked: false,
      deletionRequested: false,
    }, {merge: true});

    console.log('User document created:', user.uid);
  } catch (error) {
    console.error('User creation error:', error);
  }
});

// User deletion trigger
exports.onUserDelete = functions.auth.user().onDelete(async (user) => {
  const db = admin.firestore();
  const rtdb = admin.database();

  try {
    // Delete user document
    await db.collection('users').doc(user.uid).delete();

    // Delete user reviews
    const reviewsSnapshot = await db.collection('reviews')
        .where('userId', '==', user.uid)
        .get();

    const batch = db.batch();
    reviewsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Clean up RTDB presence
    await rtdb.ref(`presence/${user.uid}`).remove();

    console.log('User data cleaned up:', user.uid);
  } catch (error) {
    console.error('User deletion cleanup error:', error);
  }
});

// Admin log function
exports.logAdminAction = functions.https.onCall(async (data, context) => {
  // Check if user is admin
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
        'User must be an admin'
    );
  }

  try {
    await db.collection('adminLogs').add({
      userId: context.auth.uid,
      action: data.action,
      details: data.details,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {success: true};
  } catch (error) {
    console.error('Admin log error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
