import { useState } from 'react'
import { Layers, Wind, Users, Grid, Sparkles, Image } from 'lucide-react'

export default function AnandaEditor({ cms, setCms, onOpenMediaPicker }) {
  const ananda = cms.ananda || {}

  const updateRootField = (field, val) => {
    setCms((prev) => ({
      ...prev,
      ananda: {
        ...prev.ananda,
        [field]: val,
      },
    }))
  }

  const updateNestedField = (parentKey, field, val) => {
    setCms((prev) => ({
      ...prev,
      ananda: {
        ...prev.ananda,
        [parentKey]: {
          ...prev.ananda?.[parentKey],
          [field]: val,
        },
      },
    }))
  }

  const updateArrayItem = (arrayKey, index, field, val) => {
    setCms((prev) => {
      const clone = JSON.parse(JSON.stringify(prev.ananda?.[arrayKey] || []))
      if (!clone[index]) clone[index] = {}
      clone[index][field] = val
      return {
        ...prev,
        ananda: {
          ...prev.ananda,
          [arrayKey]: clone,
        },
      }
    })
  }

  const heroSlides = ananda.heroSlides || []
  const features = ananda.features || []
  const testimonials = ananda.testimonials || []
  const mosaicStudies = ananda.mosaicStudies || []
  const cta = ananda.cta || {}

  return (
    <div className="space-y-10">
      {/* 1. HERO CAROUSEL */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-neutral-400" />
            <span>Ananda GeoSpatial Simulation Hero Slides ({heroSlides.length})</span>
          </h2>
          <p className="text-xs text-neutral-400">Atmospheric simulation, windflow, and biophilic hydrology hero slides.</p>
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
                    updateArrayItem('heroSlides', idx, 'headline', e.target.value)
                    updateArrayItem('heroSlides', idx, 'title', e.target.value)
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
                    updateArrayItem('heroSlides', idx, 'subtitle', e.target.value)
                    updateArrayItem('heroSlides', idx, 'desc', e.target.value)
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
                      updateArrayItem('heroSlides', idx, 'src', e.target.value)
                      updateArrayItem('heroSlides', idx, 'thumb', e.target.value)
                    }}
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-300 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onOpenMediaPicker((newPath) => {
                        updateArrayItem('heroSlides', idx, 'src', newPath)
                        updateArrayItem('heroSlides', idx, 'thumb', newPath)
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

      {/* 2. CORE SIMULATION CAPABILITIES (6 FEATURES) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wind className="w-5 h-5 text-neutral-400" />
            <span>The Architecture of Innovation (6 Core Capabilities)</span>
          </h2>
          <p className="text-xs text-neutral-400">Solar ray-casting, LBM aerodynamic solver, 2D Saint-Venant flood modeling, BIM/LiDAR ingestion.</p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
          <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Section Title</label>
          <input
            type="text"
            value={ananda.coreTitle ?? 'The Architecture of Innovation'}
            onChange={(e) => updateRootField('coreTitle', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((item, idx) => (
            <div key={item.id || idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <span className="font-bold text-xs uppercase text-neutral-400 block">Capability #{idx + 1}</span>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => updateArrayItem('features', idx, 'title', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={item.desc || ''}
                  onChange={(e) => updateArrayItem('features', idx, 'desc', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-200 leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ARCHITECT PERSPECTIVES (3 TESTIMONIALS) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-neutral-400" />
            <span>Architect & Engineering Perspectives ({testimonials.length})</span>
          </h2>
          <p className="text-xs text-neutral-400">Quotes and reviews from lead environmental architects and engineers.</p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
          <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Section Headline</label>
          <input
            type="text"
            value={ananda.perspectivesTitle ?? 'Architect & Engineering Perspectives'}
            onChange={(e) => updateRootField('perspectivesTitle', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((item, idx) => (
            <div key={item.id || idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="font-bold text-xs uppercase text-neutral-400 block">Perspective #{idx + 1}</span>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Name</label>
                  <input
                    type="text"
                    value={item.name || ''}
                    onChange={(e) => updateArrayItem('testimonials', idx, 'name', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Role</label>
                  <input
                    type="text"
                    value={item.role || ''}
                    onChange={(e) => updateArrayItem('testimonials', idx, 'role', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-200 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Studio / Agency</label>
                  <input
                    type="text"
                    value={item.studio || ''}
                    onChange={(e) => updateArrayItem('testimonials', idx, 'studio', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-200 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Quote</label>
                  <textarea
                    rows={4}
                    value={item.quote || ''}
                    onChange={(e) => updateArrayItem('testimonials', idx, 'quote', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-300 leading-relaxed italic"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Avatar Photo</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-700 bg-neutral-800 shrink-0">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenMediaPicker((newPath) => updateArrayItem('testimonials', idx, 'image', newPath))}
                    className="flex-1 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. BUILT ON ANANDA (8 MOSAIC CASE STUDIES) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-neutral-400" />
            <span>Built on Ananda Mosaic Case Studies ({mosaicStudies.length})</span>
          </h2>
          <p className="text-xs text-neutral-400">All 8 projects: hydro-morphology, aerodynamic envelope, mesoscale CFD, villa daylighting, etc.</p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
          <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Section Title</label>
          <input
            type="text"
            value={ananda.caseStudiesTitle ?? 'Built on Ananda'}
            onChange={(e) => updateRootField('caseStudiesTitle', e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mosaicStudies.map((study, idx) => (
            <div key={study.id || idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="font-bold text-xs uppercase text-neutral-400 block">Project #{idx + 1}</span>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Title</label>
                  <input
                    type="text"
                    value={study.title || ''}
                    onChange={(e) => updateArrayItem('mosaicStudies', idx, 'title', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={study.desc || ''}
                    onChange={(e) => updateArrayItem('mosaicStudies', idx, 'desc', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-200 leading-relaxed"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Project Photo</label>
                <div className="aspect-[16/10] rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800 mb-2">
                  <img src={study.image} alt="" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => onOpenMediaPicker((newPath) => updateArrayItem('mosaicStudies', idx, 'image', newPath))}
                  className="w-full py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Change Photo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SIMULATION CONSULTATION CALL TO ACTION */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neutral-400" />
            <span>Simulation Consultation Call to Action (CTA)</span>
          </h2>
          <p className="text-xs text-neutral-400">Headline, sub-description, and action button text.</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">CTA Headline</label>
            <input
              type="text"
              value={cta.title ?? 'Ready to shape the future?'}
              onChange={(e) => updateNestedField('cta', 'title', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">CTA Subtitle / Description</label>
            <textarea
              rows={3}
              value={cta.desc ?? ''}
              onChange={(e) => updateNestedField('cta', 'desc', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-200 leading-relaxed"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Button Text</label>
            <input
              type="text"
              value={cta.buttonText ?? 'Schedule Simulation Consultation'}
              onChange={(e) => updateNestedField('cta', 'buttonText', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
