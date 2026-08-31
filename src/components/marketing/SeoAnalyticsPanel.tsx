import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Globe, 
  BarChart3, 
  CheckCircle, 
  Copy, 
  Link2, 
  Sparkles, 
  Code, 
  Eye,
  Sliders,
  Check
} from 'lucide-react';

export const SeoAnalyticsPanel: React.FC = () => {
  const { utmRecords, addUtmClick } = useApp();
  const [copied, setCopied] = useState(false);

  // 5-Parameter UTM builder
  const [utmBaseUrl, setUtmBaseUrl] = useState('https://forsa-t.com/business/register');
  const [utmSource, setUtmSource] = useState('meta_ads');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('adelaide_cbd_merchants_launch');
  const [utmTerm, setUtmTerm] = useState('cafe_discount_software');
  const [utmContent, setUtmContent] = useState('video_barista_testimonial');

  const generatedUtmUrl = `${utmBaseUrl}?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=${encodeURIComponent(utmCampaign)}&utm_term=${encodeURIComponent(utmTerm)}&utm_content=${encodeURIComponent(utmContent)}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedUtmUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 text-slate-800">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200/80">
              Technical SEO & Attribution Hub
            </span>
            <span className="text-xs text-slate-500 font-mono">BOD 5.1 & 5.6</span>
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900 mt-1">
            Search Optimization & GA4 Event Tracking
          </h3>
        </div>

        {/* Lighthouse Metric Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 block font-mono">Lighthouse</span>
            <span className="text-sm font-bold text-emerald-800 font-mono">98/100</span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 block font-mono">Core Web Vitals</span>
            <span className="text-sm font-bold text-emerald-800 font-mono">0.8s LCP</span>
          </div>
        </div>
      </div>

      {/* 5-Parameter UTM Generator */}
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-amber-600" />
            5-Parameter UTM Campaign URL Builder
          </h4>
          <p className="text-xs text-slate-500">
            Generate standard URLs for paid Meta, Google Search, LinkedIn, and QR print collateral:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-600 block mb-1 font-medium">Target URL</label>
            <input
              id="input-utm-base"
              type="text"
              value={utmBaseUrl}
              onChange={(e) => setUtmBaseUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-600 block mb-1 font-medium">utm_source (e.g. meta, google)</label>
            <input
              id="input-utm-source"
              type="text"
              value={utmSource}
              onChange={(e) => setUtmSource(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-600 block mb-1 font-medium">utm_medium (e.g. cpc, print)</label>
            <input
              id="input-utm-medium"
              type="text"
              value={utmMedium}
              onChange={(e) => setUtmMedium(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-600 block mb-1 font-medium">utm_campaign</label>
            <input
              id="input-utm-campaign"
              type="text"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-600 block mb-1 font-medium">utm_term (Keyword)</label>
            <input
              id="input-utm-term"
              type="text"
              value={utmTerm}
              onChange={(e) => setUtmTerm(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-600 block mb-1 font-medium">utm_content (Creative ID)</label>
            <input
              id="input-utm-content"
              type="text"
              value={utmContent}
              onChange={(e) => setUtmContent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:border-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Resulting URL & Copy Action */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="font-mono text-[11px] text-slate-800 break-all select-all font-medium">
            {generatedUtmUrl}
          </div>
          <button
            id="btn-copy-utm"
            onClick={handleCopyUrl}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied URL' : 'Copy Campaign Link'}
          </button>
        </div>
      </div>

      {/* SEO Structured Data & OpenGraph Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-sky-700" />
            Schema.org JSON-LD Structured Data
          </h4>
          <pre className="font-mono text-[11px] text-slate-700 bg-white p-3 rounded-lg overflow-x-auto border border-slate-200">
{`{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "FORSA-T",
  "applicationCategory": "ShoppingApplication",
  "operatingSystem": "iOS, Android, Web",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "AUD",
    "lowPrice": "49.00"
  },
  "areaServed": "Adelaide, South Australia"
}`}
          </pre>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-purple-700" />
            GA4 & Google Tag Manager Container
          </h4>
          <div className="space-y-2 text-slate-700">
            <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
              <span>Google Analytics 4 Measurement ID:</span>
              <span className="font-mono text-amber-700 font-bold">G-FORSAT2026</span>
            </div>
            <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
              <span>Google Tag Manager (GTM Container):</span>
              <span className="font-mono text-sky-700 font-bold">GTM-FRST99X</span>
            </div>
            <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
              <span>Microsoft Clarity Heatmaps:</span>
              <span className="font-mono text-emerald-700 font-bold">clarity.ms/tag/frst_sa</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
