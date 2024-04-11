import AddressContainer, { Address, Status } from '@/components/atoms/dashboard/AddressStatus';
import Amount from '@/components/atoms/dashboard/Amount';
import CustomDate from '@/components/atoms/dashboard/Date';
import Date from '@/components/atoms/dashboard/Date';
import SingleAssetInfo from '@/components/organs/SingleAssetInfo';
import SingleTransactionInfo from '@/components/organs/SingleTransactionInfo';
import Popup from '@/components/popups';

export default function Home() {
  return (
    <>
      <Popup />
      <div>
        <Amount balance={'1234.9876'} symbol={'ETH'} />
        <Address address="0xh895fAD9Ee306551590E81799C49e576f6e57c8D" />
        <Status status={'입금'} />
        <Status status={'출금'} />
        <AddressContainer address={'0x7EE6fAD9Ee306551590E81799C49e576f6e57c8D'} status={'출금'} />
        <Date timestamp={0} />
        {/* <SingleAssetInfo
          address={''}
          symbol={''}
          name={''}
          balance={''}
          isEdit={false}
          onSendAsset={function (): void {
            throw new Error('Function not implemented.');
          }}
          onRemoveAsset={function (): void {
            throw new Error('Function not implemented.');
          }}
        /> */}
      </div>
    </>
  );
}
