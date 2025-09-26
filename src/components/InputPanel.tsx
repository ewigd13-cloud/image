import React from 'react';

type Props = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
};

export type FormState = {
  record: string;
  subject: string;
  type: string;
  date: string;
  vehicle: string;
};

const InputPanel: React.FC<Props> = ({ form, setForm }) => {
  return (
    <div className="p-4 space-y-2 bg-white/90 rounded shadow">
      <input
        type="text"
        placeholder="記録"
        value={form.record}
        onChange={e => setForm({ ...form, record: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="対象"
        value={form.subject}
        onChange={e => setForm({ ...form, subject: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="種類"
        value={form.type}
        onChange={e => setForm({ ...form, type: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        value={form.date}
        onChange={e => setForm({ ...form, date: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="車両名"
        value={form.vehicle}
        onChange={e => setForm({ ...form, vehicle: e.target.value })}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default InputPanel;