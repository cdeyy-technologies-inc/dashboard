import SideNav from '@/app/ui/dashboard/sidenav';
//Any components you import into this file will be part of the layout.
import NavLinks from './nav-links';

/**
 * 
 * @param param0 The <Layout /> component receives a children prop, can either be a page or another layout. in our case,
 * the pages inside /dashboard will automatically be nested inside a <Layout /> like [this](../../../shared-layout.avif)
 * @returns 
 */
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <NavLinks />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}