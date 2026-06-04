exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const subscription = JSON.parse(event.body);
    console.log('Subscription reçue:', JSON.stringify(subscription));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Abonnement enregistré' })
    };
  } catch (err) {
    return { statusCode: 500, body: 'Erreur serveur' };
  }
};
