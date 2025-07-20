import React, { useState } from 'react';
import { Copy, Link, FileText, Sparkles, AlertCircle } from 'lucide-react';

export default function BlogToSocialTool() {
  const [inputMethod, setInputMethod] = useState('paste');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogUrl, setBlogUrl] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const platforms = {
    linkedin: { 
      name: 'LinkedIn', 
      color: 'bg-blue-600', 
      optimalLength: '150-300 chars',
      maxLength: 3000,
      bestPractices: 'Hook in first 2 lines, professional tone, 3-5 hashtags, question to drive engagement'
    },
    substack: { 
      name: 'Substack Notes', 
      color: 'bg-orange-500', 
      optimalLength: '200-400 chars',
      maxLength: 500,
      bestPractices: 'Conversational, thought-provoking, encourage subscriptions'
    },
    bluesky: { 
      name: 'Bluesky', 
      color: 'bg-sky-500', 
      optimalLength: '200-280 chars',
      maxLength: 300,
      bestPractices: 'Authentic, conversational, no hashtags needed'
    },
    facebook: { 
      name: 'Facebook', 
      color: 'bg-blue-700', 
      optimalLength: '40-80 chars',
      maxLength: 2000,
      bestPractices: 'Short hook, visual storytelling, encourage comments'
    },
    instagram: { 
      name: 'Instagram', 
      color: 'bg-gradient-to-r from-purple-500 to-pink-500', 
      optimalLength: '125-150 chars',
      maxLength: 2200,
      bestPractices: 'Strong hook, visual appeal, strategic hashtags, stories mention'
    }
  };

  const fetchBlogContent = async (url) => {
    try {
      const response = await fetch('https://blog-fetcher-api.vercel.app/api/fetch-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch content');
      }

      const data = await response.json();
      
      // Extract title and content separately
      const fullContent = data.content;
      const lines = fullContent.split('\n').filter(line => line.trim());
      
      // Look for title patterns
      let extractedTitle = '';
      let extractedContent = fullContent;
      
      if (lines.length > 0) {
        const firstLine = lines[0].trim();
        // Check if first line looks like a title
        if (firstLine.startsWith('TITLE:')) {
          extractedTitle = firstLine.replace('TITLE:', '').trim();
          extractedContent = lines.slice(1).join('\n').trim();
        } else if (firstLine.length < 100 && !firstLine.endsWith('.')) {
          extractedTitle = firstLine;
          extractedContent = lines.slice(1).join('\n').trim();
        }
      }
      
      setBlogTitle(extractedTitle);
      setBlogContent(extractedContent);
      
      return { title: extractedTitle, content: extractedContent };
    } catch (error) {
      throw new Error(`Unable to fetch content: ${error.message}`);
    }
  };

  const generateSocialPost = async () => {
  setIsLoading(true);
  setError('');
  
  try {
    let titleToAnalyze = '';
    let contentToAnalyze = '';
    
    if (inputMethod === 'url') {
      if (!blogUrl.trim()) {
        throw new Error('Please enter a blog URL');
      }
      // For testing, we'll skip URL fetching and use mock data
      titleToAnalyze = "Mock Title from URL";
      contentToAnalyze = "Mock content extracted from the URL. This is just for testing the UI flow.";
    } else {
      if (!blogContent.trim()) {
        throw new Error('Please add your blog content');
      }
      titleToAnalyze = blogTitle.trim();
      contentToAnalyze = blogContent.trim();
    }

    const platform = platforms[selectedPlatform];
    
    // Mock response after 2 seconds to simulate API call
    setTimeout(() => {
      const mockPosts = {
        linkedin: `🚀 ${titleToAnalyze || 'Your Amazing Blog Post'}

${contentToAnalyze.substring(0, 100)}...

Key insights:
- Innovation drives success
- AI is transforming industries  
- The future is exciting

What's your take on this? Share your thoughts! 👇

#innovation #AI #thoughtleadership #futureofwork

Read the full article: [LINK]`,

        facebook: `${titleToAnalyze || 'Check this out!'} 🎯

${contentToAnalyze.substring(0, 80)}...

What do you think? 💭`,

        instagram: `✨ ${titleToAnalyze || 'New post alert!'}

${contentToAnalyze.substring(0, 100)}...

📖 Full story in bio

#blog #content #inspiration #growth #mindset`,

        substack: `${contentToAnalyze.substring(0, 150)}...

Thoughts? 💭`,

        bluesky: `${titleToAnalyze || 'Interesting read:'} 

${contentToAnalyze.substring(0, 120)}...

What's your experience with this?`
      };

      setGeneratedPost(mockPosts[selectedPlatform] || mockPosts.linkedin);
      setIsLoading(false);
    }, 2000);

  } catch (err) {
    setError(err.message);
    setIsLoading(false);
  }
};
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost);
      const copyButton = document.querySelector('.copy-button');
      const originalText = copyButton.textContent;
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog to Social Media Tool</h1>
        <p className="text-gray-600">Transform your blog posts into platform-optimized social media content</p>
      </div>

      {/* Input Method Selection */}
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setInputMethod('paste')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              inputMethod === 'paste' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Copy & Paste
          </button>
          <button
            onClick={() => setInputMethod('url')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              inputMethod === 'url' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Link className="w-4 h-4 mr-2" />
            From URL
          </button>
        </div>

        {inputMethod === 'paste' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title (Optional)
              </label>
              <input
                type="text"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                placeholder="Enter your blog post title..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Content
              </label>
              <textarea
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                placeholder="Paste your blog post content here..."
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        ) : (
          <div>
            <input
              type="url"
              value={blogUrl}
              onChange={(e) => setBlogUrl(e.target.value)}
              placeholder="https://yourblog.com/your-post"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Platform Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Platform</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(platforms).map(([key, platform]) => (
            <button
              key={key}
              onClick={() => setSelectedPlatform(key)}
              className={`p-4 rounded-lg text-left border-2 transition-all ${
                selectedPlatform === key 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-xs font-medium mb-2 ${platform.color}`}>
                {platform.name}
              </div>
              <div className="text-sm text-gray-600">
                <div className="font-medium">Optimal: {platform.optimalLength}</div>
                <div className="text-xs mt-1">{platform.bestPractices}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="mb-6 text-center">
        <button
          onClick={generateSocialPost}
          disabled={isLoading || (!blogContent.trim() && !blogUrl.trim())}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center mx-auto"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isLoading ? 'Generating...' : 'Generate Optimized Post'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Generated Post Display */}
      {generatedPost && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Optimized {platforms[selectedPlatform].name} Post
            </h3>
            <button
              onClick={copyToClipboard}
              className="copy-button flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Post
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-800 whitespace-pre-wrap">{generatedPost}</p>
          </div>
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>Character count: {generatedPost.length}</span>
            <span>Target: {platforms[selectedPlatform].optimalLength}</span>
          </div>
        </div>
      )}
    </div>
  );
}
