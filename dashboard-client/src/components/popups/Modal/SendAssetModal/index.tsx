import Modal from '..';
import s from './index.module.scss';
import BaseButton from '@/components/atoms/button/BaseButton';
import Asset from '@/components/atoms/dashboard/Asset';
import TextField from '@/components/atoms/inputs/TextField';
import useInputValidation from '@/hooks/useInputValidation';
import { ValidateState } from '@/libs/validator';
import { ModalContext } from '@/store/GlobalContext';
import { AssetInfo } from '@/store/GlobalContext.d';
import { ethers } from 'ethers';
import { useContext, useEffect, useRef } from 'react';

/* 
  [HW 2-3] 자산 송금 기능 개발하기 
  - 아래 SendAssetModal 컴포넌트를 완성하여, 자산 송금 기능을 구현해 주세요.
  - 내부 요소가 많기 때문에 컴포넌트를 추가하는 것을 권장해요.
  - libs 폴더에 새로운 유틸리티 함수를 추가해도 괜찮아요.
*/

export interface SendAssetModalProps {
  assetInfo: AssetInfo;
  maxBalance: string;
}

export default function SendAssetModal({ assetInfo, maxBalance }: SendAssetModalProps) {
  const [, setModal] = useContext(ModalContext);
  const ref = useRef<HTMLInputElement>(null);

  const addressChecker = (address: string) => {
    if (!ethers.utils.isAddress(address)) {
      return false;
    }
    return true;
  };

  const amountChecker = (amount: string) => {
    // parseFloat를 사용해 문자열을 숫자로 변환 시도
    const num = parseFloat(amount);
    // 변환된 숫자가 유효한지 확인 (isNaN을 사용하여 숫자가 아닌지 검사, 또는 변환 전 후 문자열 비교)
    // parseFloat는 숫자로 시작하는 문자열에서 숫자 부분만 변환하므로 추가 검사 필요 ex) "3 "의 경우
    if (!isNaN(num) && num.toString() === amount.trim() && num < parseFloat(maxBalance)) {
      return true;
    }
    return false;
  };

  const {
    input: inputAddress,
    isValidInput: isValidInputAddress,
    inputChangeHandler: inputAddressChangeHandler,
  } = useInputValidation(addressChecker);

  const {
    input: inputAmount,
    isValidInput: isValidInputAmount,
    inputChangeHandler: inputAmountChangeHandler,
  } = useInputValidation(amountChecker);

  /* 
    모달이 열렸을 때, Textfield로 포커스를 주는 코드예요. 
  */
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <Modal>
      <div className={s.send_asset_modal}>
        <div className={s.modal_infos}>
          <div className={s.modal_info}>
            <div className={s.modal_title}>자산을 보낼 주소를 입력하세요.</div>
            <TextField
              placeholder="여기에 자산 주소를 입력하세요."
              ref={ref}
              value={inputAddress}
              error={inputAddress.length !== 0 && isValidInputAddress === ValidateState.ERROR}
              onChange={inputAddressChangeHandler}
            />
          </div>
          <div className={s.modal_info}>
            <div className={s.modal_title}>자산을 보낼 수량을 입력하세요.</div>
            <div className={s.asset_input_container}>
              <Asset address={assetInfo.address} symbol={assetInfo.symbol} name={assetInfo.name} />
              <div className={s.asset_input}>
                <TextField
                  placeholder={maxBalance}
                  value={inputAmount}
                  error={inputAmount.length !== 0 && isValidInputAmount === ValidateState.ERROR}
                  onChange={inputAmountChangeHandler}
                />
              </div>
            </div>
          </div>
        </div>
        {parseFloat(inputAmount) >= parseFloat(maxBalance) && (
          <div className={s.modal_message_info}>
            <div className={s.modal_message}>{'보유한 잔액이 부족해요.'}</div>
          </div>
        )}
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
            name="전송하기"
            disabled={isValidInputAddress === ValidateState.ERROR || isValidInputAmount === ValidateState.ERROR}
            onClick={() => {}}
          ></BaseButton>
          ;
        </div>
      </div>
    </Modal>
  );
}
