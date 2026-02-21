export type Language = "bn" | "en";
export type Currency = "BDT" | "USD" | "EUR";

export interface CurrencyConfig {
  symbol: string;
  code: Currency;
  label: string;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  BDT: { symbol: "৳", code: "BDT", label: "BDT (৳)" },
  USD: { symbol: "$", code: "USD", label: "USD ($)" },
  EUR: { symbol: "€", code: "EUR", label: "EUR (€)" },
};

export interface Translations {
  // Common
  common: {
    poweredBy: string;
    login: string;
    logout: string;
    signUp: string;
    submit: string;
    loading: string;
    back: string;
    home: string;
    copy: string;
    copied: string;
    learnMore: string;
    getStarted: string;
    viewPricing: string;
    startFreeAnalysis: string;
    analyzeNow: string;
  };

  // Nav
  nav: {
    home: string;
    services: string;
    mentorship: string;
    pricing: string;
    blog: string;
    history: string;
    admin: string;
    analyze: string;
  };

  // Hero (Index)
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine3: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustedUsers: string;
  };

  // Features
  features: {
    sectionTag: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    realityCheck: string;
    realityCheckDesc: string;
    sourcingGuide: string;
    sourcingGuideDesc: string;
    deliverySetup: string;
    deliverySetupDesc: string;
    marketingPlan: string;
    marketingPlanDesc: string;
  };

  // Process
  process: {
    sectionTag: string;
    title: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };

  // Metrics
  metrics: {
    ideasAnalyzed: string;
    happyUsers: string;
    activeUsers: string;
    successStories: string;
  };

  // Pricing
  pricing: {
    pageTitle: string;
    pageTitleHighlight: string;
    pageSubtitle: string;
    freePlan: string;
    freePrice: string;
    freeDesc: string;
    singlePlan: string;
    singleDesc: string;
    unlimitedPlan: string;
    unlimitedDesc: string;
    perAnalysis: string;
    perMonth: string;
    forever: string;
    mostPopular: string;
    buyNow: string;
    subscribe: string;
    startFree: string;
    faq: string;
    faqTitle: string;
    securePayment: string;
    instantAccess: string;
    support247: string;
    moneyBack: string;
    whatYouGet: string;
    detailedReport: string;
    growthStrategy: string;
    expertInsights: string;
    lifetimeAccess: string;
    readyToStart: string;
    readyToStartDesc: string;
    startNow: string;
  };

  // Analyze page
  analyze: {
    title: string;
    subtitle: string;
    businessIdeaLabel: string;
    businessIdeaPlaceholder: string;
    businessIdeaHint: string;
    businessType: string;
    online: string;
    offline: string;
    both: string;
    budgetRange: string;
    budgetLow: string;
    budgetMid: string;
    budgetHigh: string;
    whatsappLabel: string;
    whatsappPlaceholder: string;
    whatsappHint: string;
    whatsappError: string;
    whatsappRequired: string;
    locationLabel: string;
    locationPlaceholder: string;
    optional: string;
    analyzeButton: string;
    analyzing: string;
    freeRemaining: string;
    premiumSubscriber: string;
    freeExhausted: string;
    freeExhaustedDesc: string;
    getSubscription: string;
    viewPrevious: string;
  };

  // Services
  services: {
    heroTag: string;
    heroTitle: string;
    heroTitleHighlight: string;
    heroTitleEnd: string;
    heroSubtitle: string;
    backHome: string;
    ourServices: string;
    ourServicesSubtitle: string;
    landingPage: string;
    ecommerce: string;
    mobileApp: string;
    customSoftware: string;
    startingFrom: string;
    delivery: string;
    popular: string;
    freeConsultation: string;
    freeConsultationDesc: string;
    yourName: string;
    whatsappNumber: string;
    email: string;
    emailOptional: string;
    businessIdea: string;
    selectService: string;
    budgetRange: string;
    submitRequest: string;
    submitting: string;
    thankYou: string;
    thankYouDesc: string;
    messageOnWhatsApp: string;
    clientTestimonials: string;
    verified: string;
    qualitySolution: string;
    fastDelivery: string;
    deliveryGuarantee: string;
    support247: string;
    continuousSupport: string;
    projects100: string;
    provenTrack: string;
  };

  // Payment
  payment: {
    title: string;
    paymentMethod: string;
    instructions: string;
    numberLabel: string;
    transactionId: string;
    transactionIdPlaceholder: string;
    yourNumber: string;
    yourNumberPlaceholder: string;
    submitPayment: string;
    submitting: string;
    verificationPending: string;
    verificationDesc: string;
    myAnalyses: string;
    newAnalysis: string;
    noMethods: string;
    goBack: string;
  };

  // Mentorship
  mentorship: {
    title: string;
    subtitle: string;
    paymentTitle: string;
    backToMentorship: string;
    sessions: string;
    moreSessions: string;
    goHome: string;
    paymentSubmitted: string;
    paymentSubmittedDesc: string;
  };

  // Auth
  auth: {
    loginTitle: string;
    signUpTitle: string;
    emailLabel: string;
    passwordLabel: string;
    fullNameLabel: string;
    loginButton: string;
    signUpButton: string;
    switchToSignUp: string;
    switchToLogin: string;
    noAccount: string;
    hasAccount: string;
  };

  // Footer
  footer: {
    description: string;
    quickLinks: string;
    contact: string;
    rights: string;
  };

  // FAQ
  faq: {
    howItWorks: string;
    howItWorksAnswer: string;
    onlyBangladesh: string;
    onlyBangladeshAnswer: string;
    howLong: string;
    howLongAnswer: string;
    howToPay: string;
    howToPayAnswer: string;
  };

  // Testimonials
  testimonials: {
    sectionTitle: string;
  };

  // Benefits
  benefits: {
    noMotivational: string;
    bangladeshContext: string;
    actionPlan: string;
    allInOne: string;
  };

  // CTA
  cta: {
    title: string;
    subtitle: string;
  };
}
