import { Address, AddressContainer, Status } from '@/components/atoms/dashboard/AddressStatus';
import Amount from '@/components/atoms/dashboard/Amount';
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
        <AddressContainer />
      </div>
    </>
  );
}
