// Firebase Configuration and Analytics Setup
import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics, logEvent } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Firebase configuration - COMPLETE config required for OAuth
const firebaseConfig = {
    apiKey: "AIzaSyAON9pafgYp0WEfFcxe22wmThFNEkGMxa8",
    authDomain: "surgiflow-8a716.firebaseapp.com",
    projectId: "surgiflow-8a716",
    storageBucket: "surgiflow-8a716.firebasestorage.app",
    messagingSenderId: "557741429456",
    appId: "1:557741429456:web:6e4295de19ea947edd44d5",
    measurementId: "G-43TVXZFPC2"
};

// Initialize Firebase - MUST happen before any auth calls
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication - MUST use the initialized app
export const auth = getAuth(app);

// Initialize Analytics (only in browser)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

export { analytics };

// Analytics helper functions
export const logAnalyticsEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (analytics) {
        logEvent(analytics, eventName, eventParams);
    }
};

// Predefined analytics events for SurgiFlow
export const trackPageView = (pageName: string) => {
    logAnalyticsEvent('page_view', { page_name: pageName });
};

export const trackProductView = (productId: string, productName: string) => {
    logAnalyticsEvent('view_item', {
        item_id: productId,
        item_name: productName,
    });
};

export const trackTransaction = (transactionId: string, value: number, items: number) => {
    logAnalyticsEvent('purchase', {
        transaction_id: transactionId,
        value: value,
        currency: 'USD',
        items: items,
    });
};

export const trackQuotationCreated = (quotationId: string, value: number) => {
    logAnalyticsEvent('generate_lead', {
        quotation_id: quotationId,
        value: value,
        currency: 'USD',
    });
};

export const trackProductionBatch = (batchId: string, stage: string) => {
    logAnalyticsEvent('production_update', {
        batch_id: batchId,
        stage: stage,
    });
};

export const trackAIQuery = (queryType: string, success: boolean) => {
    logAnalyticsEvent('ai_interaction', {
        query_type: queryType,
        success: success,
    });
};

export const trackUserLogin = (method: string) => {
    logAnalyticsEvent('login', {
        method: method,
    });
};

export const trackSearch = (searchTerm: string, resultsCount: number) => {
    logAnalyticsEvent('search', {
        search_term: searchTerm,
        results_count: resultsCount,
    });
};
