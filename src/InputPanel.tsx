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

  return (
    <div className="flex flex-col gap-2 w-[640px]">
      {(['vehicle', 'subject', 'type', 'date', 'record'] as (keyof FormState)[]).map(key => (
        <input
          key={key}
          type="text"
          placeholder={key}
          value={formState[key]}
          onChange={handleChange(key)}
          className="border px-2 py-1 rounded"
        />
      ))}
    </div>
  );
};

export default InputPanel;