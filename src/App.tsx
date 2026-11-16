import { PlatformRouter } from './features/platform';
import { ClientRouter } from './features/client';

function App() {
  return (
    <>
      <PlatformRouter />
      <ClientRouter />
    </>
  );
}

export default App;