import s from './index.module.scss';
import EditGuide from '@/components/atoms/dashboard/EditGuide';
import Notice from '@/components/atoms/dashboard/Notice';
import SingleAssetInfo from '@/components/organs/SingleAssetInfo';
import AddAssetModal from '@/components/popups/Modal/AddAssetModal';
import SendAssetModal from '@/components/popups/Modal/SendAssetModal';
import { StatusToast } from '@/components/popups/Toast/StatusToast';
import { getCookie } from '@/libs/cookie';
import { COOKIE_KEY, NoticeType } from '@/libs/types';
import ErrorIcon from '@/public/assets/Error.png';
import SuccessIcon from '@/public/assets/Success.png';
import { ModalContext, ToastContext, UserAssetsContext, WalletContext } from '@/store/GlobalContext';
import { AssetInfo, UserAssets } from '@/store/GlobalContext.d';
import { useDeleteAsset } from '@graphql/client';
import { ethers } from 'ethers';
import { useContext, useState } from 'react';

const etherInfo: AssetInfo = { name: 'Ethereum', symbol: 'ETH', address: ethers.constants.AddressZero };

const getEtherBalance = (userAssets: UserAssets) => {
  if (!userAssets) return '0';
  const ethereum = userAssets.find((asset) => asset.assetInfo.address === ethers.constants.AddressZero);
  return ethereum ? ethereum.balance : '0';
};

/* 
  [HW 1-3] 지갑 연결 기능 개발하기
  - 아래 AssetsInfo 컴포넌트에 기능을 추가하여,  지갑이 연결되기 전, 지갑이 연결되지 않았음을 안내하는 기능을 추가해 주세요.
*/

export default function AssetsInfo() {
  const [, setModalContext] = useContext(ModalContext);
  const [, setToast] = useContext(ToastContext);
  const [userAssets, setUserAssets] = useContext(UserAssetsContext);

  const [isEdit, setIsEdit] = useState(false);

  const etherBalance = getEtherBalance(userAssets);
  const { wallet, connect, disconnect } = useContext(WalletContext);

  /// ///////////////////////////////////////////////////////////////////////////////////////
  /// 아래 코드는 2차시 과제에서 사용할 코드입니다. 1차시 과제에서는 아래 코드를 수정하지 마세요.
  /// ///////////////////////////////////////////////////////////////////////////////////////

  /* HW 2-3 (자산 송금 기능) 에서 사용하는 코드예요. 보내기 버튼의 onClick에 연결해 주세요. */
  const handleSendAsset = (assetInfo: AssetInfo, maxBalance: string) => {
    setModalContext(<SendAssetModal assetInfo={assetInfo} maxBalance={maxBalance} />);
  };

  const [deleteAsset] = useDeleteAsset({
    onCompleted: () => {
      setToast(<StatusToast icon={SuccessIcon} content="선택한 자산이 지갑에서 삭제되었어요." />);
    },
    onError: (error) => {
      console.log(error);
      setToast(<StatusToast icon={ErrorIcon} content="다시 시도해 주세요." />);
    },
  });

  /* 
    [HW 2-2] 자산 편집(제거) 기능 개발하기 
    - 아래 handleRemoveAsset을 완성하여, 삭제 버튼을 클릭 시 자산이 삭제되도록 기능을 구현해 주세요.
  */
  const handleRemoveAsset = async (assetAddress: string) => {
    /* 서버로 삭제하고자 하는 자산 정보를 보내는 코드예요. */
    await deleteAsset({
      variables: { input: { userWalletAddress: getCookie(COOKIE_KEY.WALLET_ADDRESS, {}), address: assetAddress } },
    });
    location.reload();
  };

  /// ///////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className={s.info}>
      <div className={s.title}>내 자산</div>
      <div className={s.container}>
        {wallet ? (
          <>
            {' '}
            <EditGuide
              isEdit={isEdit}
              onAddAsset={() => {
                setModalContext(<AddAssetModal />);
              }}
              onChangeIsEdit={() => {
                setIsEdit(!isEdit);
              }}
            />
            <div className={s.asset_list}>
              <SingleAssetInfo
                address={etherInfo.address}
                symbol={etherInfo.symbol}
                name={etherInfo.name}
                balance={etherBalance}
                isEdit={isEdit}
                onSendAsset={() => handleSendAsset(etherInfo, etherBalance)}
                onRemoveAsset={() => {}}
              />
              {userAssets &&
                userAssets.length > 0 &&
                userAssets
                  .filter((asset) => asset.assetInfo.address !== ethers.constants.AddressZero)
                  .map((asset) => {
                    return (
                      <SingleAssetInfo
                        key={asset.assetInfo.address}
                        address={asset.assetInfo.address}
                        symbol={asset.assetInfo.symbol}
                        name={asset.assetInfo.name}
                        balance={asset.balance}
                        isEdit={isEdit}
                        onSendAsset={() => handleSendAsset(asset.assetInfo, asset.balance)}
                        onRemoveAsset={() => handleRemoveAsset(asset.assetInfo.address)}
                      />
                    );
                  })}
            </div>
          </>
        ) : (
          <div className={s.notice_container}>
            <Notice noticeType={NoticeType.ASSET_WALLET_NOT_CONNECTED}></Notice>
          </div>
        )}
      </div>
    </div>
  );
}
