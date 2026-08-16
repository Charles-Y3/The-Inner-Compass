import { useCallback, useState } from 'react';
import { autoSaveIfEnabled, exportSmart } from '../utils/folderBackup';

// Call triggerAfterSave() once right after a check-in is written to history.
// If folder auto-save is already on, the write is silently mirrored there
// and nothing surfaces. Otherwise the prompt appears so the user can choose
// a folder (or fall back to a download) for this result.
export function useSaveResultsPrompt() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const triggerAfterSave = useCallback(() => {
    void autoSaveIfEnabled().then((saved) => {
      if (!saved) setVisible(true);
    });
  }, []);

  const saveNow = useCallback(() => {
    setBusy(true);
    setFailed(false);
    void exportSmart().then((result) => {
      setBusy(false);
      // Leave the prompt up if the folder picker was cancelled, so the user
      // can try again or dismiss explicitly, instead of it vanishing with
      // nothing having actually been saved.
      if (result.mode === 'cancelled') return;
      if ('error' in result && result.error) setFailed(true);
      setVisible(false);
    });
  }, []);

  const dismiss = useCallback(() => setVisible(false), []);

  return { showPrompt: visible, busy, failed, triggerAfterSave, saveNow, dismiss };
}
