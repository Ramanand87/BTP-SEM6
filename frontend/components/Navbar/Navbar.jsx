'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

import FarmerLogo from "@/components/assets/FramerLogo";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Market', href: '/market' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.header
  initial={{ y: -100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="sticky top-0 z-50 w-full border-b bg-white flex justify-center"
>

      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="hidden items-center space-x-2 md:flex">
        <FarmerLogo width={38} height={38} className="drop-shadow-md" />
          <span className="text-2xl font-bold text-green-700">AgriConnect</span>
        </Link>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-green-700">FarmFresh</span>
                <X className="h-6 w-6" onClick={() => setIsOpen(false)} />
              </div>
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium transition-colors hover:text-green-700"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex md:items-center md:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-green-700"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:flex">
            <Link href={'/login'}>Login</Link>
          </Button>
          <Button className="bg-green-700 hover:bg-green-800">Shop Now</Button>
        </div>
      </nav>
    </motion.header>
  );
}