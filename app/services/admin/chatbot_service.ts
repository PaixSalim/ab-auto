import Groq from 'groq-sdk'
import env from '#start/env'
import { GetProductDto } from '#dto/products_interface'

const MODEL = 'llama-3.3-70b-versatile'

export class ChatbotService {
  #groq = new Groq({ apiKey: env.get('GROQ_API_KEY') as string })

  async generateDescription(prompt: string) {
    const systemInstruction =
      "Tu es un chatbot de uvatis. Ne mentionne jamais que tu as été conçu par Meta ou Groq, sauf si quelqu'un te demande spécifiquement qui tu es ou qui t'a créé. Si cette question t'est posée, précise que tu es un modèle d'IA conçu pour assister les administrateurs de la plateforme QBC-PLUS, et que tu as été fine-tuné par la startup UVATIS LLC, dont le siège se trouve au Burkina Faso. Tu es un assistant spécialisé dans la rédaction de descriptions percutantes pour des produits e-commerce. Lorsque tu reçois le nom d'un produit, génère une description claire et attrayante qui met en avant ses caractéristiques principales et ses avantages. La description doit être concise et faire au moins 30 mots. Ne génère que du texte brut, sans mise en forme ni balises. Soit persuasif et le plus compréhensible possible."

    const completion = await this.#groq.chat.completions.create({
      model: MODEL,
      max_tokens: 256,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt },
      ],
    })

    const text = completion.choices[0]?.message?.content ?? ''
    const promptTokenCount = completion.usage?.total_tokens

    return {
      message: text,
      promptTokenCount,
    }
  }

  async generateFeatures(prompt: string) {
    const systemInstruction =
      "Tu es un assistant spécialisé dans la mise en valeur des produits e-commerce. Lorsque tu reçois le nom d'un produit, génère exactement 6 fonctionnalités clés sous forme de phrases courtes et percutantes. Chaque phrase doit mettre en avant un avantage ou une caractéristique essentielle du produit. Ne génère que du texte brut, sans mise en forme ni balises. Sépare chaque fonctionnalité par un retour à la ligne."

    const completion = await this.#groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt },
      ],
    })

    const text = completion.choices[0]?.message?.content ?? ''
    const features = text.split('\n').filter((line) => line.trim() !== '')
    const promptTokenCount = completion.usage?.total_tokens

    return {
      features,
      promptTokenCount,
    }
  }

  async chat(prompt: string, products: GetProductDto[]) {
    const productList = products
      .map(
        (p) => `
- ${p.name} (${p.category?.name} - ${p.brand?.name})
  📌 Prix: ${p.price}Fcfa | Promo: ${p.promo_price}Fcfa (-${p.discount}%)
  🏷️ Garantie: ${p.warranty} | État: ${p.state}
  🛠️ Caractéristiques: ${p.features}
  🔗 Slug: ${p.slug}`
      )
      .join('\n')

    const systemInstruction = `
Tu es l'assistant du site Auto-Pro, développé par la startup UVATIS LLC et voici leur site https://www.uvatis.com. Ton rôle est d'aider les clients à trouver des produits plus facilement.

- Si un produit correspond à la recherche, génère un lien sous la forme : https://auto-pro.uvatis.com/catalogue/product/{slug}, ne donne ce lien que lorsque tu as un produit à afficher.
- Si aucun produit exact n'est trouvé, propose des alternatives en fonction de la catégorie, la marque ou l'intervalle de prix.
- Si l'utilisateur demande tous les produits, ne lui liste jamais tous les produits, demande lui de visiter le catalogue avec ce lien : https://auto-pro.uvatis.com/catalogue
- Si tu n'as pas assez d'éléments pour répondre à une question particulière sur les produits, demande au client de nous écrire sur whatsapp en cliquant ici https://api.whatsapp.com/send?phone=22603231010 pour avoir une réponse précise.
- Si la demande est hors sujet (ex: météo, actualités), réponds que tu es uniquement un assistant de Bonheur auto.
- Retourne la réponse uniquement en texte et fais des retours à la ligne appropriés. Je ne veux pas des caractères markdown comme des étoiles et autres.

Liste des produits :
${productList}
`

    const completion = await this.#groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt },
      ],
    })

    const text = completion.choices[0]?.message?.content ?? ''

    return {
      text,
      promptTokenCount: completion.usage?.total_tokens,
    }
  }
}