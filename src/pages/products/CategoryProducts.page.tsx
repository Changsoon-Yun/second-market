import { Link, useParams } from 'react-router-dom';
import {
  convertLabelByValue,
  formatNumberWithCommas,
  getDateFromProduct,
} from '@/utils/converter.ts';
import useGetCategoryProducts from '@/apis/useGetCategoryProducts.ts';
import { categories } from '@/constant/categories.ts';
import { useCallback, useMemo, useState } from 'react';
import FilterList from '@/components/products/FilterList.tsx';
import { Metatags } from '@/metadatas/metadatas.tsx';
import PageTitle from '@/components/PageTitle.tsx';
import Container from '@/components/Container.tsx';
import CardSkeleton from '@/components/compound/card/CardSkeleton.tsx';
import { Card } from '@/components/compound/card';

export default function CategoryProductsPage() {
  const { category } = useParams();
  const [selectedFilter, setSelectedFilter] = useState<string>('최신순');
  const [option, setOption] = useState<'updatedAt' | 'price'>('updatedAt');
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const { products, isLoading, inViewRef, isFetchingNextPage } = useGetCategoryProducts({
    category: category ?? '',
    filter: {
      option,
      direction,
    },
  });

  const onChangeFilterHandler = useCallback(
    (item: string) => {
      switch (item) {
        case '최신순':
          setSelectedFilter(item);
          setOption('updatedAt');
          setDirection('desc');
          break;
        case '오래된순':
          setSelectedFilter(item);
          setOption('updatedAt');
          setDirection('asc');
          break;
        case '낮은 가격순':
          setSelectedFilter(item);
          setOption('price');
          setDirection('asc');
          break;
        case '높은 가격순':
          setSelectedFilter(item);
          setOption('price');
          setDirection('desc');
          break;
      }
    },
    [setSelectedFilter, setOption, setDirection]
  );
  const categoryLabel = useMemo(
    () => convertLabelByValue(category as string, categories),
    [category]
  );

  if (!category) {
    return;
  }

  return (
    <>
      <Metatags title={`Seconds: 중고거래 - ${categoryLabel}`} desc={categoryLabel as string} />
      <PageTitle title={categoryLabel} />
      <FilterList selectedFilter={selectedFilter} onChangeFilterHandler={onChangeFilterHandler} />
      <Container className={'py-10 mb-2 bg-white flex-1'}>
        <div className={'grid grid-cols-2 gap-2'} data-testid={'products-wrapper'}>
          {isLoading && Array.from({ length: 8 }, () => <CardSkeleton key={Math.random()} />)}
          {products?.pages.map((items) =>
            items.products?.map((product) => (
              <Card.Root key={product.id} to={`/product/${product.id}`}>
                <Card.Img imageList={product.imageList} />
                <Card.Title title={product.title} />
                <Card.Description
                  data-testid={'product-price'}
                  text={formatNumberWithCommas(product.price) + '원'}
                />
                <Card.Description
                  data-testid={'product-date'}
                  text={getDateFromProduct(product.updatedAt)}
                  className={'hidden'}
                />
                <Card.Buttons>
                  <Card.Button data-testid={'product-detail-link'} variant={'outline'}>
                    <Link to={`/product/${product.id}`}>상세보기</Link>
                  </Card.Button>
                </Card.Buttons>
              </Card.Root>
            ))
          )}
        </div>
      </Container>

      <div ref={inViewRef} className="min-h-1">
        {isFetchingNextPage && <p>loading...</p>}
      </div>
    </>
  );
}
