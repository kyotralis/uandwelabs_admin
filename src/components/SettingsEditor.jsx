import { Settings, Globe, Mail, Phone, MapPin } from 'lucide-react'

export default function SettingsEditor({ cms, setCms }) {
  const settings = cms.settings || {}

  const updateField = (field, val) => {
    setCms((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: val,
      },
    }))
  }

  const updateSocialLink = (network, val) => {
    setCms((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        socialLinks: {
          ...prev.settings?.socialLinks,
          [network]: val,
        },
      },
    }))
  }

  const social = settings.socialLinks || {}

  return (
    <div className="space-y-8">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-neutral-400" />
            <span>Global Contact & Footer Settings</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Company branding, contact information, social URLs, and footer manifesto text across the entire website.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Company Name</label>
              <input
                type="text"
                value={settings.companyName ?? 'UANDWE Labs'}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail ?? 'contact@uandwelabs.com'}
                onChange={(e) => updateField('contactEmail', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contactPhone ?? '+91 80 4123 4567'}
                onChange={(e) => updateField('contactPhone', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Office Address</label>
              <input
                type="text"
                value={settings.officeAddress ?? 'Bengaluru Innovation Corridor, Karnataka, India'}
                onChange={(e) => updateField('officeAddress', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Footer Tagline Manifesto</label>
            <textarea
              rows={3}
              value={settings.footerTagline ?? ''}
              onChange={(e) => updateField('footerTagline', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-200 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold block">
            Social & Developer Links
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={social.linkedin ?? ''}
                onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">GitHub URL</label>
              <input
                type="text"
                value={social.github ?? ''}
                onChange={(e) => updateSocialLink('github', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">X (Twitter) URL</label>
              <input
                type="text"
                value={social.twitter ?? ''}
                onChange={(e) => updateSocialLink('twitter', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
