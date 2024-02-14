import { DocumentData } from 'firebase/firestore';
import { UserData } from './user.ts';

export interface TimeStamp {
  nanoseconds: number;
  seconds: number;
}

export enum OrderStatus {
  PURCHASE_CONFIRMED = '구매 확인',
  AWAITING_SHIPMENT = '발송 대기',
  SHIPPING_STARTED = '발송 시작',
  ORDER_CANCELLED = '주문 취소',
  SALE_COMPLETED = '판매 완료',
}

export interface IProducts extends DocumentData {
  title: string;
  id: string;
  desc: string;
  imageList: string[];
  createdAt: TimeStamp;
  updatedAt: TimeStamp;
  category: string;
  price: number;
  condition: string;
  uid: string;
  customerData: UserData;
  orderStatus: OrderStatus;
  orderedDate: TimeStamp;
}
