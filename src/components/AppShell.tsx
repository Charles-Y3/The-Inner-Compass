import type { ReactNode } from 'react';
import { AppLogo } from './AppLogo';
import { SettingsPopover } from './SettingsPopover';

interface AppShellProps {
  children: ReactNode;
  /** Locks the shell to one viewport height with no page scroll — used by
   * QuestionsPage so the layout doesn't jump as question/option text
   * length varies between questions. Other pages keep natural scrolling. */
  fixed?: boolean;
}

export function AppShell({ children, fixed = false }: AppShellProps) {
  return (
    <div className={`shell ${fixed ? 'shellFixed' : ''}`}>
      <div className="shellTop">
        <AppLogo />
        <SettingsPopover />
      </div>
      {children}
    </div>
  );
}
