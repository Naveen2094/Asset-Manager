import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';

type CalculatorInfoType = 'fd' | 'rd' | 'inflation' | 'gst' | 'tax' | 'retirement';

const calculatorInfo: Record<
  CalculatorInfoType,
  {
    en: { title: string; description: string; how: string };
    ta: { title: string; description: string; how: string };
  }
> = {
  fd: {
    en: {
      title: 'FD Calculator',
      description:
        'A Fixed Deposit calculator helps estimate how much your lump-sum savings may grow when invested in a bank for a fixed period.',
      how:
        'The estimate is based on the deposit amount, the interest rate offered by the bank, and how long the money remains invested.',
    },
    ta: {
      title: 'FD கணிப்பான்',
      description:
        'நிலையான காலத்திற்கு வங்கியில் முதலீடு செய்யப்படும் தொகை காலப்போக்கில் எவ்வளவு அதிகரிக்கும் என்பதை கணிக்க Fixed Deposit கணிப்பான் உதவுகிறது.',
      how:
        'இந்த கணிப்பு முதலீட்டு தொகை, வங்கி வழங்கும் வட்டி விகிதம் மற்றும் முதலீட்டு கால அளவை அடிப்படையாகக் கொண்டது.',
    },
  },
  rd: {
    en: {
      title: 'RD Calculator',
      description:
        'A Recurring Deposit calculator estimates how much your regular monthly savings can grow when deposited in a bank account.',
      how:
        'The estimate is calculated using the monthly deposit amount, interest rate and the duration of the savings period.',
    },
    ta: {
      title: 'RD கணிப்பான்',
      description:
        'Recurring Deposit கணிப்பான் மாதந்தோறும் சேமிக்கப்படும் பணம் காலப்போக்கில் எவ்வளவு அதிகரிக்கும் என்பதை கணிக்க உதவுகிறது.',
      how:
        'இந்த கணிப்பு மாதாந்திர சேமிப்பு தொகை, வட்டி விகிதம் மற்றும் சேமிப்பு காலத்தை அடிப்படையாகக் கொண்டது.',
    },
  },
  inflation: {
    en: {
      title: 'Inflation Calculator',
      description:
        'An inflation calculator shows how the value of money may decrease over time as prices increase.',
      how:
        'The estimate compares the current cost of something with how much it may cost in the future based on the inflation rate and number of years.',
    },
    ta: {
      title: 'Inflation கணிப்பான்',
      description:
        'பொருட்களின் விலை உயர்வால் பணத்தின் மதிப்பு காலப்போக்கில் எவ்வாறு குறைகிறது என்பதை Inflation கணிப்பான் விளக்குகிறது.',
      how:
        'இந்த கணிப்பு தற்போதைய செலவு, பணவீக்க விகிதம் மற்றும் எதிர்கால ஆண்டுகளை அடிப்படையாகக் கொண்டது.',
    },
  },
  gst: {
    en: {
      title: 'GST Calculator',
      description:
        'A GST calculator helps estimate the tax added to a product or service based on the GST rate.',
      how:
        'The calculation uses the base price of the product and the GST percentage to determine the tax amount and final price.',
    },
    ta: {
      title: 'GST கணிப்பான்',
      description:
        'ஒரு பொருள் அல்லது சேவைக்கு சேர்க்கப்படும் GST வரியை கணிக்க GST கணிப்பான் உதவுகிறது.',
      how:
        'இந்த கணிப்பு பொருளின் அடிப்படை விலை மற்றும் GST சதவீதத்தை பயன்படுத்தி மொத்த விலையை கணக்கிடுகிறது.',
    },
  },
  tax: {
    en: {
      title: 'Income Tax Calculator',
      description:
        'An income tax calculator estimates how much tax may be payable based on annual income.',
      how:
        'The calculation applies different tax rates to different income ranges according to simplified tax slab rules.',
    },
    ta: {
      title: 'Income Tax கணிப்பான்',
      description:
        'வருடாந்திர வருமானத்தை அடிப்படையாகக் கொண்டு செலுத்த வேண்டிய வருமான வரியை கணிக்க Income Tax கணிப்பான் உதவுகிறது.',
      how:
        'இந்த கணிப்பு இந்திய வருமான வரி நிலைப்பட்டிகளின் அடிப்படையில் வருமானத்திற்கு பொருந்தும் வரி விகிதங்களை பயன்படுத்துகிறது.',
    },
  },
  retirement: {
    en: {
      title: 'Retirement Calculator',
      description:
        'A retirement calculator helps estimate how much wealth may be accumulated by saving and investing regularly until retirement.',
      how:
        'The estimate uses regular investment amounts, expected returns and the number of years remaining before retirement.',
    },
    ta: {
      title: 'Retirement கணிப்பான்',
      description:
        'ஓய்வு பெறும் காலத்திற்கு முன் தொடர்ந்து சேமித்து முதலீடு செய்வதன் மூலம் எவ்வளவு செல்வம் சேரலாம் என்பதை Retirement கணிப்பான் கணிக்க உதவுகிறது.',
      how:
        'இந்த கணிப்பு முதலீட்டு தொகை, எதிர்பார்க்கப்படும் வருமான விகிதம் மற்றும் ஓய்வு பெறும் வரை உள்ள ஆண்டுகளை அடிப்படையாகக் கொண்டது.',
    },
  },
};

export default function CalculatorInfo({ type }: { type: CalculatorInfoType }) {
  const { i18n } = useTranslation();
  const fonts = useFont();
  const isTamil = i18n.language?.startsWith('ta');
  const language = isTamil ? 'ta' : 'en';
  const info = calculatorInfo[type][language];

  return (
    <View style={styles.card}>
      <Text style={[styles.title, { fontFamily: fonts.semiBold }]}>{info.title}</Text>

      <Text style={[styles.sectionTitle, { fontFamily: fonts.semiBold }]}>
        {isTamil ? 'இந்த கணிப்பான் பற்றி' : 'About this Calculator'}
      </Text>
      <Text style={[styles.text, { fontFamily: fonts.regular }]}>{info.description}</Text>

      <Text style={[styles.sectionTitle, styles.howTitle, { fontFamily: fonts.semiBold }]}>
        {isTamil ? 'இது எப்படி வேலை செய்கிறது' : 'How it works'}
      </Text>
      <Text style={[styles.text, { fontFamily: fonts.regular }]}>{info.how}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    color: Colors.primary,
    marginBottom: 6,
  },
  howTitle: {
    marginTop: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
});
