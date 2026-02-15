
import { GoogleGenAI } from "@google/genai";

// FIX: Per coding guidelines, API_KEY is assumed to be present in process.env.
// The explicit check and variable assignment have been removed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateGardeningTips(): Promise<string> {
  try {
    const today = new Date();
    const prompt = `
      Správaj sa ako profesionálny záhradník. Vygeneruj týždenný newsletter pre záhradkárov v strednej Európe pre aktuálny týždeň od ${today.toLocaleDateString('sk-SK')}.
      Témy by mali byť relevantné pre aktuálnu sezónu a počasie. Zahrň tipy na sadenie, strihanie, ochranu proti škodcom a všeobecnú údržbu záhrady.
      Naformátuj výstup ako jednoduchý newsletter s pútavým predmetom a niekoľkými sekciami s jasnými nadpismi (použi markdown pre nadpisy, napr. ## Názov sekcie).
      Celý text musí byť v slovenskom jazyku.

      Výstup oddeľ predmet od tela pomocou '---'.

      Príklad formátu:
      Predmet: Tipy pre Vašu záhradu na tento týždeň
      ---
      ## Práce v zeleninovej záhrade
      - Tip 1...
      - Tip 2...

      ## Starostlivosť o ovocné stromy
      - Tip 1...
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
    throw new Error("Nepodarilo sa vygenerovať záhradnícke tipy.");
  }
}
