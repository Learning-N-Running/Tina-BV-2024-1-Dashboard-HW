import s from './index.module.scss';
import Notice from '@/components/atoms/dashboard/Notice';
import TransactionsInfoHeader from '@/components/atoms/dashboard/TransactionsInfoHeader';
import SingleTransactionInfo from '@/components/organs/SingleTransactionInfo';
import { NoticeType } from '@/libs/types';
import { UserTransactionsContext, WalletContext } from '@/store/GlobalContext';
import { useContext } from 'react';

/* 
  [HW 1-3] 지갑 연결 기능 개발하기
  - 아래 TransactionsInfo 컴포넌트에 기능을 추가하여,  지갑이 연결되기 전, 지갑이 연결되지 않았음을 안내하는 기능을 추가해 주세요.
*/

export default function TransactionsInfo() {
  const [userTransactions] = useContext(UserTransactionsContext);
  const { wallet, connect, disconnect } = useContext(WalletContext);

  return (
    <div className={s.info}>
      <div className={s.title}>거래 기록</div>
      <div className={s.container}>
        <TransactionsInfoHeader></TransactionsInfoHeader>
        {wallet ? (
          <div className={s.transaction_list}>
            {userTransactions.length === 0 ? (
              <div className={s.notice_container}>
                <Notice noticeType={NoticeType.NO_TRANSACTION}></Notice>
              </div>
            ) : (
              userTransactions.map((userTransaction) => {
                return (
                  <SingleTransactionInfo
                    key={userTransaction.transactionHash}
                    assetAddress={userTransaction.assetInfo.address}
                    symbol={userTransaction.assetInfo.symbol}
                    name={userTransaction.assetInfo.name}
                    targetAddress={userTransaction.targetAddress}
                    status={userTransaction.status}
                    amount={userTransaction.transferAmount}
                    timestamp={userTransaction.timestamp}
                  ></SingleTransactionInfo>
                );
              })
            )}
          </div>
        ) : (
          <div className={s.notice_container}>
            <Notice noticeType={NoticeType.TRANSACTION_WALLET_NOT_CONNECTED}></Notice>
          </div>
        )}
      </div>
    </div>
  );
}
