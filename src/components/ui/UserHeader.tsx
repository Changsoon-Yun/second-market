import { FaRegHeart } from 'react-icons/fa';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Avatar, AvatarImage } from '@/components/ui/avatar.tsx';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '@/context/CartContext.tsx';
import { useAuth } from '@/apis/useAuth.ts';

export default function UserHeader() {
  const { storedUserData, logout } = useAuth();
  const { isOpen, openHandler, closeHandler } = useContext(CartContext);
  const { carts } = useContext(CartContext);
  return (
    <>
      <div className={'flex items-center gap-4'}>
        <div
          onClick={() => {
            !isOpen ? openHandler() : closeHandler();
          }}
          className={'relative p-4 cursor-pointer text-zinc-500 hover:text-zinc-600 transition'}>
          <FaRegHeart size={24} />
          {carts.length > 0 && (
            <div
              className={
                'absolute top-0 right-0 rounded-full w-[24px] h-[24px] flex items-center justify-center bg-[#f6d0cb] text-sm'
              }>
              {carts.length}
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className={'focus-visible:outline-none'}>
            <Avatar>
              <AvatarImage src="/img/defaultProfileImage.png" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link to={'/user/dashboard'}>내 프로필 보기</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {storedUserData?.isSeller && (
              <>
                <DropdownMenuLabel>판매자 메뉴</DropdownMenuLabel>
                <Link to={'/seller/dashboard'}>
                  <DropdownMenuItem>판매 목록</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => logout()}>로그아웃</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
