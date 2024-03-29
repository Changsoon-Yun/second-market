import { useAuth } from '@/apis/auth/useAuth.ts';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { db } from '@/lib/firebase/firebase.ts';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/react-query/queryKeys.ts';
import { Product } from '@/types/product.ts';
import { useCallback } from 'react';

export default function useGetOrderedProducts() {
  const { storedUserData } = useAuth();

  const fetchData = useCallback(async () => {
    const q = query(collection(db, 'products'), where('isSold', '==', true));
    const querySnapshot = await getDocs(q);

    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    return products.filter((product) => {
      return product.customerData.uid === storedUserData?.uid && product;
    });
  }, [storedUserData]);

  const { data: products } = useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.ORDERED(),
    queryFn: fetchData,
  });
  return { products };
}
