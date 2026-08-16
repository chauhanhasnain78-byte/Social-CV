import { doc, getDoc, setDoc, onSnapshot, updateDoc, increment, collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

const STATS_DOC_ID = 'global-stats';
const STATS_COLLECTION = 'system';

/**
 * Initializes the global stats document if it doesn't exist
 */
export async function initGlobalStats() {
  const docRef = doc(db, STATS_COLLECTION, STATS_DOC_ID);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    await setDoc(docRef, {
      totalResumes: 0,
      highestAtsScore: 0,
      ratingSum: 0,
      totalRatings: 0,
    });
  }
}

/**
 * Subscribe to real-time stats
 * @param {function} callback - Called with stats object
 * @returns {function} unsubscribe function
 */
export function subscribeToStats(callback) {
  const docRef = doc(db, STATS_COLLECTION, STATS_DOC_ID);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback({ totalResumes: 0, highestAtsScore: 0, ratingSum: 0, totalRatings: 0 });
    }
  });
}

/**
 * Increment total resumes count by 1
 */
export async function incrementResumesCount() {
  const docRef = doc(db, STATS_COLLECTION, STATS_DOC_ID);
  await updateDoc(docRef, {
    totalResumes: increment(1)
  }).catch(() => initGlobalStats().then(() => updateDoc(docRef, { totalResumes: increment(1) })));
}

/**
 * Update the highest ATS score if the new score is greater
 * @param {number} score 
 */
export async function updateHighestAtsScore(score) {
  if (typeof score !== 'number') return;
  const docRef = doc(db, STATS_COLLECTION, STATS_DOC_ID);
  
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentHighest = docSnap.data().highestAtsScore || 0;
      if (score > currentHighest) {
        await updateDoc(docRef, { highestAtsScore: score });
      }
    } else {
      await initGlobalStats();
      await updateDoc(docRef, { highestAtsScore: score });
    }
  } catch (err) {
    console.error('Failed to update ATS score', err);
  }
}

/**
 * Submit a new rating
 * @param {number} rating (1-5)
 * @param {string} comment (optional)
 */
export async function submitAppRating(rating, comment = '') {
  if (typeof rating !== 'number' || rating < 1 || rating > 5) return;
  const docRef = doc(db, STATS_COLLECTION, STATS_DOC_ID);
  
  // 1. Update the global averages
  await updateDoc(docRef, {
    ratingSum: increment(rating),
    totalRatings: increment(1)
  }).catch(() => initGlobalStats().then(() => updateDoc(docRef, { 
    ratingSum: increment(rating), 
    totalRatings: increment(1) 
  })));

  // 2. Save individual feedback so the admin can read it
  try {
    const feedbackRef = collection(db, 'feedback');
    await addDoc(feedbackRef, {
      rating,
      comment: comment || '',
      createdAt: Date.now()
    });
  } catch (err) {
    console.error('Failed to save individual feedback', err);
  }
}
