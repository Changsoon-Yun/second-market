import { db } from '@/lib/firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/react-query/queryKeys.ts';
import { Product } from '@/types/product.ts';
import { useCallback, useMemo } from 'react';
import shuffle from 'lodash/shuffle';

export default function useGetRelatedProducts(category: string, id: string) {
  const fetchData = useCallback(async () => {
    if (!category || !id) return null; // 카테고리 또는 아이디가 없으면 fetchData 실행하지 않음

    // 모든 상품을 가져오는 쿼리
    const q = query(
      collection(db, 'products'),
      where('category', '==', category),
      where('id', '!=', id)
    );

    const querySnapshot = await getDocs(q);

    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    return shuffle(products).slice(0, 4);
  }, [category, id]);

  const { data: products } = useQuery({
    queryKey: useMemo(() => QUERY_KEYS.PRODUCTS.RELATED(category, id), [category, id]),
    queryFn: fetchData,
    enabled: !!category,
  });

  return { products };
}
