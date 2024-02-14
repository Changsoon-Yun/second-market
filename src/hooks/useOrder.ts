import { RequestPayParams, RequestPayResponse } from '@/types/imp.ts';
import { useContext, useState } from 'react';
import useGetCartProducts from '@/apis/useGetCartProducts.ts';
import { CartContext } from '@/context/CartContext.tsx';
import { z } from 'zod';
import { orderDataFormSchema } from '@/lib/zod/schemas.ts';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase.ts';
import { useAuth } from '@/apis/useAuth.ts';
import { IProducts, OrderStatus } from '@/types/product.ts';
import { UserData } from '@/types/user.ts';
import { toast } from '@/components/ui/use-toast.ts';
import { FirebaseError } from 'firebase/app';
import { queryClient } from '@/App.tsx';
import { QUERY_KEYS } from '@/lib/react-query/queryKeys.ts';

export default function useOrder() {
  const { carts } = useContext(CartContext);
  const { products } = useGetCartProducts(carts);
  const { storedUserData } = useAuth();
  const onClickPayment = ({
    amount,
    name,
    buyer_name,
    buyer_tel,
    buyer_email,
    buyer_addr,
    buyer_postcode,
  }: z.infer<typeof orderDataFormSchema>) => {
    if (!window.IMP) return;
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init(import.meta.env.VITE_IMP_CODE); // 가맹점 식별코드

    /* 2. 결제 데이터 정의하기 */
    const data: RequestPayParams = {
      pg: 'html5_inicis', // PG사 : https://developers.portone.io/docs/ko/tip/pg-2 참고
      pay_method: 'card', // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount, // 결제금액
      name, // 주문명
      buyer_name, // 구매자 이름
      buyer_tel, // 구매자 전화번호
      buyer_email, // 구매자 이메일
      buyer_addr, // 구매자 주소
      buyer_postcode, // 구매자 우편번호
    };

    /* 4. 결제 창 호출하기 */
    IMP.request_pay(data, callback);
  };

  /* 3. 콜백 함수 정의하기 */
  async function callback(response: RequestPayResponse) {
    const { success, error_msg } = response;

    if (success) {
      alert('결제 성공');
    } else {
      await updateIsSoldProductsByIds(false);
      alert(`결제 실패: ${error_msg}`);
    }
  }

  // 체크된 아이템을 담을 배열
  const [checkItems, setCheckItems] = useState<IProducts[]>([]);

  // 체크박스 단일 선택
  const handleSingleCheck = (checked: boolean, item: IProducts) => {
    if (checked) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      setCheckItems((prev) => [...prev, item]);
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckItems(checkItems.filter((el) => el.id !== item.id));
    }
  };

  // 체크박스 전체 선택
  const handleAllCheck = (checked: boolean) => {
    if (products) {
      if (checked) {
        // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
        const idArray: IProducts[] = [];
        products.forEach((el) => idArray.push(el));
        setCheckItems(idArray);
      } else {
        // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
        setCheckItems([]);
      }
    }
  };

  const updateFetcher = async (id: string, idx: number, isSold: boolean) => {
    const productRef = doc(db, `products/${id}`);
    const productSnapshot = await getDoc(productRef);
    const productData = productSnapshot.data() as IProducts;

    const sellerRef = doc(db, `users/${productData.uid}`);
    const sellerSnapshot = await getDoc(sellerRef);
    const sellerData = sellerSnapshot.data() as UserData;

    const itemToUpdate = checkItems[idx];
    const newData = {
      ...itemToUpdate,
      isSold: isSold,
      customerData: isSold ? storedUserData : null,
      orderedDate: serverTimestamp(),
      updatedAt: serverTimestamp(),
      sellerEmail: sellerData.email,
      orderStatus: isSold ? OrderStatus.AWAITING_SHIPMENT : null,
    };

    if (storedUserData) {
      await updateDoc(productRef, newData);
    }
  };

  const updateIsSoldProductsByIds = async (bool: boolean) => {
    const promises = checkItems.map((id, idx) => updateFetcher(id.id, idx, bool));
    return await Promise.all(promises);
  };

  const cancelOrderById = async (id: string) => {
    try {
      const productRef = doc(db, `products/${id}`);
      const productSnapshot = await getDoc(productRef);
      const productData = productSnapshot.data() as IProducts;
      await updateDoc(productRef, {
        ...productData,
        orderStatus: OrderStatus.ORDER_CANCELLED,
        customerData: null,
        orderedDate: null,
        isSold: false,
        updatedAt: serverTimestamp(),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ORDERED() });
      toast({
        description: '주문 취소를 성공 했습니다.',
      });
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast({
          title: '에러!',
          description: e.code,
          variant: 'destructive',
        });
      }
    }
  };

  return {
    onClickPayment,
    products,
    checkItems,
    setCheckItems,
    handleSingleCheck,
    handleAllCheck,
    updateIsSoldProductsByIds,
    cancelOrderById,
  };
}
