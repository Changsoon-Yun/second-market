import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/header/Header.tsx';
import Footer from '../footer/Footer.tsx';
import SideCart from '../cart/SideCart.tsx';
import { useEffect } from 'react';

export default function MobileLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.getElementById('main')?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <div className="bg-zinc-50 flex justify-center">
        <div className="flex flex-1 flex-col relative max-w-[600px] w-full min-h-screen h-full shadow-lg bg-zinc-100 overflow-hidden">
          <header className={'sticky top-0 z-10 border-b border-zinc-200'}>
            <Header />
          </header>
          <main
            id={'main'}
            className={'flex-1 flex flex-col min-h-0 basis-0 overflow-auto scrollbar-hide'}>
            <Outlet />
          </main>
          <footer className={'border-t border-zinc-200 bg-zinc-50'}>
            <Footer />
          </footer>
          <SideCart />
        </div>
      </div>
    </>
  );
}
