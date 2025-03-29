import React, { useState, useEffect } from 'react';
import { Code, Search, Trash2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface CodeBlock {
  language: string;
  code: string;
}

interface SnippetData {
  name: string;
  codeBlocks: CodeBlock[];
}

const SavedSnippets = () => {
  const [snippets, setSnippets] = useState<SnippetData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSnippets, setExpandedSnippets] = useState<Record<number, boolean>>({});
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('codeSnippets');
    if (saved) {
      setSnippets(JSON.parse(saved));
    }
  }, []);

  const filteredSnippets = snippets.filter(snippet =>
    snippet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.codeBlocks.some(block => 
      block.language.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const deleteSnippet = (index: number) => {
    const newSnippets = snippets.filter((_, i) => i !== index);
    setSnippets(newSnippets);
    localStorage.setItem('codeSnippets', JSON.stringify(newSnippets));
  };

  const toggleSnippet = (index: number) => {
    setExpandedSnippets(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const copyToClipboard = async (code: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedStates({ ...copiedStates, [blockId]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [blockId]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
          Saved Snippets
        </h1>
        <p className="text-white/60">Browse and manage your code snippets</p>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search snippets by name or language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 rounded-lg pl-10 pr-4 py-2 text-white border border-white/20 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredSnippets.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              {searchTerm ? 'No snippets found' : 'No snippets saved yet'}
            </div>
          ) : (
            filteredSnippets.map((snippet, index) => (
              <div key={index} className="glass-card rounded-lg p-4">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSnippet(index)}
                >
                  <div>
                    <h3 className="font-semibold text-white/90 flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-400" />
                      {snippet.name}
                    </h3>
                    <span className="text-sm text-white/60">
                      {snippet.codeBlocks.length} code block{snippet.codeBlocks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSnippet(index);
                      }}
                      className="text-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expandedSnippets[index] ? (
                      <ChevronUp className="w-5 h-5 text-white/60" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/60" />
                    )}
                  </div>
                </div>

                {expandedSnippets[index] && (
                  <div className="mt-4 space-y-4">
                    {snippet.codeBlocks.map((block, blockIndex) => {
                      const blockId = `${index}-${blockIndex}`;
                      return (
                        <div key={blockIndex} className="bg-black/30 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white/80">
                              {block.language}
                            </span>
                            <button
                              onClick={() => copyToClipboard(block.code, blockId)}
                              className="text-white/40 hover:text-white/60 transition-colors flex items-center gap-1"
                            >
                              {copiedStates[blockId] ? (
                                <>
                                  <Check className="w-4 h-4 text-green-400" />
                                  <span className="text-sm text-green-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  <span className="text-sm">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="overflow-x-auto font-mono text-sm text-white/80">
                            <code>{block.code}</code>
                          </pre>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedSnippets;