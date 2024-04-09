import { UIProps } from '../../props';
import s from './index.module.scss';
import OverAmount from '@/public/assets/OverAmountIcon.png';
import UnderAmount from '@/public/assets/UnderAmountIcon.png';
import Image from 'next/image';

interface AmountProps extends UIProps.Div {
  balance: string;
  symbol: string;
}

export default function Amount({ balance, symbol }: AmountProps) {
  return (
    <div className={s.amount_container}>
      {displayOverUnderDecimal(balance)}
      <div className={s.amount_balance}>{formatBalance(balance)}</div>
      <div className={s.amount_symbol}>{formatSymbol(symbol)}</div>
    </div>
  );
}

function displayOverUnderDecimal(balance: string) {
  if (Number(balance) > 9999999) {
    return <Image src={OverAmount} alt="overAmount" width={13} height={13} className={s.amount_overUnderDecimal} />;
  } else if (Number(balance) < 0.0001) {
    return <Image src={UnderAmount} alt="underAmount" width={13} height={13} className={s.amount_overUnderDecimal} />;
  } else {
    return;
  }
}

function formatBalance(balance: string) {
  // 9,999,999 초과 검사
  if (Number(balance) > 9999999) {
    return '9999999';
  }

  // 0.0001 미만 검사
  if (Number(balance) < 0.0001) {
    return '0.0001';
  }

  // 정수 및 소수 분리
  const [integerPart, decimalPart] = balance.split('.');

  // 정수 처리
  if (!decimalPart) {
    if (integerPart.length > 4) {
      // 유효 숫자가 4개가 되도록 정수 부분을 조정
      const roundedInteger =
        Math.round(parseInt(integerPart) / Math.pow(10, integerPart.length - 4)) * Math.pow(10, integerPart.length - 4);
      return roundedInteger.toString();
    }
    // 정수의 길이가 4 이하인 경우 그대로 반환
    return integerPart;
  }

  // 소수 처리
  if (decimalPart) {
    // 총 유효 숫자가 4개가 되도록 조정
    const totalDigits = 4 - integerPart.length;
    if (totalDigits > 0) {
      // 소수 부분이 존재하고 총 유효 숫자를 맞춤
      const fixedDecimal = parseFloat(balance).toFixed(totalDigits);
      const trimmedDecimal = parseFloat(fixedDecimal).toString();
      return trimmedDecimal;
    } else {
      // 정수 부분의 길이가 4 이상인 경우, 소수점 이하를 제거
      return integerPart;
    }
  }
}

function formatSymbol(symbol: string) {
  const symbolLength = symbol.length;
  if (symbolLength <= 7) {
    return symbol;
  } else {
    return `${symbol.substring(0, 5)}...`;
  }
}
