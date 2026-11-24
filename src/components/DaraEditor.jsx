import { useState } from 'react'
import { Layers, Volume2, Shield, Heart, Sparkles, Image } from 'lucide-react'

export default function DaraEditor({ cms, setCms, onOpenMediaPicker }) {
  const dara = cms.dara || {}

  const updateNestedField = (parentKey, field, val) => {
    setCms((prev) => ({
      ...prev,
      dara: {
        ...prev.dara,
        [parentKey]: {
          ...prev.dara?.[parentKey],
          [field]: val,
        },
      },
    }))
  }

  const updateSlideItem = (arrayKey, index, field, val) => {
    setCms((prev) => {
      const clone = JSON.parse(JSON.stringify(prev.dara?.[arrayKey] || []))
      if (!clone[index]) clone[index] = {}
      clone[index][field] = val
      return {
        ...prev,
        dara: {
          ...prev.dara,
          [arrayKey]: clone,
        },
      }
    })
  }

  const heroSlides = dara.heroSlides || []
  const clock = dara.clock || {}
  const gallery = dara.gallery || []
  const features = dara.features || []
  const pillars = dara.pillars || []
  const privacy = dara.privacy || {}
  const privacyCards = privacy.cards || []
  const purpose = dara.purpose || {}
  const cta = dara.cta || {}

  return (
    <div className="space-y-10">
      {/* 1. HERO CAROUSEL */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-neutral-400" />
            <span>Dara Product Hero Slides ({heroSlides.length})</span>
          </h2>
          <p className="text-xs text-neutral-400">Headlines, taglines, sub-paragraphs, and artwork photos for Dara Hero.</p>
        </div>

        <div className="space-y-4">
          {heroSlides.map((slide, idx) => (
            <div key={slide.id || idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <span className="font-bold text-xs uppercase text-neutral-400 block">Slide #{idx + 1}: {slide.headline || slide.title}</span>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Headline / Title</label>
                <input
                  type="text"
                  value={slide.headline || slide.title || ''}
                  onChange={(e) => {
                    updateSlideItem('heroSlides', idx, 'headline', e.target.value)
                    updateSlideItem('heroSlides', idx, 'title', e.target.value)
                  }}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={slide.subtitle || slide.desc || ''}
                  onChange={(e) => {
                    updateSlideItem('heroSlides', idx, 'subtitle', e.target.value)
                    updateSlideItem('heroSlides', idx, 'desc', e.target.value)
                  }}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-200 leading-relaxed"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Photo</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800 shrink-0">
                    <img src={slide.src} alt="" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={slide.src || ''}
                    onChange={(e) => {
                      updateSlideItem('heroSlides', idx, 'src', e.target.value)
                      updateSlideItem('heroSlides', idx, 'thumb', e.target.value)
                    }}
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-300 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onOpenMediaPicker((newPath) => {
                        updateSlideItem('heroSlides', idx, 'src', newPath)
                        updateSlideItem('heroSlides', idx, 'thumb', newPath)
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. TALKING CLOCK & BUILT-IN SPEAKER */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-neutral-400" />
            <span>Talking Clock & Built-In Speaker Deck</span>
          </h2>
          <p className="text-xs text-neutral-400">Time announcement, acoustic speaker description, and button text.</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Section Title</label>
            <input
              type="text"
              value={clock.clockSectionTitle ?? 'Talking Clock & Built-In Speaker'}
              onChange={(e) => updateNestedField('clock', 'clockSectionTitle', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Section Description</label>
            <textarea
              rows={3}
              value={clock.clockSectionDesc ?? ''}
              onChange={(e) => updateNestedField('clock', 'clockSectionDesc', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-200 leading-relaxed"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Live Clock Label</label>
              <input
                type="text"
                value={clock.liveClockLabel ?? 'LIVE CLOCK:'}
                onChange={(e) => updateNestedField('clock', 'liveClockLabel', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Announce Button Label</label>
              <input
                type="text"
                value={clock.pressToAnnounce ?? 'PRESS TO ANNOUNCE CURRENT TIME'}
                onChange={(e) => updateNestedField('clock', 'pressToAnnounce', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. SPATIAL DYNAMICS GALLERY */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-neutral-400" />
            <span>Spatial Dynamics Gallery ({gallery.length})</span>
          </h2>
          <p className="text-xs text-neutral-400">Hardware feature cards with interactive photo showcase.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gallery.map((item, idx) => (
            <div key={item.id || idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="font-bold text-xs uppercase text-neutral-400 block">Item #{idx + 1}</span>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => updateSlideItem('gallery', idx, 'title', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={item.desc || ''}
                    onChange={(e) => updateSlideItem('gallery', idx, 'desc', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-200 leading-relaxed"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Image</label>
                <div className="aspect-[16/10] rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800 mb-2">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => onOpenMediaPicker((newPath) => updateSlideItem('gallery', idx, 'image', newPath))}
                  className="w-full py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Change Photo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ARCHITECTURE OF SENIOR AUTONOMY (6 FEATURES) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-neutral-400" />
            <span>The Architecture of Senior Autonomy (6 Features)</span>
          </h2>
          <p className="text-xs text-neutral-400">All 6 core hardware and software capabilities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((item, idx) => (
            <div key={item.id || idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <span className="font-bold text-xs uppercase text-neutral-400 block">Feature #{idx + 1}</span>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => updateSlideItem('features', idx, 'title', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={item.desc || ''}
                  onChange={(e) => updateSlideItem('features', idx, 'desc', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-200 leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. HUMAN PILLARS (4 PILLARS) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-neutral-400" />
            <span>Designed Around Human Needs (4 Pillars)</span>
          </h2>
          <p className="text-xs text-neutral-400">Simplicity, Accessibility, Comfort, Independence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((item, idx) => (
            <div key={item.id || idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <span className="font-bold text-xs uppercase text-neutral-400 block">Pillar #{idx + 1}: {item.title}</span>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => updateSlideItem('pillars', idx, 'title', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={item.tagline || ''}
                  onChange={(e) => updateSlideItem('pillars', idx, 'tagline', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-200 font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={item.desc || ''}
                  onChange={(e) => updateSlideItem('pillars', idx, 'desc', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-300 leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. DARK PRIVACY SHOWCASE */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-neutral-400" />
            <span>Dark Privacy-First Technology Showcase</span>
          </h2>
          <p className="text-xs text-neutral-400">Headlines, background artwork photo, and 3 philosophy cards.</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Heading Line 1</label>
              <input
                type="text"
                value={privacy.headingLine1 ?? 'Your Space. Your Privacy.'}
                onChange={(e) => updateNestedField('privacy', 'headingLine1', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Heading Line 2</label>
              <input
                type="text"
                value={privacy.headingLine2 ?? 'Your Independence.'}
                onChange={(e) => updateNestedField('privacy', 'headingLine2', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Background Artwork</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-12 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800 shrink-0">
                <img src={privacy.image || 'https://res.cloudinary.com/fukpn05e/image/upload/v1795424401/uandwelabs/cms/Hands_Cradling_a_Dynamic_Heart_1795424399358.jpg'} alt="" className="w-full h-full object-cover" />
              </div>
              <input
                type="text"
                value={privacy.image || ''}
                onChange={(e) => updateNestedField('privacy', 'image', e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-300 font-mono"
              />
              <button
                type="button"
                onClick={() => onOpenMediaPicker((newPath) => updateNestedField('privacy', 'image', newPath))}
                className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold shrink-0 transition-colors cursor-pointer"
              >
                Change Photo
              </button>
            </div>
          </div>
        </div>

        {/* 3 Privacy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {privacyCards.map((card, idx) => (
            <div key={card.id || idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <span className="font-bold text-xs uppercase text-neutral-400 block">Card #{idx + 1}</span>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={card.title || ''}
                  onChange={(e) => {
                    const clone = JSON.parse(JSON.stringify(privacyCards))
                    if (!clone[idx]) clone[idx] = {}
                    clone[idx].title = e.target.value
                    updateNestedField('privacy', 'cards', clone)
                  }}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Description</label>
                <textarea
                  rows={4}
                  value={card.desc || ''}
                  onChange={(e) => {
                    const clone = JSON.parse(JSON.stringify(privacyCards))
                    if (!clone[idx]) clone[idx] = {}
                    clone[idx].desc = e.target.value
                    updateNestedField('privacy', 'cards', clone)
                  }}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-300 leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. PURPOSE STATEMENT & CLOSING CTA */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neutral-400" />
            <span>Purpose Statement & Closing Call to Action</span>
          </h2>
          <p className="text-xs text-neutral-400">Story headlines, photo, and closing consultation CTA box.</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold block">
            Purpose Statement
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Line 1</label>
              <input
                type="text"
                value={purpose.line1 ?? 'Built for Dignity.'}
                onChange={(e) => updateNestedField('purpose', 'line1', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Line 2</label>
              <input
                type="text"
                value={purpose.line2 ?? 'Designed for Independence.'}
                onChange={(e) => updateNestedField('purpose', 'line2', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Description</label>
            <textarea
              rows={3}
              value={purpose.description ?? ''}
              onChange={(e) => updateNestedField('purpose', 'description', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-200 leading-relaxed"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Story Artwork Photo</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-12 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800 shrink-0">
                <img src={purpose.image || 'https://res.cloudinary.com/fukpn05e/image/upload/v1795424401/uandwelabs/cms/Hands_Cradling_a_Dynamic_Heart_1795424399358.jpg'} alt="" className="w-full h-full object-cover" />
              </div>
              <input
                type="text"
                value={purpose.image || ''}
                onChange={(e) => updateNestedField('purpose', 'image', e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-300 font-mono"
              />
              <button
                type="button"
                onClick={() => onOpenMediaPicker((newPath) => updateNestedField('purpose', 'image', newPath))}
                className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold shrink-0 transition-colors cursor-pointer"
              >
                Change Photo
              </button>
            </div>
          </div>
        </div>

        {/* CTA Box */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold block">
            Closing Call to Action (CTA)
          </span>
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Title</label>
            <input
              type="text"
              value={cta.title ?? 'Bring Dignity to Every Room'}
              onChange={(e) => updateNestedField('cta', 'title', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Subtitle</label>
            <textarea
              rows={2}
              value={cta.subtitle ?? ''}
              onChange={(e) => updateNestedField('cta', 'subtitle', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-200 leading-relaxed"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Button Text</label>
            <input
              type="text"
              value={cta.buttonText ?? 'Request Demo'}
              onChange={(e) => updateNestedField('cta', 'buttonText', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
