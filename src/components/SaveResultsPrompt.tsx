import { useT } from '../i18n/useT';
import { Button } from './Button';

interface SaveResultsPromptProps {
  open: boolean;
  busy: boolean;
  failed: boolean;
  onSave: () => void;
  onDismiss: () => void;
}

export function SaveResultsPrompt({ open, busy, failed, onSave, onDismiss }: SaveResultsPromptProps) {
  const { t } = useT();
  if (!open) return null;
  return (
    <div className="saveResultsPrompt" role="status">
      <p className="saveResultsPromptText">{t('results_save_prompt_title')}</p>
      {failed && <p className="saveResultsPromptError">{t('results_save_prompt_error')}</p>}
      <div className="saveResultsPromptActions">
        <Button type="button" onClick={onSave} disabled={busy}>
          {busy ? t('results_save_prompt_saving') : t('results_save_prompt_save')}
        </Button>
        <Button type="button" variant="secondary" onClick={onDismiss} disabled={busy}>
          {t('results_save_prompt_dismiss')}
        </Button>
      </div>
    </div>
  );
}
