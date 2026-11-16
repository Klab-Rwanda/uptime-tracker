import { PlatformRouter } from './features/platform';
import { ClientRouter } from './features/client';
import { LogsIncidentsRouter } from './features/logs-incidents';

function App() {
  return (
    <>
      <PlatformRouter />
      <ClientRouter />
      <LogsIncidentsRouter />
    </>
  );
}

export default App;
