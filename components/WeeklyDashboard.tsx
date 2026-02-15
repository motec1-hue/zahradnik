
import React, { useEffect, useRef } from 'react';

interface WeeklyDashboardProps {
  content: string;
}

const WeeklyDashboard: React.FC<WeeklyDashboardProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = containerRef.current?.querySelectorAll('.reveal');
    revealElements?.forEach((el) => observer.observe(el));

    return () => {
      revealElements?.forEach((el) => observer.unobserve(el));
    };
  }, [content]);

  const parseContent = (text: string) => {
    const lines = text.split('\n');
    let title = '';
    const sections: { title: string; content: React.ReactNode[] }[] = [];
    let currentSection: { title: string; content: React.ReactNode[] } | null = null;

    lines.forEach((line, idx) => {
      if (line.startsWith('# ')) {
        title = line.substring(2);
      } else if (line.startsWith('## ')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: line.substring(3), content: [] };
      } else if (currentSection) {
        if (line.startsWith('- ')) {
          currentSection.content.push(
            <li key={idx} className="flex items-start gap-3 mb-2 text-gray-700">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-green-500 shrink-0" />
              <span>{line.substring(2)}</span>
            </li>
          );
        } else if (line.trim() !== '') {
          currentSection.content.push(<p key={idx} className="mb-4 text-gray-700 leading-relaxed">{line}</p>);
        }
      }
    });
    if (currentSection) sections.push(currentSection);

    return { title, sections };
  };

  const { title, sections } = parseContent(content);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Hero sekcia */}
      <div className="reveal bg-green-900/10 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] border border-green-200 shadow-inner">
        <span className="inline-block px-4 py-1 bg-green-600 text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider">Aktuálne vydanie</span>
        <h1 className="text-4xl md:text-5xl font-black text-green-950 mb-4 leading-tight">{title}</h1>
        <p className="text-green-800 font-medium">Aktualizované pre týždeň od {new Date().toLocaleDateString('sk-SK')}</p>
      </div>

      {/* Grid pre sekcie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, index) => (
          <div 
            key={index} 
            style={{ transitionDelay: `${index * 100}ms` }}
            className={`reveal bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white hover:shadow-xl transition-shadow duration-300 ${
              index === 0 ? 'md:col-span-2' : ''
            }`}
          >
            <h2 className="text-xl font-bold text-green-900 mb-6 flex items-center gap-2">
              <span className="h-1 w-8 bg-green-500 rounded-full" />
              {section.title}
            </h2>
            <div className="prose prose-green max-w-none">
              {section.title.toLowerCase().includes('zoznam') || section.title.toLowerCase().includes('sadiť') ? (
                <ul className="list-none p-0">{section.content}</ul>
              ) : (
                section.content
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyDashboard;
