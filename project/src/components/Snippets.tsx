import React, { useState } from 'react';
import { Save, X, Plus, Trash2, ChevronDown } from 'lucide-react';

interface CodeBlock {
  language: string;
  code: string;
}

interface SnippetFormData {
  name: string;
  codeBlocks: CodeBlock[];
}

const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'Ruby',
  'PHP',
  'Swift',
  'Go',
  'Rust',
  'HTML',
  'CSS',
  'SQL',
  'Shell',
  'JSON',
  'YAML',
  'Markdown',
  'XML'
].sort();

const Snippets = () => {
  const [snippets, setSnippets] = useState<SnippetFormData[]>(() => {
    const saved = localStorage.getItem('codeSnippets');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState<SnippetFormData>({
    name: '',
    codeBlocks: [{ language: LANGUAGES[0], code: '' }]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSnippets = [...snippets, formData];
    setSnippets(newSnippets);
    localStorage.setItem('codeSnippets', JSON.stringify(newSnippets));
    setFormData({ name: '', codeBlocks: [{ language: LANGUAGES[0], code: '' }] });
  };

  const addCodeBlock = () => {
    setFormData({
      ...formData,
      codeBlocks: [...formData.codeBlocks, { language: LANGUAGES[0], code: '' }]
    });
  };

  const removeCodeBlock = (index: number) => {
    setFormData({
      ...formData,
      codeBlocks: formData.codeBlocks.filter((_, i) => i !== index)
    });
  };



  const updateCodeBlock = (index: number, field: keyof CodeBlock, value: string) => {
    const newCodeBlocks = [...formData.codeBlocks];
    newCodeBlocks[index] = { ...newCodeBlocks[index], [field]: value };
    setFormData({ ...formData, codeBlocks: newCodeBlocks });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
          Add Code Snippet
        </h1>
        <p className="text-white/60">Save multiple code blocks in a single snippet</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-effect rounded-xl p-6 max-w-4xl">
        <div className="space-y-6">
          <div>
            <label className="block text-white/80 mb-2" htmlFor="name">
              Snippet Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/10 rounded-lg border border-white/20 p-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
              placeholder="Enter a descriptive name for your snippet"
              required
            />
          </div>

          <div className="space-y-6">
            {formData.codeBlocks.map((block, index) => (
              <div key={index} className="glass-card p-4 rounded-lg relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white/80 font-medium flex items-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10">
                      {index + 1}
                    </span>
                    Code Block
                  </h3>
                  {formData.codeBlocks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCodeBlock(index)}
                      className="text-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-white/80 mb-2" htmlFor={`language-${index}`}>
                      Programming Language
                    </label>
                    <div className="relative">
                      <select
                        id={`language-${index}`}
                        value={block.language}
                        onChange={(e) => updateCodeBlock(index, 'language', e.target.value)}
                        className="w-full bg-white/10 rounded-lg border border-white/20 p-3 text-white focus:outline-none focus:border-blue-400 transition-colors appearance-none"
                        required
                      >
                        {LANGUAGES.map((lang) => (
                          <option key={lang} value={lang} className="bg-gray-900">
                            {lang}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2" htmlFor={`code-${index}`}>
                      Code
                    </label>
                    <textarea
                      id={`code-${index}`}
                      value={block.code}
                      onChange={(e) => updateCodeBlock(index, 'code', e.target.value)}

                      className="w-full bg-white/10 rounded-lg border border-white/20 p-3 text-white focus:outline-none focus:border-blue-400 transition-colors min-h-[200px] font-mono"
                      placeholder={`Enter your ${block.language} code here...`}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addCodeBlock}
            className="w-full glass-card rounded-lg p-3 text-white/60 hover:text-white/80 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Another Code Block
          </button>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setFormData({ name: '', codeBlocks: [{ language: LANGUAGES[0], code: '' }] })}
              className="px-4 py-2 rounded-lg flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/20"
            >
              <Save className="w-4 h-4" />
              Save Snippet
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Snippets;