interface AICompletionParams {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export class AIService {
  private apiKey: string | null = null;
  private provider: "openai" | "gemini" = "openai";
  private model: string = "gpt-4o-mini";

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY ?? process.env.GEMINI_API_KEY ?? null;
    if (process.env.GEMINI_API_KEY) {
      this.provider = "gemini";
      this.model = "gemini-2.0-flash";
    }
  }

  private get isEnabled(): boolean {
    return !!this.apiKey;
  }

  async generateCompletion(params: AICompletionParams): Promise<string | null> {
    if (!this.isEnabled) {
      console.log("[AI] Serviço de IA não configurado. Configure OPENAI_API_KEY ou GEMINI_API_KEY.");
      return null;
    }

    try {
      if (this.provider === "gemini") {
        return this.callGemini(params);
      }
      return this.callOpenAI(params);
    } catch {
      return null;
    }
  }

  private async callOpenAI(params: AICompletionParams): Promise<string | null> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          ...(params.systemPrompt
            ? [{ role: "system" as const, content: params.systemPrompt }]
            : []),
          { role: "user", content: params.prompt },
        ],
        max_tokens: params.maxTokens ?? 500,
        temperature: params.temperature ?? 0.3,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  }

  private async callGemini(params: AICompletionParams): Promise<string | null> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            ...(params.systemPrompt
              ? [{ role: "user", parts: [{ text: params.systemPrompt }] }]
              : []),
            { role: "user", parts: [{ text: params.prompt }] },
          ],
          generationConfig: {
            maxOutputTokens: params.maxTokens ?? 500,
            temperature: params.temperature ?? 0.3,
          },
        }),
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  }

  async organizeEvidences(evidences: { title: string; description?: string | null; type: string }[]): Promise<string | null> {
    const evidenceList = evidences
      .map((e) => `- ${e.title} (${e.type}): ${e.description ?? "sem descrição"}`)
      .join("\n");

    return this.generateCompletion({
      systemPrompt:
        "Você é um assistente organizacional. Organize as evidências em categorias lógicas (educação, trabalho, projetos, certificações). NUNCA julgue a qualidade das evidências. Responda em português.",
      prompt: `Organize estas evidências em grupos:\n${evidenceList}`,
    });
  }

  async suggestSkills(
    evidences: { title: string; description?: string | null; type: string }[]
  ): Promise<string | null> {
    const evidenceList = evidences
      .map((e) => `- ${e.title} (${e.type}): ${e.description ?? "sem descrição"}`)
      .join("\n");

    return this.generateCompletion({
      systemPrompt:
        "Você é um assistente que sugere habilidades com base em evidências. Liste apenas habilidades objetivas (hard skills, soft skills, idiomas). NUNCA julgue a pessoa. Responda em português.",
      prompt: `Com base nestas evidências, sugira habilidades relevantes:\n${evidenceList}`,
    });
  }

  async detectDuplicates(
    evidences: { id: string; title: string; description?: string | null }[]
  ): Promise<string | null> {
    const evidenceList = evidences
      .map((e) => `ID: ${e.id} - ${e.title}: ${e.description ?? "sem descrição"}`)
      .join("\n");

    return this.generateCompletion({
      systemPrompt:
        "Você é um assistente que detecta duplicatas. Compare as evidências e identifique possíveis duplicatas. Responda apenas com pares de IDs duplicados ou 'Nenhuma duplicata encontrada'. Responda em português.",
      prompt: `Identifique duplicatas entre estas evidências:\n${evidenceList}`,
    });
  }

  async generateDescription(
    title: string,
    context: string
  ): Promise<string | null> {
    return this.generateCompletion({
      systemPrompt:
        "Você é um assistente que gera descrições profissionais objetivas. NUNCA julgue ou avalie a pessoa. Mantenha tom neutro e factual. Responda em português.",
      prompt: `Gere uma descrição profissional para "${title}" no contexto: ${context}`,
      maxTokens: 300,
    });
  }
}

export const aiService = new AIService();