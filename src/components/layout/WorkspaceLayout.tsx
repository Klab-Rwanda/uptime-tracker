import { Outlet } from 'react-router-dom';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { WorkspaceTopNav } from './WorkspaceTopNav';

export const WorkspaceLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <WorkspaceSidebar />
      <div className={`${typeof window !== 'undefined' && window.innerWidth < 768 ? 'pl-0' : 'pl-64'}`}>
        <WorkspaceTopNav />
        <main className="pt-20 px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};