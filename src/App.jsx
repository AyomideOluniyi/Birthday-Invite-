import { useState } from 'react';
import InvitePage from './pages/InvitePage';
import EnvelopeGate from './components/EnvelopeGate';

export default function App() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      {!opened && <EnvelopeGate onOpen={() => setOpened(true)} />}
      <div style={{ pointerEvents: opened ? 'auto' : 'none', userSelect: opened ? 'auto' : 'none' }}>
        <InvitePage />
      </div>
    </>
  );
}
