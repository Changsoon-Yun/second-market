import { Outlet } from 'react-router-dom';

export default function CommonLayout() {
  return (
    <>
      <div>Header</div>
      <Outlet />
    </>
  );
}