import type { Settings } from "../state/persistence";
import Modal from "./Modal";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  hardMode: boolean;
  onChange: (patch: Partial<Settings>) => void;
  onToggleHardMode: (value: boolean) => void;
}

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const Toggle = ({ label, description, checked, onChange }: ToggleProps) => (
  <label className="setting">
    <span className="setting-text">
      <span className="setting-label">{label}</span>
      <span className="setting-description">{description}</span>
    </span>
    <input
      type="checkbox"
      className="switch"
      role="switch"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  </label>
);

const SettingsModal = ({
  open,
  onClose,
  settings,
  hardMode,
  onChange,
  onToggleHardMode,
}: SettingsModalProps) => (
  <Modal open={open} onClose={onClose} title="Settings">
    <div className="settings">
      <Toggle
        label="Hard mode"
        description="Any revealed hints must be used in later guesses."
        checked={hardMode}
        onChange={onToggleHardMode}
      />
      <Toggle
        label="Dark theme"
        description="Reduce glare in low light."
        checked={settings.theme === "dark"}
        onChange={(value) => onChange({ theme: value ? "dark" : "light" })}
      />
      <Toggle
        label="High contrast"
        description="Use orange and blue instead of green and yellow."
        checked={settings.highContrast}
        onChange={(value) => onChange({ highContrast: value })}
      />
    </div>
  </Modal>
);

export default SettingsModal;
