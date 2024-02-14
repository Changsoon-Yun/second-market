import NotFound from '@/components/optimize/NotFound';
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const CommonLayout = lazy(() => import('@/components/ui/CommonLayout.tsx'));
const PrivateRouter = lazy(() => import('@/lib/router/PrivateRouter.tsx'));
const LoginPage = lazy(() => import('@/pages/auth/Login.page.tsx'));
const MobileLayout = lazy(() => import('@/components/ui/MobileLayout.tsx'));
const HomePage = lazy(() => import('@/pages/Home.page.tsx'));
const RegisterSelectPage = lazy(() => import('@/pages/auth/RegisterSelect.page.tsx'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage.tsx'));
const SellerRouter = lazy(() => import('@/lib/router/SellerRouter.tsx'));
const UserDashBoardPage = lazy(() => import('@/pages/dashboard/UserDashBoard.page.tsx'));
const UserDashBoardEditPage = lazy(() => import('@/pages/dashboard/UserDashBoardEdit.page.tsx'));
const SellerDashBoardPage = lazy(() => import('@/pages/dashboard/SellerDashBoard.page.tsx'));
const SellerProductAddPage = lazy(() => import('@/pages/products/SellerProductAdd.page.tsx'));
const SellerProductEditPage = lazy(() => import('@/pages/products/SellerProductEdit.page.tsx'));
const CategoryProductsPage = lazy(() => import('@/pages/products/CategoryProducts.page.tsx'));
const DetailProductPage = lazy(() => import('@/pages/products/DetailProduct.page.tsx'));
const OrderPage = lazy(() => import('@/pages/order/Order.page.tsx'));
const OrderedListPage = lazy(() => import('@/pages/order/OrderedList.page.tsx'));

export default function Router() {
  return (
    <>
      <Routes>
        <Route element={<CommonLayout />}>
          {/*일반 라우트*/}
          <Route path={'/'} element={<HomePage />} />
          <Route path={'/product/:id'} element={<DetailProductPage />} />
          <Route path={'/products/:category'} element={<CategoryProductsPage />} />
          {/*권한 필요 라우트*/}
          <Route element={<PrivateRouter />}>
            <Route path={'/order/:id'} element={<OrderPage />} />
            <Route path={'/ordered-products'} element={<OrderedListPage />} />
            <Route element={<SellerRouter />}>
              <Route path={'/seller/dashboard'} element={<SellerDashBoardPage />} />
              <Route path={'/seller/product/add'} element={<SellerProductAddPage />} />
              <Route path={'/seller/product/edit/:id'} element={<SellerProductEditPage />} />
            </Route>
          </Route>
        </Route>

        {/*모바일 뷰 라우트*/}
        <Route element={<MobileLayout />}>
          <Route path={'/login'} element={<LoginPage />} />
          <Route path={'/register/select'} element={<RegisterSelectPage />} />
          <Route path={'/register/:params'} element={<RegisterPage />} />
          <Route element={<PrivateRouter />}>
            <Route path={'/user/dashboard'} element={<UserDashBoardPage />} />
            <Route path={'/user/dashboard/edit'} element={<UserDashBoardEditPage />} />
          </Route>
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}
