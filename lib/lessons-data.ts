export type LessonVideo = {
  title: string;
  url: string;
};

export interface Lesson {
  id: string;
  icon: string;
  color: string;
  title_en: string;
  title_ta: string;
  content_en: string;
  content_ta: string;
  video_en: LessonVideo;
  video_ta: LessonVideo;
}

export const lessons: Lesson[] = [
  {
    id: 'sip',
    icon: 'trending-up',
    color: '#6366F1',
    title_en: 'What is SIP?',
    title_ta: 'SIP என்றால் என்ன?',
    content_en:
      'SIP stands for Systematic Investment Plan. It is a method of investing a fixed amount regularly in a mutual fund. Instead of investing a large amount at once, SIP allows you to invest small amounts every month. This helps you develop a disciplined investing habit and reduces the risk of market timing. SIP also benefits from compounding and rupee cost averaging. Over time, even small investments can grow into a large amount when invested consistently.',
    content_ta:
      'SIP என்பது Systematic Investment Plan என்பதன் சுருக்கம். இது Mutual Fund இல் ஒவ்வொரு மாதமும் ஒரு நிரந்தர தொகையை முதலீடு செய்யும் முறையாகும். ஒரே நேரத்தில் பெரிய தொகையை முதலீடு செய்வதற்குப் பதிலாக, SIP மூலம் சிறிய தொகைகளை தொடர்ந்து முதலீடு செய்யலாம். இது ஒழுங்கான முதலீட்டு பழக்கத்தை உருவாக்க உதவுகிறது. மேலும் rupee cost averaging மற்றும் compounding போன்ற நன்மைகளையும் வழங்குகிறது.',
    video_en: {
      title: 'SIP Explained for Beginners',
      url: 'https://youtu.be/ursAwMH1ow0',
    },
    video_ta: {
      title: 'SIP எளிய விளக்கம்',
      url: 'https://youtu.be/C2p7Bf1vNeA',
    },
  },
  {
    id: 'mutual-fund',
    icon: 'pie-chart',
    color: '#10B981',
    title_en: 'What is Mutual Fund?',
    title_ta: 'Mutual Fund என்றால் என்ன?',
    content_en:
      'A mutual fund is a financial investment vehicle that pools money from many investors and invests it in stocks, bonds, or other assets. The investment decisions are managed by professional fund managers. Mutual funds help investors diversify their investments and reduce risk. They are suitable for beginners because investors do not need deep market knowledge to start investing.',
    content_ta:
      'Mutual Fund என்பது பல முதலீட்டாளர்களிடமிருந்து பணத்தை சேகரித்து பங்குகள், பத்திரங்கள் போன்ற முதலீடுகளில் முதலீடு செய்யும் ஒரு நிதி கருவியாகும். இது professional fund managers மூலம் நிர்வகிக்கப்படுகிறது. Mutual Funds மூலம் முதலீட்டாளர்கள் diversification பெற முடியும் மற்றும் அபாயத்தை குறைக்க முடியும்.',
    video_en: {
      title: 'Mutual Fund Explained',
      url: 'https://youtu.be/PbldLCsspgE',
    },
    video_ta: {
      title: 'Mutual Fund தமிழ் விளக்கம்',
      url: 'https://youtu.be/HVu4lQhw8ao',
    },
  },
  {
    id: 'budgeting',
    icon: 'wallet',
    color: '#F59E0B',
    title_en: 'What is Budgeting?',
    title_ta: 'Budgeting என்றால் என்ன?',
    content_en:
      'Budgeting is the process of planning how to spend and save your money. It helps you track your income and expenses so that you can avoid overspending and save for future goals. A good budget ensures that essential expenses are covered while also allowing savings and investments.',
    content_ta:
      'Budgeting என்பது உங்கள் வருமானம் மற்றும் செலவுகளை திட்டமிடும் செயல்முறை ஆகும். இது தேவையற்ற செலவுகளை குறைத்து சேமிப்பை அதிகரிக்க உதவுகிறது. ஒரு நல்ல budget மூலம் எதிர்கால இலக்குகளுக்காக பணத்தை சேமிக்க முடியும்.',
    video_en: {
      title: 'Budgeting Basics',
      url: 'https://youtu.be/-bqeNE1DOzA',
    },
    video_ta: {
      title: 'Budget எப்படி செய்வது',
      url: 'https://youtu.be/Q4KKkJW_ZFo',
    },
  },
  {
    id: 'emergency-fund',
    icon: 'shield-checkmark',
    color: '#EF4444',
    title_en: 'What is Emergency Fund?',
    title_ta: 'Emergency Fund என்றால் என்ன?',
    content_en:
      'An emergency fund is money saved specifically for unexpected situations such as medical emergencies, job loss, or urgent repairs. Financial experts recommend saving at least 3-6 months of living expenses in an emergency fund. This helps avoid debt during financial crises.',
    content_ta:
      'Emergency Fund என்பது எதிர்பாராத சூழ்நிலைகளுக்கு சேமித்து வைக்கப்படும் பணமாகும். மருத்துவ அவசர நிலை, வேலை இழப்பு அல்லது பிற அவசர செலவுகளுக்கு இந்த பணம் பயன்படும். பொதுவாக 3 முதல் 6 மாத செலவுகளை சேமித்து வைத்திருக்க பரிந்துரைக்கப்படுகிறது.',
    video_en: {
      title: 'Emergency Fund Explained',
      url: 'https://youtu.be/vO2KGm8NM8E',
    },
    video_ta: {
      title: 'Emergency Fund முக்கியம்',
      url: 'https://youtu.be/POaW7B3J0LI',
    },
  },
  {
    id: 'compound-interest',
    icon: 'analytics',
    color: '#8B5CF6',
    title_en: 'What is Compound Interest?',
    title_ta: 'Compound Interest என்றால் என்ன?',
    content_en:
      'Compound interest is the interest calculated on both the original principal and the accumulated interest from previous periods. This means your money grows faster because you earn interest on interest. It is one of the most powerful concepts in investing.',
    content_ta:
      'Compound Interest என்பது முதலீடு செய்த பணத்திற்கும் அதன் வட்டிக்கும் மீண்டும் வட்டி கிடைக்கும் முறையாகும். இதனால் காலப்போக்கில் உங்கள் முதலீடு வேகமாக வளர்கிறது. இது முதலீட்டில் மிகவும் முக்கியமான கருத்தாகும்.',
    video_en: {
      title: 'Compound Interest Explained',
      url: 'https://youtu.be/jMoLkEcGHCo',
    },
    video_ta: {
      title: 'Compound Interest தமிழ்',
      url: 'https://youtu.be/pCZt7Zd-YHQ',
    },
  },
];
