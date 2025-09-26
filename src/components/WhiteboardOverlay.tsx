import React from 'react';
import { FormState } from './InputPanel';

type Props = {
  form: FormState;
};

const WhiteboardOverlay: React.FC<Props> = ({ form }) => {
  return (
    <div className="absolute bottom-4 left-4 bg-white/80 p-3 rounded shadow text-xs leading-tight font-bold whitespace-pre-wrap z-10">
      {`📅 ${form.date}
🚗 ${form.vehicle}
📌 ${form.type} / ${form.subject}
📝 ${form.record}`}
    </div>
  );
};

export default WhiteboardOverlay;