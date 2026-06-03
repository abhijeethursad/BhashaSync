"use client";

import { usePathname } from 'next/navigation';
import TopHeader from './TopHeader';
import MobileBottomNav from './MobileBottomNav';

export default function Navbar() {
  const pathname = usePathname();

  // Hide the Navbar entirely if the user is on the Login page OR any Learning page
  if (pathname === '/login' || pathname.startsWith('/learning') || pathname === '/signup') {
    return null;
  }

  return (
    <>
      <TopHeader />
      <MobileBottomNav />
    </>
  );
}