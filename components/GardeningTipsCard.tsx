
import React, { useMemo } from 'react';
import { CheckCircleIcon, MailOpenIcon } from './Icons';

interface GardeningTipsCardProps {
  tips: string;
  userEmail: string;
  onUnsubscribe: () => void;
}

const GardeningTipsCard: React.FC<GardeningTipsCardProps> = ({ tips, userEmail, onUnsubscribe }) => {
  const { subject, body } = useMemo(() => {
    const parts = tips.split('---');
    if (parts.length >= 2) {
      const subjectText = parts[0].replace('Predmet:', '').trim();
      const bodyText = parts.slice(1).join('---').trim();
      return { subject: subjectText, body: bodyText };
    }
    return { subject: 'Vaše záhradnícke tipy', body: tips };
  }, [tips]);

  const formatBody = (text: string) => {
    const elements: (JSX.Element | null)[] = [];
    let listItems: JSX.Element[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-2 mb-4">
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };

    text.split('\n').forEach((line, index) => {
      if (line.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={index} className="text-2xl font-bold text-gray-800 mt-6 mb-3">{line.substring(3)}</h2>);
      } else if (line.startsWith('- ')) {
        listItems.push(<li key={index}>{line.substring(2)}</li>);
      } else {
        flushList();
        if (line.trim() === '') {
            elements.push(<br key={index} />);
        } else {
            elements.push(<p key={index} className="mb-2">{line}</p>);
        }
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
      <div className="flex justify-center items-center mb-4">
        <CheckCircleIcon className="h-12 w-12 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Ďakujeme za odber!</h2>
      <p className="text-gray-600 mt-2">
        Vaše tipy boli úspešne vygenerované a boli by odoslané na <strong>{userEmail}</strong>.
      </p>

      <div className="mt-8 text-left bg-white p-6 rounded-lg shadow-md border border-gray-200 max-h-96 overflow-y-auto">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b">
            <MailOpenIcon className="h-6 w-6 text-gray-500" />
            <h3 className="text-xl font-semibold text-gray-800">{subject}</h3>
        </div>
        <div>{formatBody(body)}</div>
      </div>
      
      <button 
        onClick={onUnsubscribe} 
        className="mt-8 text-sm text-gray-500 hover:text-gray-700 underline"
      >
        Zrušiť odber a začať odznova
      </button>
    </div>
  );
};

export default GardeningTipsCard;
