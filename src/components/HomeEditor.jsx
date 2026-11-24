import { useState } from 'react'
import { Plus, Trash2, Image, Layers, Sparkles, HeartPulse, CheckCheck, Upload, Copy } from 'lucide-react'
import { DEFAULT_CMS_DATA } from '../data/defaultCms'

export default function HomeEditor({ cms, setCms, onOpenMediaPicker }) {
  const home = cms.home || {}

  const updateField = (key, val) => {
    setCms((prev) => ({
      ...prev,
      home: {
        ...prev.home,
        [key]: val,
      },
    }))
  }

  const updateNestedField = (parentKey, field, val) => {
    setCms((prev) => ({
      ...prev,
      home: {
        ...prev.home,
        [parentKey]: {
          ...prev.home?.[parentKey],
          [field]: val,
        },
      },
    }))
  }

  const updateSlideItem = (arrayKey, index, field, val) => {
    setCms((prev) => {
      const existing = (prev.home?.[arrayKey] && prev.home[arrayKey].length > 0)
        ? prev.home[arrayKey]
        : (DEFAULT_CMS_DATA.home?.[arrayKey] || [])
      const clone = JSON.parse(JSON.stringify(existing))
      if (!clone[index]) clone[index] = {}
      clone[index][field] = val
      return {
        ...prev,
        home: {
          ...prev.home,
          [arrayKey]: clone,
        },
      }
    })
  }

  const updateSlideMeta = (arrayKey, slideIdx, metaIdx, field, val) => {
    setCms((prev) => {
      const existing = (prev.home?.[arrayKey] && prev.home[arrayKey].length > 0)
        ? prev.home[arrayKey]
        : (DEFAULT_CMS_DATA.home?.[arrayKey] || [])
      const clone = JSON.parse(JSON.stringify(existing))
      if (!clone[slideIdx]) clone[slideIdx] = {}
      if (!clone[slideIdx].meta) clone[slideIdx].meta = []
      if (!clone[slideIdx].meta[metaIdx]) clone[slideIdx].meta[metaIdx] = { label: '', value: '' }
      clone[slideIdx].meta[metaIdx][field] = val
      return {
        ...prev,
        home: {
          ...prev.home,
          [arrayKey]: clone,
        },
      }
    })
  }

  const applyImageToAllSlides = (arrayKey, src) => {
    if (!src) return
    setCms((prev) => {
      const existing = (prev.home?.[arrayKey] && prev.home[arrayKey].length > 0)
        ? prev.home[arrayKey]
        : (DEFAULT_CMS_DATA.home?.[arrayKey] || [])
      const clone = JSON.parse(JSON.stringify(existing))
      clone.forEach((slide) => {
        slide.src = src
      })
      return {
        ...prev,
        home: {
          ...prev.home,
          [arrayKey]: clone,
        },
      }
    })
  }

  const pickAndApplyImageToAll = (arrayKey) => {
    if (onOpenMediaPicker) {
      onOpenMediaPicker((path) => {
        applyImageToAllSlides(arrayKey, path)
      })
    }
  }

  const updateBeliefItem = (index, field, val) => {
    setCms((prev) => {
      const clone = JSON.parse(JSON.stringify(prev.home?.beliefs?.items || []))
      if (!clone[index]) clone[index] = {}
      clone[index][field] = val
      return {
        ...prev,
        home: {
          ...prev.home,
          beliefs: {
            ...prev.home?.beliefs,
            items: clone,
          },
        },
      }
    })
  }

  const heroSlides = home.heroSlides || []
  const beliefs = home.beliefs || {}
  const beliefItems = beliefs.items || []
  const geoSpatial = home.geoSpatial || DEFAULT_CMS_DATA.home.geoSpatial || {}
  const geoSlides = (home.geoSpatialSlides && home.geoSpatialSlides.length > 0)
    ? home.geoSpatialSlides
    : (DEFAULT_CMS_DATA.home.geoSpatialSlides || [])
  const healthcare = home.healthcare || DEFAULT_CMS_DATA.home.healthcare || {}
  const healthSlides = (home.healthcareSlides && home.healthcareSlides.length > 0)
    ? home.healthcareSlides
    : (DEFAULT_CMS_DATA.home.healthcareSlides || [])

  return (
    <div className="space-y-10">
      {/* SECTION 1: HOME HERO SLIDES */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-neutral-400" />
              <span>Home Hero Carousel Slides ({heroSlides.length})</span>
            </h2>
            <p className="text-xs text-neutral-400">Headlines, taglines, sub-paragraphs, and artwork photos for the home hero.</p>
          </div>
        </div>

        <div className="space-y-6">
          {heroSlides.map((slide, idx) => (
            <div key={slide.id || idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Hero Slide #{idx + 1}: <strong className="text-white">{slide.headline || 'Untitled'}</strong>
                </span>
                <span className="text-[11px] font-mono text-neutral-500">ID: {slide.id}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={slide.category || ''}
                    onChange={(e) => updateSlideItem('heroSlides', idx, 'category', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Button CTA Text
                  </label>
                  <input
                    type="text"
                    value={slide.ctaText || ''}
                    onChange={(e) => updateSlideItem('heroSlides', idx, 'ctaText', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={slide.headline || ''}
                  onChange={(e) => updateSlideItem('heroSlides', idx, 'headline', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={slide.tagline || ''}
                  onChange={(e) => updateSlideItem('heroSlides', idx, 'tagline', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-200 font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Subtitle Paragraph
                </label>
                <textarea
                  rows={2}
                  value={slide.subtitle || ''}
                  onChange={(e) => updateSlideItem('heroSlides', idx, 'subtitle', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-200 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Hero Photo
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-12 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800 shrink-0">
                    <img src={slide.src} alt="" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={slide.src || ''}
                    onChange={(e) => {
                      updateSlideItem('heroSlides', idx, 'src', e.target.value)
                      updateSlideItem('heroSlides', idx, 'thumb', e.target.value)
                    }}
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-300 font-mono"
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

      {/* SECTION 2: WHAT WE BELIEVE IN (THE 4 PHILOSOPHY PRINCIPLES) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neutral-400" />
            <span>"What We Believe" Philosophy Principles</span>
          </h2>
          <p className="text-xs text-neutral-400">Left-side editorial headlines, intro text, and all 4 core principles.</p>
        </div>

        {/* Left Side Content */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold block">
            Left-Side Editorial Headlines
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                Headline Line 1
              </label>
              <input
                type="text"
                value={beliefs.title1 ?? 'What We'}
                onChange={(e) => updateNestedField('beliefs', 'title1', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                Headline Line 2
              </label>
              <input
                type="text"
                value={beliefs.title2 ?? 'Believe In'}
                onChange={(e) => updateNestedField('beliefs', 'title2', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-bold"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={beliefs.subtitle ?? 'Core Engineering Principles'}
              onChange={(e) => updateNestedField('beliefs', 'subtitle', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-semibold"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
              Intro Paragraph
            </label>
            <textarea
              rows={3}
              value={beliefs.intro ?? ''}
              onChange={(e) => updateNestedField('beliefs', 'intro', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-neutral-200 leading-relaxed"
            />
          </div>
        </div>

        {/* 4 Cards */}
        <div className="space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold block">
            4 Core Principles ({beliefItems.length})
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beliefItems.map((item, idx) => (
              <div key={item.id || idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">#{idx + 1}: {item.title}</span>
                  <span className="text-[10px] font-mono text-neutral-500">{item.id}</span>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Principle Title
                  </label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => updateBeliefItem(idx, 'title', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Statement
                  </label>
                  <textarea
                    rows={2}
                    value={item.statement || ''}
                    onChange={(e) => updateBeliefItem(idx, 'statement', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-200 leading-relaxed font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Elaboration
                  </label>
                  <textarea
                    rows={3}
                    value={item.elaboration || ''}
                    onChange={(e) => updateBeliefItem(idx, 'elaboration', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-300 leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: ANANDA GEOSPATIAL HOME CAROUSEL & OVERVIEW */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <span>Ananda GeoSpatial Simulation on Home ({geoSlides.length} Slides)</span>
          </h2>
          <p className="text-xs text-neutral-400">Section overview text and 3D coverflow simulation slides for Ananda on Homepage.</p>
        </div>

        {/* Ananda Section Overview */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <span className="font-bold text-xs uppercase text-neutral-400 block">Ananda Section Overview Text</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Product Title</label>
              <input
                type="text"
                value={geoSpatial.title || ''}
                onChange={(e) => updateNestedField('geoSpatial', 'title', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Category Subtitle</label>
              <input
                type="text"
                value={geoSpatial.subtitle || ''}
                onChange={(e) => updateNestedField('geoSpatial', 'subtitle', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-semibold"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Button Text</label>
              <input
                type="text"
                value={geoSpatial.buttonText || ''}
                onChange={(e) => updateNestedField('geoSpatial', 'buttonText', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-bold"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Overview Description</label>
            <textarea
              rows={2}
              value={geoSpatial.description || ''}
              onChange={(e) => updateNestedField('geoSpatial', 'description', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-300 leading-relaxed font-medium"
            />
          </div>
        </div>

        {/* Global 1-Image Action for Ananda */}
        <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-sky-200 block">Single Image Shortcut</span>
            <p className="text-[11px] text-sky-300/80">Upload or pick 1 photo once to apply across all {geoSlides.length} Ananda slides (saves Cloudinary uploads).</p>
          </div>
          <button
            type="button"
            onClick={() => pickAndApplyImageToAll('geoSpatialSlides')}
            className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
          >
            <Upload size={14} />
            <span>Set 1 Photo for All Slides</span>
          </button>
        </div>

        {/* Ananda Slide Cards */}
        <div className="space-y-4">
          {geoSlides.map((slide, idx) => (
            <div key={slide.id || idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <span className="font-bold text-xs uppercase text-neutral-400 block">Slide #{idx + 1}: {slide.title}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Title</label>
                  <input
                    type="text"
                    value={slide.title || ''}
                    onChange={(e) => updateSlideItem('geoSpatialSlides', idx, 'title', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={slide.subtitle || ''}
                    onChange={(e) => updateSlideItem('geoSpatialSlides', idx, 'subtitle', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Photo</label>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="w-16 h-10 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800 shrink-0">
                    <img src={slide.src} alt="" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={slide.src || ''}
                    onChange={(e) => updateSlideItem('geoSpatialSlides', idx, 'src', e.target.value)}
                    className="flex-1 min-w-[200px] bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-300 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => onOpenMediaPicker((p) => updateSlideItem('geoSpatialSlides', idx, 'src', p))}
                    className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-bold cursor-pointer hover:bg-neutral-200"
                  >
                    Change Photo
                  </button>
                  {slide.src && (
                    <button
                      type="button"
                      onClick={() => applyImageToAllSlides('geoSpatialSlides', slide.src)}
                      title="Apply this photo to all slides (saves Cloudinary storage)"
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Copy size={12} />
                      <span>Apply to All Slides</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Image Down Content (Specs / Metrics) */}
              <div className="pt-2 border-t border-neutral-800/80">
                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-2">
                  Image Down Content (3 Specs/Metrics):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(slide.meta || []).map((m, mIdx) => (
                    <div key={mIdx} className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
                      <div>
                        <label className="text-[9px] uppercase font-bold text-neutral-500 block">Metric Label</label>
                        <input
                          type="text"
                          value={m.label || ''}
                          onChange={(e) => updateSlideMeta('geoSpatialSlides', idx, mIdx, 'label', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold text-neutral-500 block">Metric Value</label>
                        <input
                          type="text"
                          value={m.value || ''}
                          onChange={(e) => updateSlideMeta('geoSpatialSlides', idx, mIdx, 'value', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-1.5 text-xs text-white font-bold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: DARA HEALTHCARE HOME CAROUSEL & OVERVIEW */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-400" />
            <span>Dara Healthcare Carousel on Home ({healthSlides.length} Slides)</span>
          </h2>
          <p className="text-xs text-neutral-400">Overview text and 3D coverflow carousel slides for Dara assistive senior device on Homepage.</p>
        </div>

        {/* Healthcare Section Overview */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <span className="font-bold text-xs uppercase text-neutral-400 block">Dara Section Overview Text</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Product Title</label>
              <input
                type="text"
                value={healthcare.title || ''}
                onChange={(e) => updateNestedField('healthcare', 'title', e.target.value)}
                placeholder="Dara"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Category Subtitle</label>
              <input
                type="text"
                value={healthcare.subtitle || ''}
                onChange={(e) => updateNestedField('healthcare', 'subtitle', e.target.value)}
                placeholder="Healthcare"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-semibold"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Button Text</label>
              <input
                type="text"
                value={healthcare.buttonText || ''}
                onChange={(e) => updateNestedField('healthcare', 'buttonText', e.target.value)}
                placeholder="EXPLORE DARA"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-bold"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Overview Description</label>
            <textarea
              rows={2}
              value={healthcare.description || ''}
              onChange={(e) => updateNestedField('healthcare', 'description', e.target.value)}
              placeholder="Smart assistive device for seniors..."
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-300 leading-relaxed font-medium"
            />
          </div>
        </div>

        {/* Global 1-Image Action for Healthcare (Cloudinary optimizer) */}
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-emerald-200 block">Single Image for All 3 Slides</span>
            <p className="text-[11px] text-emerald-300/80">
              Upload or pick 1 photo once from PC — it uploads to Cloudinary only 1 time and applies to all 3 slide cards automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={() => pickAndApplyImageToAll('healthcareSlides')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
          >
            <Upload size={14} />
            <span>Set 1 Photo for All 3 Slides</span>
          </button>
        </div>

        {/* Healthcare Slide Cards */}
        <div className="space-y-4">
          {healthSlides.map((slide, idx) => (
            <div key={slide.id || idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <span className="font-bold text-xs uppercase text-neutral-400 block">Slide #{idx + 1}: {slide.title}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Title</label>
                  <input
                    type="text"
                    value={slide.title || ''}
                    onChange={(e) => updateSlideItem('healthcareSlides', idx, 'title', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={slide.subtitle || ''}
                    onChange={(e) => updateSlideItem('healthcareSlides', idx, 'subtitle', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Photo</label>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="w-16 h-10 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800 shrink-0">
                    <img src={slide.src} alt="" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={slide.src || ''}
                    onChange={(e) => updateSlideItem('healthcareSlides', idx, 'src', e.target.value)}
                    className="flex-1 min-w-[200px] bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-neutral-300 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => onOpenMediaPicker((p) => updateSlideItem('healthcareSlides', idx, 'src', p))}
                    className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-bold cursor-pointer hover:bg-neutral-200"
                  >
                    Change Photo
                  </button>
                  {slide.src && (
                    <button
                      type="button"
                      onClick={() => applyImageToAllSlides('healthcareSlides', slide.src)}
                      title="Apply this single photo to all 3 slides (prevents multiple Cloudinary uploads)"
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Copy size={12} />
                      <span>Apply to All 3 Slides</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Image Down Content (Specs / Metrics) */}
              <div className="pt-2 border-t border-neutral-800/80">
                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-2">
                  Image Down Content (3 Specs/Metrics):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(slide.meta || []).map((m, mIdx) => (
                    <div key={mIdx} className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
                      <div>
                        <label className="text-[9px] uppercase font-bold text-neutral-500 block">Metric Label</label>
                        <input
                          type="text"
                          value={m.label || ''}
                          onChange={(e) => updateSlideMeta('healthcareSlides', idx, mIdx, 'label', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold text-neutral-500 block">Metric Value</label>
                        <input
                          type="text"
                          value={m.value || ''}
                          onChange={(e) => updateSlideMeta('healthcareSlides', idx, mIdx, 'value', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-1.5 text-xs text-white font-bold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
