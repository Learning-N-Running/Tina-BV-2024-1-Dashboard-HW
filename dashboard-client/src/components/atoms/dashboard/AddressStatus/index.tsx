import IconButton from '../../button/IconButton';
import s from './index.module.scss';
import { StatusToast } from '@/components/popups/Toast/StatusToast';
import CopyHoverIcon from '@/public/assets/CopyHoverIcon.png';
import CopyIcon from '@/public/assets/CopyIcon.png';
import Success from '@/public/assets/Success.png';
import { ToastContext } from '@/store/GlobalContext';
import copy from 'copy-to-clipboard';
import { useContext } from 'react';

interface AddressProps {
  address: string;
}

export function Address({ address }: AddressProps) {
  const [, setToast] = useContext(ToastContext);
  return (
    <div className={s.address_container}>
      <div className={s.address}>{sliceAddress(address)}</div>
      <IconButton
        icon={CopyIcon}
        hoverIcon={CopyHoverIcon}
        onClick={() => {
          copy(address);
          setToast(<StatusToast icon={Success} content="지갑 주소를 클립보드에 복사했어요." />);
        }}
      />
    </div>
  );
}

export function Status({ status }: { status: string }) {
  if (status === '입금') {
    return <div className={s.status_container_deposit}>입금</div>;
  } else if (status === '출금') {
    return <div className={s.status_container_withdraw}>출금</div>;
  } else {
    return;
  }
}

interface SingleAssetInfoProps {
  address: string;
  status: string;
}

export default function AddressContainer({ address, status }: SingleAssetInfoProps) {
  return (
    <div className={s.addressContainer_container}>
      <Address address={address} />
      <Status status={status} />
    </div>
  );
}

export function sliceAddress(address: string) {
  const slicedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return slicedAddress;
}
