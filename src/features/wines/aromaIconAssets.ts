import apple from '../../assets/aroma-icons/apple.png';
import cherry from '../../assets/aroma-icons/cherry.png';
import chocolate from '../../assets/aroma-icons/chocolate.png';
import citrus from '../../assets/aroma-icons/citrus.png';
import coconut from '../../assets/aroma-icons/coconut.png';
import flower from '../../assets/aroma-icons/flower.png';
import grape from '../../assets/aroma-icons/grape.png';
import grass from '../../assets/aroma-icons/grass.png';
import mineral from '../../assets/aroma-icons/mineral.png';
import oak from '../../assets/aroma-icons/oak.png';
import peach from '../../assets/aroma-icons/peach.png';
import toast from '../../assets/aroma-icons/toast.png';
import tropical from '../../assets/aroma-icons/tropical.png';
import wetSoil from '../../assets/aroma-icons/wet-soil.png';

const aromaIcons: Record<string, string> = {
  사과: apple,
  체리: cherry,
  초콜릿: chocolate,
  초콜렛: chocolate,
  시트러스: citrus,
  코코넛: coconut,
  바닐라: coconut,
  꽃: flower,
  풀: grass,
  허브: grass,
  스파이스: grass,
  후추: grass,
  미네랄: mineral,
  오크: oak,
  복숭아: peach,
  포도: grape,
  베리: grape,
  블랙베리: grape,
  토스트: toast,
  제빵: toast,
  트로피컬: tropical,
  트로피칼: tropical,
  '젖은 흙': wetSoil,
  젖은흙: wetSoil,
};

export const getAromaIcon = (name: string) => aromaIcons[name] ?? grape;
