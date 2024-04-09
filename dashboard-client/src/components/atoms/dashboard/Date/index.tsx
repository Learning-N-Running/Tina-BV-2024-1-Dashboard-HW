import s from './index.module.scss';

export default function CustomDate() {
  return <div className={s.date_container}>39초 전</div>;
} // 함수 이름 변경

export function timeSince(transactionTime: string | Date): string {
  // 함수 이름 변경
  const transactionDate: Date = typeof transactionTime === 'string' ? new Date(transactionTime) : transactionTime;
  const now: Date = new Date();
  const secondsPast: number = (now.getTime() - transactionDate.getTime()) / 1000;

  if (secondsPast < 60) {
    // 1분 미만
    return '방금 전';
  } else if (secondsPast < 3600) {
    // 1시간 미만
    return `${Math.floor(secondsPast / 60)}분 전`;
  } else if (secondsPast < 86400) {
    // 24시간 미만
    return `${Math.floor(secondsPast / 3600)}시간 전`;
  } else if (secondsPast < 2592000) {
    // 30일 미만
    return `${Math.floor(secondsPast / 86400)}일 전`;
  } else if (secondsPast < 31536000) {
    // 1년 미만
    return `${Math.floor(secondsPast / 2592000)}개월 전`;
  } else {
    return `${Math.floor(secondsPast / 31536000)}년 전`;
  }
}

// 사용 예시
console.log(timeSince('2023-02-10T15:00:00Z')); // 트랜잭션이 발생한 시간 예시
