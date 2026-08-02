interface OptionRowProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionRow({ label, selected, onClick }: OptionRowProps) {
  return (
    <button
      type="button"
      className={`optionRow ${selected ? 'optionRowSelected' : ''}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
