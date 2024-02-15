import { Link } from 'react-router-dom';
import useGetSellerProducts from '@/apis/useGetSellerProducts.ts';
import { Button } from '@/components/ui/button.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { convertLabelByValue, formatNumberWithCommas, getDateFromProduct } from '@/utils/converter';
import useProductHandler from '@/hooks/useProductHandler.ts';
import { categories } from '@/constant/categories.ts';
import { conditions } from '@/constant/conditions';
import * as dayjs from 'dayjs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderStatus } from '@/types/product.ts';
import { useAuth } from '@/apis/useAuth.ts';
import PageTitle from '@/components/PageTitle.tsx';

export default function SellerDashBoardPage() {
  const { products, inViewRef, isFetchingNextPage } = useGetSellerProducts();
  const { storedUserData } = useAuth();
  const { deleteHandler, updateOrderStatusHandler } = useProductHandler();
  return (
    <>
      <div className={'py-16'}>
        <PageTitle
          title={`${storedUserData?.userName}님의 판매 상품 목록`}
          children={
            <Button variant={'outline'} asChild className={'absolute top-0 right-0'}>
              <Link to={'/seller/product/add'}>상품 등록</Link>
            </Button>
          }
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[130px]">대표이미지</TableHead>
              <TableHead className="w-[130px]">제목</TableHead>
              <TableHead className="w-[130px]">카테고리</TableHead>
              <TableHead className="w-[130px]">상품 상태</TableHead>
              <TableHead className="w-[130px]">주문 상태</TableHead>
              <TableHead className="w-[130px]">주문 날짜</TableHead>
              <TableHead className="w-[130px]">작업</TableHead>
              <TableHead className="text-right w-[130px]">가격</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.pages.map((items) =>
              items.products.map(
                ({
                  title,
                  imageList,
                  createdAt,
                  id,
                  price,
                  category,
                  condition,
                  orderStatus,
                  orderedDate,
                }) => (
                  <TableRow key={createdAt.seconds}>
                    <TableCell>
                      <div className={'w-24 h-24 rounded-2xl border overflow-hidden'}>
                        <img
                          src={imageList[0]}
                          className={'w-full h-full object-cover'}
                          alt="상품이미지"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={'line-clamp-4'}>{title}</div>
                    </TableCell>
                    <TableCell>{convertLabelByValue(category, categories)}</TableCell>
                    <TableCell>{convertLabelByValue(condition, conditions)}</TableCell>
                    <TableCell>
                      {orderStatus && (
                        <Select
                          onValueChange={(value) => {
                            updateOrderStatusHandler(value, id);
                          }}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder={orderStatus} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>주문 상태</SelectLabel>
                              {Object.values(OrderStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      {dayjs(getDateFromProduct(orderedDate)).format('YYYY-MM-DD') ===
                      'Invalid Date'
                        ? ''
                        : dayjs(getDateFromProduct(orderedDate)).format('YYYY-MM-DD')}
                    </TableCell>
                    <TableCell>
                      <div className={'flex flex-col flex-wrap gap-3 max-w-sm'}>
                        <Button>
                          <Link to={`/seller/product/edit/${id}`}>수정하기</Link>
                        </Button>
                        <Button
                          variant={'destructive'}
                          onClick={() => {
                            deleteHandler(id);
                          }}>
                          삭제하기
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatNumberWithCommas(price)}원</TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
      <div ref={inViewRef} className="h-42 w-full">
        {isFetchingNextPage && <p>loading...</p>}
      </div>
    </>
  );
}
