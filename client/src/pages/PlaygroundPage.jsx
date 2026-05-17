import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import SectionHeading from '../components/SectionHeading.jsx';

const languages = ['javascript', 'python', 'java', 'cpp'];
const starterCode = {
  javascript: 'function solve() {\n  console.log("Hello CodeCrack AI");\n}',
  python: 'def solve():\n    print("Hello CodeCrack AI")',
  java: 'public class Solution {\n  public static void main(String[] args) {\n    System.out.println("Hello CodeCrack AI");\n  }\n}',
  cpp: '#include <iostream>\nint main() {\n  std::cout << "Hello CodeCrack AI";\n  return 0;\n}'
};

const PlaygroundPage = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(starterCode.javascript);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('Ready to run.');

  const handleLanguageChange = (event) => {
    const next = event.target.value;
    setLanguage(next);
    setCode(starterCode[next]);
    setOutput('Ready to run.');
  };

  const handleRun = async () => {
    setOutput('Running...');
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setOutput(`Output:\n${customInput || 'Hello CodeCrack AI'}`);
    } catch {
      setOutput('Execution failed');
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post('/submissions/submit', { questionId: null, language, code });
      toast.success('Solution submitted successfully');
    } catch (error) {
      toast.error('Submit failed');
    }
  };

  return (
    <div className="space-y-10">
      <SectionHeading title="Coding playground" subtitle="Solve code in a VS Code-style editor" />
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/90 px-5 py-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="rounded-full bg-slate-800 px-3 py-1">{language}</span>
              <span>Monaco editor</span>
            </div>
            <select value={language} onChange={handleLanguageChange} className="rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-white outline-none">
              {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
          <Editor height="480px" language={language} value={code} onChange={(value) => setCode(value)} options={{ minimap: { enabled: false }, fontSize: 14, scrollBeyondLastLine: false }} />
        </div>
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white">Run & Submit</h2>
            <p className="mt-2 text-slate-400">Write your solution, test custom input, and submit your code.</p>
            <textarea value={customInput} onChange={(e) => setCustomInput(e.target.value)} rows="5" placeholder="Custom input" className="mt-4 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" />
            <div className="mt-4 flex gap-3">
              <button onClick={handleRun} className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 text-white">Run code</button>
              <button onClick={handleSubmit} className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 bg-slate-900 px-6 py-3 text-white">Submit</button>
            </div>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white">Output</h3>
            <pre className="mt-4 rounded-3xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-200">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;
