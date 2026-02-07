import { useTranslation } from 'react-i18next';

export function useFont() {
  const { i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';

  return {
    regular: isTamil ? 'NotoSansTamil_400Regular' : 'Inter_400Regular',
    medium: isTamil ? 'NotoSansTamil_500Medium' : 'Inter_500Medium',
    semiBold: isTamil ? 'NotoSansTamil_600SemiBold' : 'Inter_600SemiBold',
    bold: isTamil ? 'NotoSansTamil_700Bold' : 'Inter_700Bold',
  };
}
