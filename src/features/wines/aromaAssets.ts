import apple from '../../assets/aromas/apple.png';
import cherry from '../../assets/aromas/cherry.png';
import chocolate from '../../assets/aromas/chocolate.png';
import citrus from '../../assets/aromas/citrus.png';
import coconut from '../../assets/aromas/coconut.png';
import flower from '../../assets/aromas/flower.png';
import grape from '../../assets/aromas/grape.png';
import grass from '../../assets/aromas/grass.png';
import herb from '../../assets/aromas/herb.png';
import mineral from '../../assets/aromas/mineral.png';
import oakCask from '../../assets/aromas/oak-cask.png';
import peach from '../../assets/aromas/peach.png';
import toast from '../../assets/aromas/toast.png';
import tropical from '../../assets/aromas/tropical.png';
import wetSoil from '../../assets/aromas/wet-soil.png';

export const aromaOptions = [
  '체리',
  '포도',
  '오크',
  '초콜릿',
  '시트러스',
  '코코넛',
  '꽃',
  '풀',
  '허브',
  '미네랄',
  '사과',
  '복숭아',
  '토스트',
  '트로피컬',
  '젖은 흙',
] as const;

const aromaImages: Record<string, string> = {
  사과: apple,
  체리: cherry,
  초콜릿: chocolate,
  초콜렛: chocolate,
  시트러스: citrus,
  코코넛: coconut,
  꽃: flower,
  풀: grass,
  허브: herb,
  스파이스: herb,
  후추: herb,
  미네랄: mineral,
  오크: oakCask,
  복숭아: peach,
  포도: grape,
  베리: grape,
  블랙베리: grape,
  토스트: toast,
  제빵: toast,
  트로피컬: tropical,
  '젖은 흙': wetSoil,
  바닐라: coconut,
};

export const getAromaImage = (name: string) => aromaImages[name] ?? grape;
