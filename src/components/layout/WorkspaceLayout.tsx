import { Outlet } from 'react-router-dom';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { WorkspaceTopNav } from './WorkspaceTopNav';

export const WorkspaceLayout = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-90">
      <WorkspaceSidebar />
      <div className={`${typeof window !== 'undefined' && window.innerWidth < 768 ? 'pl-0' : 'pl-64'}`}>
        <WorkspaceTopNav />
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};