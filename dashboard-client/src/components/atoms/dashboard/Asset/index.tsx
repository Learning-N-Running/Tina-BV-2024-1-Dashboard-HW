import { UIProps } from '../../props';
import s from './index.module.scss';
import { addressToDetNum } from '@/libs/utils';
import Ethereum from '@/public/assets/AssetLogoIcon/Ethereum.png';
import Unknown1 from '@/public/assets/AssetLogoIcon/Unknown1.png';
import Unknown2 from '@/public/assets/AssetLogoIcon/Unknown2.png';
import Unknown3 from '@/public/assets/AssetLogoIcon/Unknown3.png';
import Unknown4 from '@/public/assets/AssetLogoIcon/Unknown4.png';
import Unknown5 from '@/public/assets/AssetLogoIcon/Unknown5.png';
import Unknown6 from '@/public/assets/AssetLogoIcon/Unknown6.png';
import Unknown7 from '@/public/assets/AssetLogoIcon/Unknown7.png';
import { ethers } from 'ethers';
import Image from 'next/image';

export interface AssetProps extends UIProps.Div {
  address: string;
  symbol: string;
  name: string;
}

export function getLogo(address: string) {
  if (address === ethers.constants.AddressZero) {
    return <Image src={Ethereum} alt="ethereum" width={28} height={28} />;
  }
  const imageNum = addressToDetNum(address, 7);
  switch (imageNum) {
    case 1:
      return <Image src={Unknown1} alt="unknown1" width={28} height={28} />;
    case 2:
      return <Image src={Unknown2} alt="unknown2" width={28} height={28} />;
    case 3:
      return <Image src={Unknown3} alt="unknown3" width={28} height={28} />;
    case 4:
      return <Image src={Unknown4} alt="unknown4" width={28} height={28} />;
    case 5:
      return <Image src={Unknown5} alt="unknown5" width={28} height={28} />;
    case 6:
      return <Image src={Unknown6} alt="unknown6" width={28} height={28} />;
    default:
      return <Image src={Unknown7} alt="unknown7" width={28} height={28} />;
  }
}

export default function Asset({ address, symbol, name }: AssetProps) {
  return (
    <div className={s.asset_container}>
      {getLogo(address)}
      <div className={s.asset}>
        <div className={s.asset_symbol}>{symbol}</div>
        <div className={s.asset_name}>{name}</div>
      </div>
    </div>
  );
}
