import { Link } from "wouter";

import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/">
              <a className="block">
                <img src={logo} alt="The Experts Logo" className="h-16 w-auto brightness-0 invert" />
              </a>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Supplying comfort and luxury to your guests. Premium hospitality products across the Middle East.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="/"><a className="hover:text-primary transition-colors">Home</a></Link></li>
              <li><Link href="/about-us"><a className="hover:text-primary transition-colors">About Us</a></Link></li>
              <li><Link href="/categories"><a className="hover:text-primary transition-colors">Products</a></Link></li>
              <li><Link href="/contact"><a className="hover:text-primary transition-colors">Contact</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Categories</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="/categories"><a className="hover:text-primary transition-colors">Amenities</a></Link></li>
              <li><Link href="/categories"><a className="hover:text-primary transition-colors">Linens</a></Link></li>
              <li><Link href="/categories"><a className="hover:text-primary transition-colors">Furniture</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Contact</h4>
            <div className="space-y-3 text-sm text-neutral-400">
              <p>Dubai, UAE</p>
              <p>info@theexperts.me</p>
              <p>+971 4 123 4567</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} The Experts. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
