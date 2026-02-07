export interface Lesson {
  id: string;
  title_ta: string;
  title_en: string;
  category: string;
  icon: string;
  color: string;
  content_ta: string[];
  content_en: string[];
  example_ta?: string;
  example_en?: string;
  relatedCalculator?: string;
}

export const lessons: Lesson[] = [
  {
    id: 'savings_basics',
    title_ta: 'சேமிப்பு ஏன் முக்கியம்?',
    title_en: 'Why is Saving Important?',
    category: 'basics',
    icon: 'wallet',
    color: '#0D7C5F',
    content_ta: [
      'சேமிப்பு என்பது உங்கள் வருமானத்தில் ஒரு பகுதியை எதிர்காலத்திற்காக ஒதுக்குவது.',
      'ஒவ்வொரு மாதமும் குறைந்தது 10% வருமானத்தை சேமிக்க முயற்சியுங்கள்.',
      'திடீர் செலவுகளுக்கு (மருத்துவம், வேலை இழப்பு) 3-6 மாத செலவுக்கு சமான தொகையை வைத்திருங்கள்.',
      'வங்கி சேமிப்புக் கணக்கில் பணம் போடுங்கள் - வீட்டில் வைப்பதை விட பாதுகாப்பானது.'
    ],
    content_en: [
      'Saving means setting aside a portion of your income for the future.',
      'Try to save at least 10% of your income every month.',
      'Keep 3-6 months of expenses as emergency fund for sudden needs (medical, job loss).',
      'Put money in bank savings account - safer than keeping at home.'
    ],
    example_ta: 'உதாரணம்: மாதம் ₹15,000 சம்பாதித்தால், ₹1,500 சேமியுங்கள். ஒரு வருடத்தில் ₹18,000 சேமிப்பு!',
    example_en: 'Example: If you earn ₹15,000/month, save ₹1,500. In one year, you\'ll have ₹18,000 saved!',
  },
  {
    id: 'compound_interest',
    title_ta: 'கூட்டு வட்டியின் மாயாஜாலம்',
    title_en: 'The Magic of Compound Interest',
    category: 'basics',
    icon: 'trending-up',
    color: '#3B82F6',
    content_ta: [
      'தனி வட்டி: ₹10,000-க்கு 10% = ₹1,000 ஒவ்வொரு வருடமும்.',
      'கூட்டு வட்டி: முதல் வருடம் ₹1,000, இரண்டாம் வருடம் ₹1,100 (₹11,000-க்கு 10%), மூன்றாம் வருடம் ₹1,210.',
      'வட்டிக்கும் வட்டி கிடைப்பதால் உங்கள் பணம் வேகமாக வளரும்.',
      'எவ்வளவு சீக்கிரம் ஆரம்பிக்கிறீர்களோ, அவ்வளவு அதிகம் பலன்!'
    ],
    content_en: [
      'Simple Interest: 10% on ₹10,000 = ₹1,000 every year.',
      'Compound Interest: Year 1 = ₹1,000, Year 2 = ₹1,100 (10% on ₹11,000), Year 3 = ₹1,210.',
      'Since interest earns interest, your money grows faster.',
      'The earlier you start, the more you benefit!'
    ],
    example_ta: '₹10,000 10% கூட்டு வட்டியில் 20 ஆண்டுகளில் ₹67,275 ஆகும்!',
    example_en: '₹10,000 at 10% compound interest becomes ₹67,275 in 20 years!',
    relatedCalculator: 'compound',
  },
  {
    id: 'sip_investing',
    title_ta: 'SIP முதலீடு - சிறிதாக ஆரம்பியுங்கள்',
    title_en: 'SIP Investment - Start Small',
    category: 'investing',
    icon: 'bar-chart',
    color: '#8B5CF6',
    content_ta: [
      'SIP = ஒவ்வொரு மாதமும் ஒரு குறிப்பிட்ட தொகையை மியூச்சுவல் ஃபண்டில் போடுவது.',
      'குறைந்தது ₹500 இருந்தே ஆரம்பிக்கலாம்.',
      'விலை அதிகமானால் குறைவான யூனிட்கள், விலை குறைந்தால் அதிக யூனிட்கள் - இது சராசரி செலவு.',
      'நீண்ட காலத்தில் (10-20 ஆண்டுகள்) மிகச்சிறந்த பலன் தரும்.'
    ],
    content_en: [
      'SIP = Investing a fixed amount every month in mutual funds.',
      'You can start with as little as ₹500.',
      'When price is high, you get fewer units. When low, more units - this averages your cost.',
      'Best results come in long term (10-20 years).'
    ],
    example_ta: '₹2,000/மாதம் SIP 12% வருமானத்தில் 15 ஆண்டுகளில் ₹10 லட்சம் ஆகும்!',
    example_en: '₹2,000/month SIP at 12% returns becomes ₹10 lakhs in 15 years!',
    relatedCalculator: 'sip',
  },
  {
    id: 'loan_basics',
    title_ta: 'கடன் - தெரிந்துகொள்ள வேண்டியவை',
    title_en: 'Loans - What You Should Know',
    category: 'basics',
    icon: 'cash',
    color: '#EF4444',
    content_ta: [
      'கடன் வாங்கும் முன் EMI எவ்வளவு என கணக்கிடுங்கள்.',
      'EMI உங்கள் மாத வருமானத்தின் 40%-க்கு மிகாமல் இருக்க வேண்டும்.',
      'குறைந்த வட்டி விகிதம் = குறைந்த EMI. வங்கிகளை ஒப்பிட்டு பாருங்கள்.',
      'தனிநபர் கடன் வட்டி (12-18%) > வீட்டுக் கடன் வட்டி (8-9%). எப்போதும் குறைந்த வட்டியை தேர்வு செய்யுங்கள்.'
    ],
    content_en: [
      'Calculate EMI before taking any loan.',
      'EMI should not exceed 40% of your monthly income.',
      'Lower interest rate = lower EMI. Compare banks before choosing.',
      'Personal loan interest (12-18%) > Home loan interest (8-9%). Always choose lowest rate.'
    ],
    example_ta: '₹5 லட்சம் கடன் 12% வட்டியில் 3 ஆண்டுகள் = EMI ₹16,607',
    example_en: '₹5 lakh loan at 12% for 3 years = EMI ₹16,607',
    relatedCalculator: 'emi',
  },
  {
    id: 'govt_schemes',
    title_ta: 'அரசு திட்டங்களை பயன்படுத்துங்கள்',
    title_en: 'Use Government Schemes',
    category: 'schemes',
    icon: 'flag',
    color: '#F59E0B',
    content_ta: [
      'தமிழ்நாடு அரசு பல இலவச திட்டங்களை வழங்குகிறது.',
      'ஆதார் அட்டை, வருமானச் சான்றிதழ், குடும்ப அட்டை - இவை அடிப்படை ஆவணங்கள்.',
      'e-சேவை மையத்தில் ஆன்லைனில் விண்ணப்பிக்கலாம்.',
      'ஒவ்வொரு திட்டத்திற்கும் கடைசி தேதி உண்டு - சீக்கிரம் விண்ணப்பியுங்கள்!'
    ],
    content_en: [
      'Tamil Nadu government provides many free schemes.',
      'Aadhaar card, income certificate, ration card - these are basic required documents.',
      'You can apply online at e-Sevai centers.',
      'Every scheme has a deadline - apply early!'
    ],
    example_ta: 'CM காப்பீட்டுத் திட்டத்தில் பதிவு செய்தால் ₹5 லட்சம் வரை இலவச சிகிச்சை கிடைக்கும்.',
    example_en: 'Registering in CM Insurance Scheme gives free treatment up to ₹5 lakhs.',
  },
  {
    id: 'budgeting',
    title_ta: 'வீட்டு பட்ஜெட் வைப்பது எப்படி?',
    title_en: 'How to Make a Home Budget?',
    category: 'basics',
    icon: 'calculator',
    color: '#14B8A6',
    content_ta: [
      '50-30-20 விதி: வருமானத்தின் 50% அத்தியாவசியத்திற்கு, 30% விருப்பங்களுக்கு, 20% சேமிப்புக்கு.',
      'ஒவ்வொரு செலவையும் குறித்து வையுங்கள் - சிறிய செலவுகளும் சேர்ந்தால் பெரியதாகும்.',
      'தேவை vs விருப்பம் என பிரித்து பாருங்கள்.',
      'கடன் தவணை + வாடகை = மாத வருமானத்தின் 50%-க்கு மிகக்கூடாது.'
    ],
    content_en: [
      '50-30-20 rule: 50% of income for needs, 30% for wants, 20% for savings.',
      'Track every expense - small expenses add up to become big ones.',
      'Separate needs vs wants in your spending.',
      'Loan EMI + rent should not exceed 50% of monthly income.'
    ],
    example_ta: 'மாதம் ₹20,000 வருமானம்: ₹10,000 அத்தியாவசியம் + ₹6,000 விருப்பம் + ₹4,000 சேமிப்பு',
    example_en: 'Monthly income ₹20,000: ₹10,000 essentials + ₹6,000 wants + ₹4,000 savings',
  },
];
