const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:ton@email.com',  // ← mets ton vrai email
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

exports.handler = async () => {
  const sub = JSON.parse(process.env.SUBSCRIPTION || 'null');
  if (!sub) return { statusCode: 200, body: 'Pas d\'abonnement' };

  const payload = JSON.stringify({
    title: '🌿 Arrosage du matin',
    body: 'Vérifie tes plantes — certaines ont peut-être soif !'
  });

  try {
    await webpush.sendNotification(sub, payload);
    return { statusCode: 200, body: 'Notification envoyée ✅' };
  } catch (err) {
    return { statusCode: 500, body: `Erreur: ${err.message}` };
  }
};