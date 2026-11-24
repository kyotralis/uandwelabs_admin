import { useState } from 'react'
import { X, RefreshCw, ExternalLink, Smartphone, Monitor } from 'lucide-react'

export default function LiveWebsiteDrawer({ open, onClose }) {
  const [iframeKey, setIframeKey] = useState(1)
  const [activeUrl, setActiveUrl] = useState('http://localhost:5173')
  const [deviceMode, setDeviceMode] = useState('desktop') // 'desktop' or 'mobile'

  if (!open) return null

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1)
  }

  const navigateTo = (path) => {
    setActiveUrl(`http://localhost:5173${path}`)
    setIframeKey((prev) => prev + 1)
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex flex-col font-sans">
      {/* Top Bar */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm tracking-wide">Live Website Preview</span>
          <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => navigateTo('/')}
              className="px-3 py-1 rounded-lg hover:bg-neutral-800 transition-colors font-medium cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('/dara')}
              className="px-3 py-1 rounded-lg hover:bg-neutral-800 transition-colors font-medium cursor-pointer"
            >
              Dara
            </button>
            <button
              onClick={() => navigateTo('/aura')}
              className="px-3 py-1 rounded-lg hover:bg-neutral-800 transition-colors font-medium cursor-pointer"
            >
              Aura
            </button>
            <button
              onClick={() => navigateTo('/ananda')}
              className="px-3 py-1 rounded-lg hover:bg-neutral-800 transition-colors font-medium cursor-pointer"
            >
              Ananda
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Device switcher */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                deviceMode === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                deviceMode === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh Live View"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <a
            href={activeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Open in Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-neutral-200 text-black transition-colors cursor-pointer font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-neutral-950 flex items-center justify-center p-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-white ${
            deviceMode === 'mobile' ? 'w-[400px] max-w-full' : 'w-full'
          }`}
        >
          <iframe
            key={iframeKey}
            src={activeUrl}
            title="Website Live View"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  )
}
