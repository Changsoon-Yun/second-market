import { useAuth } from '@/apis/auth/useAuth.ts';
import { Link } from 'react-router-dom';
import useMenuContext from '@/context/useMenuContext.tsx';

export default function MenuAction() {
  const { storedUserData, logout } = useAuth();
  const { closeMenuHandler } = useMenuContext();
  return (
    <>
      {storedUserData ? (
        <div
          data-testid={'sign-button'}
          className={'px-5 my-1 hover:bg-zinc-100 cursor-pointer'}
          onClick={() => {
            closeMenuHandler();
            logout();
          }}>
          <p className="scroll-m-20 py-3 text-xl tracking-tight hover:font-semibold">로그아웃</p>
        </div>
      ) : (
        <div
          data-testid={'sign-button'}
          className={'px-5 my-1 hover:bg-zinc-100'}
          onClick={closeMenuHandler}>
          <Link to={'/login'}>
            <p className="scroll-m-20 py-3 text-xl tracking-tight hover:font-semibold">로그인</p>
          </Link>
        </div>
      )}
    </>
  );
}
