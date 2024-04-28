import { StatusToast } from '../../Toast/StatusToast';
import Modal from '../index';
import s from './index.module.scss';
import BaseButton from '@/components/atoms/button/BaseButton';
import Amount from '@/components/atoms/dashboard/Amount';
import Asset from '@/components/atoms/dashboard/Asset';
import TextField from '@/components/atoms/inputs/TextField';
import useInputValidation from '@/hooks/useInputValidation';
import { getCookie } from '@/libs/cookie';
import { COOKIE_KEY } from '@/libs/types';
import { ERC20_ABI, getProvider } from '@/libs/utils';
import { ValidateState } from '@/libs/validator';
import ErrorIcon from '@/public/assets/Error.png';
import SuccessIcon from '@/public/assets/Success.png';
import { ModalContext, ToastContext, WalletContext } from '@/store/GlobalContext';
import { useCreateAsset } from '@graphql/client';
import { BigNumber, ethers } from 'ethers';
import { useContext, useEffect, useRef, useState } from 'react';

/* 
  [HW 2-1] 자산 추가 기능 개발하기 
  - 아래 AddAssetModal 컴포넌트를 완성하여, 자산 추가 기능을 구현해 주세요.
  - 반드시 모든 기능을 이 파일에 작성하지 않아도 괜찮아요. 필요 시 새로운 컴포넌트를 생성하거나, libs 폴더에 새로운 유틸리티 함수를 추가해도 괜찮아요.
*/

export default function AddAssetModal() {
  type assetStatusT = 'nonExist' | 'exist' | 'alreadyAdded' | 'searching';
  type assetInfoT = {
    address: string;
    symbol: string;
    name: string;
    balance: number;
    decimal: number;
  };
  const [, setModal] = useContext(ModalContext);
  const [, setToast] = useContext(ToastContext);

  const ref = useRef<HTMLInputElement>(null);
  const { wallet } = useContext(WalletContext);
  const walletProvider = wallet?.provider;
  const provider = getProvider(walletProvider!);
  const [isNeedtoCheckAsset, setIsNeedtoCheckAsset] = useState(false);
  const [assetStatus, setAssetStatus] = useState<assetStatusT>('searching');
  const [assetInfo, setAssetInfo] = useState<assetInfoT>({
    address: '',
    symbol: '',
    name: '',
    balance: 0,
    decimal: 0,
  });

  const assetChecker = (address: string) => {
    // 적절한 Ethereum 주소 형식이 아닌 경우(1차 컨트랙트 검증)
    if (!ethers.utils.isAddress(address)) {
      setAssetStatus('nonExist');
      return false;
    }
    // 2차 검증
    setIsNeedtoCheckAsset(true);
    return true;
  };

  /* 
    아래 코드는 입력값을 검증하는 로직을 포함하는 커스텀 훅이예요. 필요하다면 사용해도 좋아요. 
  */
  const { input, isValidInput, inputChangeHandler } = useInputValidation(assetChecker);

  const getSubInfo = (state: ValidateState) => {
    if (input.length !== 0) {
      if (state === ValidateState.VALIDATED) {
        switch (assetStatus) {
          case 'searching':
            return (
              <div className={s.modal_sub_info}>
                <div className={s.sub_info_title}>입력하신 자산을 네트워크에서 찾고 있어요.</div>
              </div>
            );
          case 'nonExist':
            return (
              <div className={s.modal_sub_info}>
                <div className={s.sub_info_error_title}>
                  자산을 찾을 수 없어요. 입력하신 주소가 맞는지 다시 한 번 확인해 주세요.
                </div>
              </div>
            );
          case 'exist':
            // 적절한 자산 주소
            return (
              <div className={s.modal_sub_info}>
                <div className={s.sub_info_title}>입력하신 자산이 맞나요?</div>
                <div className={s.sub_info_content}>
                  <Asset address={assetInfo.address} symbol={assetInfo.symbol} name={assetInfo.name} />
                  <Amount
                    balance={ethers.utils.formatUnits(assetInfo.balance, assetInfo.decimal)}
                    symbol={assetInfo.symbol}
                  />
                </div>
              </div>
            );
          case 'alreadyAdded':
            // 이미 추가된 자산 주소
            return (
              <div className={s.modal_sub_info}>
                <div className={s.sub_info_error_title}>이미 지갑에 추가된 자산이예요.</div>
                <div className={s.sub_info_content}>
                  <Asset address={assetInfo.address} symbol={assetInfo.symbol} name={assetInfo.name} />
                  <Amount
                    balance={ethers.utils.formatUnits(assetInfo.balance, assetInfo.decimal)}
                    symbol={assetInfo.symbol}
                  />
                </div>
              </div>
            );
        }
      } else if (state === ValidateState.ERROR) {
        switch (assetStatus) {
          case 'searching':
            return (
              <div className={s.modal_sub_info}>
                <div className={s.sub_info_title} style={{ color: '#656565' }}>
                  입력하신 자산을 네트워크에서 찾고 있어요.
                </div>
              </div>
            );

          case 'nonExist':
            return (
              <div className={s.modal_sub_info}>
                <div className={s.sub_info_error_title}>
                  자산을 찾을 수 없어요. 입력하신 주소가 맞는지 다시 한 번 확인해 주세요.
                </div>
              </div>
            );
        }
      }
    }
  };

  /* 
    아래 코드는 추가하고자 하는 자산의 검증이 완료되었을 시, 서버로 추가하고자 하는 자산 정보를 보내는 코드예요.
    createAsset 함수를 호출하여 자산을 데이터베이스에 추가할 수 있어요. 아래 사용 예시를 참고해주세요.
    각 input 요소에 대한 정보가 더 필요하다면 (최상단 디렉토리) libs/graphql/requests/__generated__/graphql.ts 파일을 참고해 주세요.
  */
  const [createAsset] = useCreateAsset({
    onCompleted: () => {
      setToast(<StatusToast icon={SuccessIcon} content="새로운 자산이 지갑에 추가되었어요." />);
    },
    onError: (error) => {
      console.log(error);
      setToast(<StatusToast icon={ErrorIcon} content="다시 시도해 주세요." />);
    },
  });

  // 사용 예시
  // const response = await createAsset({
  //   variables: {
  //     input: {
  //       userWalletAddress: // 값 추가
  //       address: // 값 추가
  //       type: // = 'TOKEN' 으로 고정해서 넣어주세요.
  //       name: // 값 추가
  //       symbol: // 값 추가
  //       decimal: // 값 추가
  //       balance: // 값 추가
  //     },
  //   },
  // });
  // const createAssetInfo = response.data?.createAsset;
  // if (!createAssetInfo) throw new Error();

  /* 
    모달이 열렸을 때, Textfield로 포커스를 주는 코드예요. 
  */
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  useEffect(() => {
    /**
     * checkAsset: 2차 컨트랙트 검증 함수
     */
    async function checkAsset() {
      if (isNeedtoCheckAsset) {
        const tokenContract = new ethers.Contract(input, ERC20_ABI, provider);
        try {
          setAssetInfo({
            address: input,
            symbol: await tokenContract.symbol(),
            name: await tokenContract.name(),
            balance: Number(await tokenContract.balanceOf(input)),
            decimal: Number(await tokenContract.decimals()),
          });
          setAssetStatus('exist');
        } catch (error) {
          setAssetStatus('nonExist');
        }
        setIsNeedtoCheckAsset(false);
      }
    }
    checkAsset();
  }, [isNeedtoCheckAsset, getSubInfo, assetStatus]);

  return (
    <Modal>
      <div className={s.add_asset_modal}>
        <div className={s.modal_info}>
          <div className={s.modal_title}>추가할 자산의 주소를 입력하세요.</div>
          <TextField
            placeholder="여기에 자산 주소를 입력하세요."
            ref={ref}
            value={input}
            error={input.length !== 0 && !ethers.utils.isAddress(input)}
            onChange={inputChangeHandler}
          />
        </div>
        {getSubInfo(isValidInput)}
        <div style={{}}></div>
        <div className={s.modal_buttons}>
          <BaseButton
            assert={false}
            name="닫기"
            onClick={() => {
              setModal(null);
            }}
          ></BaseButton>
          <BaseButton
            assert={true}
            name="추가하기"
            disabled={!(assetStatus === 'exist')}
            onClick={async () => {
              const response = await createAsset({
                variables: {
                  input: {
                    userWalletAddress: getCookie(COOKIE_KEY.WALLET_ADDRESS, {}),
                    address: assetInfo.address,
                    type: 'TOKEN',
                    name: assetInfo.name,
                    symbol: assetInfo.symbol,
                    decimal: assetInfo.decimal,
                    balance: assetInfo.balance.toString(),
                  },
                },
              });
              const createAssetInfo = response.data?.createAsset;
              console.log(createAssetInfo);
              if (!createAssetInfo) throw new Error();
            }}
          ></BaseButton>
        </div>
      </div>
    </Modal>
  );
}
