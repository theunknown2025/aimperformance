import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Event context for the chatbot
const eventContext = `
Tu es un assistant virtuel spécialisé pour les "Rencontres Régionales EXPORT", un événement majeur dédié à l'exportation au Maroc.

INFORMATIONS SUR L'ÉVÉNEMENT:
- Nom: Rencontres Régionales EXPORT
- Objectif: Promouvoir l'exportation et connecter les entreprises marocaines
- Format: Événements régionaux dans différentes villes
- Public cible: Exportateurs, entreprises marocaines, investisseurs

ÉVÉNEMENTS PRÉVUS:
1. Casablanca - 15 Septembre 2025
2. Tanger - 22 Septembre 2025  
3. Fes - 29 Septembre 2025

SECTEURS D'ACTIVITÉS:
- Exportateurs directs et indirects
- Marché local et marque marocaine
- Produit fini et sous-traitance
- Co-traitance
- Textile (chaîne et trame, maille, technique, de maison)
- Habillement (maille fine, grosse maille, denim, flou, pièces à manches)
- Finissage et teinture (teinture tissus, teinture pièces, délavage)
- Impression (rotative, digitale)
- Personnalisation (broderie, sérigraphie, sublimation laser)
- Autres

INSTRUCTIONS:
- Réponds toujours en français
- Sois professionnel et accueillant
- Donne des informations précises sur l'événement
- Dirige les visiteurs vers l'inscription si nécessaire
- Mentionne les documents disponibles (programme, guide, plan d'accès)
- Encourage la participation et l'inscription
- Sois concis mais informatif
- Si tu ne sais pas quelque chose, propose de contacter l'équipe organisatrice

EXEMPLES DE RÉPONSES UTILES:
- Informations sur les dates et lieux
- Processus d'inscription
- Secteurs d'activités couverts
- Documents et ressources disponibles
- Contact et support
`;

export async function getChatResponse(userMessage: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: eventContext
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "Désolé, je n'ai pas pu traiter votre demande.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Erreur lors de la communication avec l\'assistant');
  }
}

// Predefined responses for common questions
export const commonResponses = {
  inscription: "Pour vous inscrire aux Rencontres Régionales EXPORT, cliquez sur le bouton 'Inscrivez-vous' en haut de la page. Vous devrez remplir un formulaire avec les informations de votre entreprise et sélectionner l'événement de votre choix.",
  
  dates: "Les Rencontres Régionales EXPORT se déroulent en septembre 2025 : Casablanca le 15, Tanger le 22, et Fes le 29. Choisissez l'événement qui vous convient le mieux !",
  
  secteurs: "Notre événement couvre tous les secteurs d'exportation : textile, habillement, finissage, impression, personnalisation, et bien d'autres. Tous les types d'entreprises sont les bienvenus !",
  
  documents: "Des documents importants sont disponibles : le programme de l'événement, le guide du participant, et le plan d'accès. Ces documents vous seront envoyés par email après validation de votre inscription.",
  
  contact: "Pour toute question, vous pouvez nous contacter par email à contact@rencontres-export.ma ou par téléphone au +212 5 22 123 456."
};
