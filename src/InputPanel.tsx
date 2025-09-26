import React from 'react';

type FormState = {
  vehicle: string;
  subject: string;
  type: string;
  date: string;
  record: string;
};

type Props = {
  formState: FormState;
  setFormState: (state: FormState) => void;
};

const InputPanel: React.FC<Props> = ({ formState, setFormState }) => {
  const handleChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [key]: e.target.value });
  };

  const placeholders: Record<keyof FormState, string> = {
    vehicle: '設備名',
    subject: '対象物',
    type: '種類',
    date: '日付（例: 2025-09-26）',
    record: '備考・記録',
  };

  return (
    <div className="flex flex-col gap-2 w-[640px]">
      {(Object.keys(formState) as (keyof FormState)[]).map(key => (
        <div key={key} className="flex flex-col">
          <label className="text-sm text-gray-700">{placeholders[key]}</label>
          <input
            type="text"
            placeholder={placeholders[key]}
            value={formState[key]}
            onChange={handleChange(key)}
            className="border px-2 py-1 rounded"
          />
        </div>
      ))}
    </div>
  );
};

export default InputPanel;