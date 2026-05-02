import Link from "next/link";
import { Box, Globe, MessageCircle, Mail, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 shrink-0 mb-4">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Box className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Maker<span className="text-primary">Verse</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-6 text-balance">
              The premium marketplace for discovering, sharing, and downloading high-quality 3D printable models.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors"><Globe className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-foreground transition-colors"><MessageCircle className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-foreground transition-colors"><Mail className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-foreground transition-colors"><Share2 className="h-5 w-5" /></Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Models</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/models" className="hover:text-foreground hover:underline underline-offset-4">Browse All</Link></li>
              <li><Link href="/categories/3d-printer" className="hover:text-foreground hover:underline underline-offset-4">3D Printer Parts</Link></li>
              <li><Link href="/categories/toys-games" className="hover:text-foreground hover:underline underline-offset-4">Toys & Games</Link></li>
              <li><Link href="/categories/household" className="hover:text-foreground hover:underline underline-offset-4">Household</Link></li>
              <li><Link href="/categories/art" className="hover:text-foreground hover:underline underline-offset-4">Art & Design</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Community</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/contests" className="hover:text-foreground hover:underline underline-offset-4">Contests</Link></li>
              <li><Link href="/tools" className="hover:text-foreground hover:underline underline-offset-4">Maker Tools Hub</Link></li>
              <li><Link href="/creators" className="hover:text-foreground hover:underline underline-offset-4">Top Creators</Link></li>
              <li><Link href="/forum" className="hover:text-foreground hover:underline underline-offset-4">Forums</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">About</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground hover:underline underline-offset-4">Our Story</Link></li>
              <li><Link href="/help" className="hover:text-foreground hover:underline underline-offset-4">Help Center</Link></li>
              <li><Link href="/terms" className="hover:text-foreground hover:underline underline-offset-4">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground hover:underline underline-offset-4">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MakerVerse Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span>English (US)</span>
            <span>$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
