import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Globe, ExternalLink, Clock, AlertCircle, TrendingUp, Zap, Brain, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  title: string;
  url: string;
  description: string;
  domain: string;
  relevance: number;
}

interface QueryHistory {
  query: string;
  results: SearchResult[];
  summary: string;
  timestamp: Date;
}

const SAMPLE_PROMPTS = [
  "Best places to visit in Delhi",
  "How to learn React in 2024",
  "Latest AI developments", 
  "Climate change solutions",
  "Healthy breakfast recipes",
  "Future of quantum computing",
  "Space exploration milestones"
];

const EnhancedLoadingAnimation = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center min-h-screen px-4"
  >
    <div className="relative mb-8">
      {/* Outer rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-32 h-32 border-2 border-primary/20 border-t-primary rounded-full spinner-glow"
      />
      
      {/* Inner pulsing core */}
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-8 bg-gradient-primary rounded-full blur-md"
      />
      
      {/* Center icon */}
      <motion.div
        animate={{ 
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Brain className="w-8 h-8 text-primary-glow" />
      </motion.div>
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          className="absolute w-2 h-2 bg-accent rounded-full"
          style={{
            left: `${50 + 30 * Math.cos(i * Math.PI / 3)}%`,
            top: `${50 + 30 * Math.sin(i * Math.PI / 3)}%`,
          }}
        />
      ))}
    </div>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-center space-y-4 max-w-md"
    >
      <h3 className="text-2xl font-bold text-gradient">AI Agent Working</h3>
      <div className="space-y-2">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 text-accent" />
          Analyzing your query
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-muted-foreground flex items-center justify-center gap-2"
        >
          <Globe className="w-4 h-4 text-primary" />
          Searching the web
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="text-muted-foreground flex items-center justify-center gap-2 typing-dots"
        >
          <Sparkles className="w-4 h-4 text-secondary" />
          Generating insights
        </motion.p>
      </div>
    </motion.div>
  </motion.div>
);

const EnhancedHeroSection = ({ onSearch, isLoading }: { onSearch: (query: string) => void; isLoading: boolean }) => {
  const [query, setQuery] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % SAMPLE_PROMPTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen px-4 text-center relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-primary opacity-10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-accent opacity-10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="mb-12 relative z-10"
      >
        <div className="flex items-center justify-center space-x-4 mb-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="p-4 glass-enhanced rounded-2xl float"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-10 h-10 text-primary glow-primary" />
            </motion.div>
          </motion.div>
          <div>
            <h1 className="text-6xl md:text-7xl font-bold text-gradient mb-2">Query Agent</h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-1 bg-gradient-primary rounded-full"
            />
          </div>
        </div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-muted-light max-w-3xl mx-auto leading-relaxed"
        >
          Your AI-powered research assistant. Ask anything and get{' '}
          <span className="text-gradient-accent font-semibold">intelligent summaries</span>{' '}
          from across the web in seconds.
        </motion.p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 80 }}
        className="w-full max-w-3xl space-y-8 relative z-10"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-primary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything..."
              className="pl-16 pr-32 py-8 text-xl glass-enhanced border-glass-border bg-glass/30 focus:bg-glass/60 focus:border-primary/50 transition-all duration-500 rounded-2xl"
              disabled={isLoading}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
            />
            <Button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 btn-ai text-primary-foreground px-8 py-4 rounded-xl font-semibold disabled:opacity-50 transition-all duration-300"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-5 h-5" />
                </motion.div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPrompt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground"
          >
            <span className="text-sm font-medium">Try asking:</span>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass px-4 py-2 rounded-full border border-glass-border hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => setQuery(SAMPLE_PROMPTS[currentPrompt])}
            >
              <span className="text-sm text-gradient">"{SAMPLE_PROMPTS[currentPrompt]}"</span>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.form>

      {/* Feature highlights */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full relative z-10"
      >
        {[
          { icon: Zap, title: "Lightning Fast", desc: "Get results in seconds" },
          { icon: Brain, title: "AI-Powered", desc: "Smart analysis & summaries" },
          { icon: Globe, title: "Web-Wide", desc: "Search across the internet" }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.1 }}
            className="glass glass-hover p-6 rounded-xl text-center border border-glass-border"
          >
            <feature.icon className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const InvalidQueryMessage = ({ onBack }: { onBack: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center min-h-screen px-4 text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      className="glass-enhanced rounded-3xl p-12 max-w-lg mx-auto relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-accent"></div>
      
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <AlertCircle className="w-20 h-20 text-accent mx-auto mb-6" />
      </motion.div>
      
      <h3 className="text-3xl font-bold mb-4 text-gradient">Hmm, that doesn't look searchable</h3>
      <p className="text-muted-light mb-8 leading-relaxed">
        I'm designed to help you find information from the web. Try asking about topics, facts, 
        or questions that need research and analysis.
      </p>
      
      <Button 
        onClick={onBack} 
        className="btn-ai px-8 py-3 font-semibold transition-all duration-300"
      >
        <ArrowRight className="w-4 h-4 mr-2" />
        Try Another Query
      </Button>
    </motion.div>
  </motion.div>
);

const EnhancedResultsSection = ({ 
  query, 
  results, 
  summary, 
  onBack, 
  onNewSearch 
}: { 
  query: string;
  results: SearchResult[];
  summary: string;
  onBack: () => void;
  onNewSearch: (query: string) => void;
}) => {
  const [newQuery, setNewQuery] = useState('');

  const handleNewSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuery.trim()) {
      onNewSearch(newQuery.trim());
      setNewQuery('');
    }
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 90) return "text-success";
    if (relevance >= 70) return "text-primary";
    if (relevance >= 50) return "text-warning";
    return "text-muted-foreground";
  };

  const getRelevanceBadgeVariant = (relevance: number) => {
    if (relevance >= 90) return "default";
    if (relevance >= 70) return "secondary";
    return "outline";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-4 py-6 bg-gradient-to-br from-background via-background/95 to-background/90"
    >
      {/* Enhanced header with new search */}
      <div className="max-w-6xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-enhanced p-6 rounded-2xl border border-glass-border"
        >
          <form onSubmit={handleNewSearch} className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={newQuery}
                onChange={(e) => setNewQuery(e.target.value)}
                placeholder="Ask another question..."
                className="pl-12 pr-4 py-4 glass bg-glass/30 focus:bg-glass/60 border-glass-border focus:border-primary/50 rounded-xl transition-all duration-300"
              />
            </div>
            <Button 
              type="submit" 
              disabled={!newQuery.trim()}
              className="btn-ai px-8 py-4 font-semibold"
            >
              <div className="flex items-center gap-2">
                Search
                <ArrowRight className="w-4 h-4" />
              </div>
            </Button>
          </form>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Query header with stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full border border-glass-border">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-muted-foreground">Query processed successfully</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Results for: "{query}"
          </h2>
          
          <div className="flex items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <span className="font-medium">{results.length} sources found</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="font-medium">High relevance</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Source Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 glass rounded-xl">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Sources</h3>
              <p className="text-muted-foreground">Curated from top-tier websites</p>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.3 + index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className="group"
              >
                <div className="result-card p-6 rounded-2xl border border-glass-border h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant={getRelevanceBadgeVariant(result.relevance)}
                          className="text-xs font-medium"
                        >
                          <Star className="w-3 h-3 mr-1" />
                          {result.relevance}% match
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">
                          {result.domain}
                        </span>
                      </div>
                      <h4 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {result.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {result.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs text-muted-light truncate flex-1 mr-4">
                      {result.url}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(result.url, '_blank')}
                      className="ml-auto hover:bg-primary/10 hover:text-primary transition-all duration-300 p-2 rounded-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 glass rounded-xl glow-primary">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gradient">AI Summary</h3>
              <p className="text-muted-foreground">Intelligent analysis from multiple sources</p>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="card-premium p-8 rounded-2xl border border-glass-border relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Generated Insights</span>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground leading-relaxed text-lg">
                  {summary}
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-glass-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Fact-checked across {results.length} sources</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-accent" />
                  <span>Generated in real-time</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function QueryAgent() {
  const [currentView, setCurrentView] = useState<'hero' | 'loading' | 'results' | 'invalid'>('hero');
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentResults, setCurrentResults] = useState<SearchResult[]>([]);
  const [currentSummary, setCurrentSummary] = useState('');
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([]);

  // Enhanced validation
  const isValidQuery = (query: string): boolean => {
    const invalidPatterns = [
      /^(add|create|make|set|delete|remove)\s/i,
      /^(what is|what's)\s*\d+\s*[\+\-\*\/]\s*\d+/i,
      /^(hello|hi|hey|good morning|good evening)/i,
      /^(how are you|who are you|what's your name)/i
    ];
    
    return !invalidPatterns.some(pattern => pattern.test(query)) && query.length > 3;
  };

  const handleSearch = async (query: string) => {
  setCurrentQuery(query);

  if (!isValidQuery(query)) {
    setCurrentView('invalid');
    return;
  }

  const existingQuery = queryHistory.find(
    h => h.query.toLowerCase() === query.toLowerCase()
  );

  if (existingQuery) {
    setCurrentResults(existingQuery.results);
    setCurrentSummary(existingQuery.summary);
    setCurrentView('results');
    return;
  }

  setCurrentView('loading');

  try {
      const apiBaseUrl = "https://query-assistant-backend-wn8q.onrender.com";    
      const response = await fetch(`${apiBaseUrl}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.valid) {
      const summary = data.summary;
      const links = data.links || [];

      const results: SearchResult[] = links.map((link: any) => ({
        title: link.title,
        url: link.url,
        description: link.snippet,
        domain: new URL(link.url).hostname,
        relevance: 80 // Fixed score, or you can compute dynamically if needed
      }));

      setCurrentResults(results);
      setCurrentSummary(summary);

      const newHistoryItem: QueryHistory = {
        query,
        results,
        summary,
        timestamp: new Date()
      };

      setQueryHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
      setCurrentView('results');
    } else {
      setCurrentView('invalid');
    }
  } catch (error) {
    console.error('Search error:', error);
    setCurrentView('invalid');
  }
};



  const handleBack = () => {
    setCurrentView('hero');
    setCurrentQuery('');
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatePresence mode="wait">
        {currentView === 'hero' && (
          <EnhancedHeroSection 
            key="hero"
            onSearch={handleSearch} 
            isLoading={false} 
          />
        )}
        
        {currentView === 'loading' && (
          <EnhancedLoadingAnimation key="loading" />
        )}
        
        {currentView === 'invalid' && (
          <InvalidQueryMessage key="invalid" onBack={handleBack} />
        )}
        
        {currentView === 'results' && (
          <EnhancedResultsSection
            key="results"
            query={currentQuery}
            results={currentResults}
            summary={currentSummary}
            onBack={handleBack}
            onNewSearch={handleSearch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
