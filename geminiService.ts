/// <reference types="vite/client" />

import { GoogleGenAI, Type } from "@google/genai";
import { CommandParseResult, Product, Transaction, StockBatch } from "./types";

// Lazy initialization to prevent app crash when API key is missing
const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in .env.local');
  }
  return new GoogleGenAI({ apiKey });
};

export const parseVoiceCommand = async (text: string): Promise<CommandParseResult> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are the NLU engine for SurgiFlow. Parse this surgical SME command: "${text}"
    
    Actions Mapping:
    - "Add", "Produce", "Manufactured" -> ADD
    - "Sell", "Bill", "Sold" -> REMOVE
    - "Set price", "Price update" -> UPDATE_PRICE
    - "Dispatch", "Send to", "Deliver" -> DISPATCH
    - "Move to [Stage]", "Completed [Stage]" -> MOVE_STAGE
    - "Find", "Where is", "Locate" -> LOCATE
    
    Stages: FORGING, MACHINING, POLISHING, CLEANING, QC, STERILIZATION, PACKED
    
    Return JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          action: {
            type: Type.STRING,
            enum: ['ADD', 'REMOVE', 'UPDATE_PRICE', 'SET_MARGIN', 'DISPATCH', 'CHECK_STOCK', 'ASSEMBLE_SET', 'MOVE_STAGE', 'LOCATE', 'UNKNOWN']
          },
          item: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          price: { type: Type.NUMBER },
          stage: { type: Type.STRING },
          target: { type: Type.STRING }
        },
        required: ['action', 'item']
      }
    }
  });

  try {
    const result = JSON.parse(response.text || '{}');
    return { ...result, originalText: text };
  } catch (e) {
    return { action: 'UNKNOWN', item: '', originalText: text };
  }
};

export const getDHRSummary = async (batch: StockBatch): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a formal Device History Record (DHR) summary for this surgical batch: ${JSON.stringify(batch)}. 
    Include raw material lineage, stage timestamps, and QC sign-offs. Tone: Regulatory compliant.`,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text || "Failed to generate DHR summary.";
};

export const analyzeWIPBottlenecks = async (batches: StockBatch[]): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze these Work-In-Progress (WIP) batches and identify production bottlenecks: ${JSON.stringify(batches)}. Provide actionable insights for a floor manager.`,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text || "No insights available.";
};

export const getStrategicFactoryReport = async (data: { products: Product[], wip: StockBatch[], txs: Transaction[] }): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Perform a deep reasoning analysis of our entire manufacturing operation. 
    Context:
    Products: ${JSON.stringify(data.products.length)} units in catalog.
    WIP: ${JSON.stringify(data.wip)}
    Sales Velocity: ${JSON.stringify(data.txs.slice(0, 5))}
    
    Objective: Identify hidden inefficiencies, predict supply chain shocks, and recommend a 30-day strategy.`,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text || "Strategic report generation failed.";
};

export const generateRecallNotice = async (batchId: string, reason: string): Promise<{ whatsapp: string; email: string }> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Draft a professional medical recall notification for Batch ID: ${batchId}. Reason: ${reason}. Return JSON with "whatsapp" and "email" keys.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          whatsapp: { type: Type.STRING },
          email: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{"whatsapp": "", "email": ""}');
};

export const getProductionForecast = async (transactions: Transaction[], products: Product[]): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Based on current inventory levels and past 30 days of sales: ${JSON.stringify({ transactions: transactions.length, stock: products.length })}, predict production demand for the next 30 days. Be specific about which instruments need scaling.`,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text || "Forecasting unavailable.";
};

export const getAdvisorResponse = async (
  query: string,
  context: { products: Product[], transactions: Transaction[] },
  deepThinking: boolean = false
): Promise<string> => {
  const contextPrompt = `
    Context:
    Products: ${JSON.stringify(context.products.map(p => ({ name: p.name, stock: p.stock, cat: p.category, loc: p.warehouseLocation, wdid: p.warehouseIdentity })))}
    Recent Sales: ${context.transactions.length}
    User Query: "${query}"
    
    If asked where a product is, provide its WDID and precise Aisle/Rack location.
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: contextPrompt,
    config: {
      systemInstruction: "You are SurgiFlow AI. Expert in manufacturing, compliance, and logistics. Be brief, professional, and data-driven. Always provide exact warehouse coordinates (WDID) when asked about item location.",
      thinkingConfig: deepThinking ? { thinkingBudget: 32768 } : { thinkingBudget: 0 }
    }
  });
  return response.text || "I'm sorry, I couldn't compute that advice.";
};

export const identifyTool = async (base64Image: string): Promise<{ name: string; confidence: number; category: string; description: string; wdid?: string }> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: "Identify surgical tool or warehouse tag. Return JSON with name, confidence, category, description. If it looks like a warehouse tag, try to extract 'wdid'." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          category: { type: Type.STRING },
          description: { type: Type.STRING },
          wdid: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
