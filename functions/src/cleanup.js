const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Cleanup deleted users (runs daily)
exports.cleanupDeletedUsers = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async (context) => {
      const db = admin.firestore();
      const rtdb = admin.database();

      try {
        // Find users marked for deletion over 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const usersSnapshot = await db.collection('users')
            .where('deletionRequested', '==', true)
            .where('deletionRequestedAt', '<=', sevenDaysAgo)
            .get();

        const batch = db.batch();
        const promises = [];

        for (const doc of usersSnapshot.docs) {
          const userId = doc.id;

          // Delete user document
          batch.delete(doc.ref);

          // Delete user reviews
          const reviewsSnapshot = await db.collection('reviews')
              .where('userId', '==', userId)
              .get();

          reviewsSnapshot.docs.forEach((reviewDoc) => {
            batch.delete(reviewDoc.ref);
          });

          // Delete from RTDB
          promises.push(rtdb.ref(`presence/${userId}`).remove());

          // Delete Firebase Auth user
          promises.push(
              admin.auth().deleteUser(userId).catch((error) => {
                console.error(`Failed to delete auth user ${userId}:`, error);
              })
          );
        }

        await batch.commit();
        await Promise.all(promises);

        console.log(`Cleaned up ${usersSnapshot.size} users`);
        return null;
      } catch (error) {
        console.error('Cleanup error:', error);
        return null;
      }
    });

// Cleanup old chat messages (runs weekly)
exports.cleanupOldChats = functions.pubsub
    .schedule('every 168 hours') // Weekly
    .onRun(async (context) => {
      const rtdb = admin.database();

      try {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const chatsRef = rtdb.ref('chats');

        const snapshot = await chatsRef.once('value');
        const updates = {};

        snapshot.forEach((productSnapshot) => {
          productSnapshot.forEach((messageSnapshot) => {
            const message = messageSnapshot.val();
            if (message.timestamp < thirtyDaysAgo) {
              updates[`chats/${productSnapshot.key}/${messageSnapshot.key}`] =
                null;
            }
          });
        });

        await rtdb.ref().update(updates);

        const deletedCount = Object.keys(updates).length;
        console.log(`Cleaned up ${deletedCount} old chat messages`);
        return null;
      } catch (error) {
        console.error('Chat cleanup error:', error);
        return null;
      }
    });

// Cleanup unread indicators older than 7 days
exports.cleanupUnreadIndicators = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async (context) => {
      const rtdb = admin.database();

      try {
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const typingRef = rtdb.ref('typing');

        const snapshot = await typingRef.once('value');
        const updates = {};

        snapshot.forEach((productSnapshot) => {
          productSnapshot.forEach((userSnapshot) => {
            const timestamp = userSnapshot.val().timestamp;
            if (timestamp < sevenDaysAgo) {
              updates[`typing/${productSnapshot.key}/${userSnapshot.key}`] =
                null;
            }
          });
        });

        await rtdb.ref().update(updates);

        console.log(`Cleaned up ${Object.keys(updates).length} old indicators`);
        return null;
      } catch (error) {
        console.error('Typing indicator cleanup error:', error);
        return null;
      }
    });
