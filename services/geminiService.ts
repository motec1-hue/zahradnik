
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateGardeningTips(): Promise<string> {
  try {
    const today = new Date();
    const prompt = `
      Správaj sa ako profesionálny záhradník so 40-ročnou praxou. Vygeneruj komplexný týždenný dashboard pre záhradkárov v strednej Európe pre týždeň začínajúci ${today.toLocaleDateString('sk-SK')}.
      Obsah musí byť vysoko relevantný pre tento konkrétny dátum, aktuálne počasie (napr. skorá jar, mrazy, sucho) a vegetačné obdobie.

      Štruktúra výstupu (použi Markdown):
      # [Titulok týždňa - krátky a pútavý]
      
      ## Hlavná téma: [Názov témy]
      [Napíš 2-3 odseky o najdôležitejšej aktivite tento týždeň. Buď odborný, ale prístupný.]

      ## Zoznam prác na tento týždeň
      - [Úloha 1]
      - [Úloha 2]
      - [Úloha 3]
      - [Úloha 4]

      ## Profi tip záhradníka
      [Jedna unikátna, možno menej známa rada týkajúca sa údržby, nástrojov alebo rastlín.]

      ## Čo sadiť a siať
      [Zoznam konkrétnych plodín vhodných pre tento týždeň.]

      Celý text musí byť v slovenskom jazyku. Nepoužívaj úvodné kecy ako "Tu je váš dashboard", začni rovno nadpisom.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error("API vrátilo prázdnu odpoveď.");
    }
  } catch (error) {
    console.error("Chyba pri komunikácii s Gemini API:", error);
    throw new Error("Nepodarilo sa vygenerovať záhradnícke rady.");
  }
}
