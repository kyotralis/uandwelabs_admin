import { useState } from 'react'
import { Layers, Image, Shield, Lock, Sparkles, Cpu } from 'lucide-react'

export default function AuraEditor({ cms, setCms, onOpenMediaPicker }) {
  const aura = cms.aura || {}

  const updateNestedField = (parentKey, field, val) => {
    setCms((prev) => ({
      ...prev,
      aura: {
        ...prev.aura,
        [parentKey]: {
          ...prev.aura?.[parentKey],
          [field]: val,
        },
      },
    }))
  }

  const updateSlideItem = (arrayKey, index, field, val) => {
    setCms((prev) => {
      const clone = JSON.parse(JSON.stringify(prev.aura?.[arrayKey] || []))
      if (!clone[index]) clone[index] = {}
      clone[index][field] = val
      return {
        ...prev,
        aura: {
          ...prev.aura,
          [arrayKey]: clone,
        },
      }
    })
  }

  const heroSlides = aura.heroSlides || []
  const gallery = aura.gallery || []
  const features = aura.features || []
  const pillars = aura.pillars || []
  const security = aura.security || {}
  const securityCards = security.cards || []
  const purpose = aura.purpose || {}
  const cta = aura.cta || {}

  return (
    <div className="space-y-10">
      {/* 1. HERO CAROUSEL */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-neutral-400" />
            <span>Aura Product Hero Slides ({heroSlides.length})</span>
          </h2>
          <p className="text-xs text-neutral-400">Headlines, taglines, sub-paragraphs, and artwork photos for Aura Hero.</p>
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

      {/* 2. HARDWARE SHOWCASE GALLERY */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-neutral-400" />
            <span>Hardware Showcase Gallery ({gallery.length})</span>
          </h2>
          <p className="text-xs text-neutral-400">Ladybug sensor node, multilane LPR, and perimeter mesh hardware cards.</p>
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

      {/* 3. AUTONOMOUS EDGE SILICON (6 FEATURES) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-neutral-400" />
            <span>The Architecture of Autonomous Edge Silicon (6 Features)</span>
          </h2>
          <p className="text-xs text-neutral-400">128-TOPS NPU, 350M mesh, sub-millisecond relays, FIPS 140-2 cryptography.</p>
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

      {/* 4. CRITICAL MISSIONS (4 PILLARS) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-neutral-400" />
            <span>Designed Around Critical Missions (4 Pillars)</span>
          </h2>
          <p className="text-xs text-neutral-400">Speed, Precision, Resilience, Sovereignty.</p>
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

      {/* 5. AIR-GAPPED SECURITY DARK SHOWCASE */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-neutral-400" />
            <span>Air-Gapped Security Dark Showcase</span>
          </h2>
          <p className="text-xs text-neutral-400">Headlines, background artwork photo, and 3 sovereignty cards.</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Heading Line 1</label>
              <input
                type="text"
                value={security.headingLine1 ?? 'Zero Cloud Reliance.'}
                onChange={(e) => updateNestedField('security', 'headingLine1', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Heading Line 2</label>
              <input
                type="text"
                value={security.headingLine2 ?? 'Absolute Sovereignty.'}
                onChange={(e) => updateNestedField('security', 'headingLine2', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Background Artwork</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-12 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800 shrink-0">
                <img src={security.image || '/hero_aura_highway_lpr.jpg'} alt="" className="w-full h-full object-cover" />
              </div>
              <input
                type="text"
                value={security.image || ''}
                onChange={(e) => updateNestedField('security', 'image', e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-300 font-mono"
              />
              <button
                type="button"
                onClick={() => onOpenMediaPicker((newPath) => updateNestedField('security', 'image', newPath))}
                className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold shrink-0 transition-colors cursor-pointer"
              >
                Change Photo
              </button>
            </div>
          </div>
        </div>

        {/* 3 Sovereignty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {securityCards.map((card, idx) => (
            <div key={card.id || idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <span className="font-bold text-xs uppercase text-neutral-400 block">Card #{idx + 1}</span>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={card.title || ''}
                  onChange={(e) => {
                    const clone = JSON.parse(JSON.stringify(securityCards))
                    if (!clone[idx]) clone[idx] = {}
                    clone[idx].title = e.target.value
                    updateNestedField('security', 'cards', clone)
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
                    const clone = JSON.parse(JSON.stringify(securityCards))
                    if (!clone[idx]) clone[idx] = {}
                    clone[idx].desc = e.target.value
                    updateNestedField('security', 'cards', clone)
                  }}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-300 leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. PURPOSE STATEMENT & CLOSING CTA */}
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
                value={purpose.line1 ?? 'Built for Reliability.'}
                onChange={(e) => updateNestedField('purpose', 'line1', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Line 2</label>
              <input
                type="text"
                value={purpose.line2 ?? 'Engineered for the Edge.'}
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
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Artwork Photo</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-12 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800 shrink-0">
                <img src={purpose.image || '/aura_biomimetic_node.jpg'} alt="" className="w-full h-full object-cover" />
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
              value={cta.title ?? 'Deploy Edge Silicon on Your Perimeter'}
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
              value={cta.buttonText ?? 'Request Technical Pilot'}
              onChange={(e) => updateNestedField('cta', 'buttonText', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
