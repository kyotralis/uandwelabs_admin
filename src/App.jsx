import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Save,
  Lock,
  X,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Copy,
  LogOut,
  RefreshCw,
} from 'lucide-react'
import { fetchCms, saveCms, uploadMedia, DEFAULT_CMS_DATA, getCachedCms } from './services/api'
import { ToastContainer, showToast } from './components/Toast'

// ==========================================
// SECTION FIELD DEFINITIONS
// Maps section.field → list of editable fields
// ==========================================
const SECTION_FIELDS = {
  // HOME PAGE
  'home.heroSlides': {
    type: 'array',
    itemFields: [
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'category', label: 'Category Tag', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'ctaText', label: 'Button Text', type: 'text' },
      { key: 'src', label: 'Background Image', type: 'image' },
      { key: 'alt', label: 'Image Alt Text', type: 'text' },
    ],
  },
  'home.beliefs': {
    type: 'object',
    objectFields: [
      { key: 'title1', label: 'Headline Line 1 (e.g. WHAT WE)', type: 'text' },
      { key: 'title2', label: 'Headline Line 2 (e.g. BELIEVE IN)', type: 'text' },
      { key: 'subtitle', label: 'Sub-headline (e.g. CORE ENGINEERING PRINCIPLES)', type: 'text' },
      { key: 'intro', label: 'Introductory Statement', type: 'textarea' },
    ],
    arrayKey: 'items',
    itemFields: [
      { key: 'title', label: 'Principle Title', type: 'text' },
      { key: 'statement', label: 'Statement', type: 'textarea' },
      { key: 'elaboration', label: 'Elaboration', type: 'textarea' },
    ],
  },
  'home.geoSpatial': {
    type: 'object',
    objectFields: [
      { key: 'title', label: 'Product Title', type: 'text' },
      { key: 'subtitle', label: 'Category Subtitle', type: 'text' },
      { key: 'description', label: 'Overview Description', type: 'textarea' },
      { key: 'buttonText', label: 'CTA Button Text', type: 'text' },
    ],
  },
  'home.geoSpatialSlides': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'src', label: 'Image', type: 'image' },
      { key: 'alt', label: 'Alt Text', type: 'text' },
    ],
    metaFields: true,
  },
  'home.healthcare': {
    type: 'object',
    objectFields: [
      { key: 'title', label: 'Product Title', type: 'text' },
      { key: 'subtitle', label: 'Category Subtitle', type: 'text' },
      { key: 'description', label: 'Overview Description', type: 'textarea' },
      { key: 'buttonText', label: 'CTA Button Text', type: 'text' },
    ],
  },
  'home.healthcareSlides': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'src', label: 'Image', type: 'image' },
      { key: 'alt', label: 'Alt Text', type: 'text' },
    ],
    metaFields: true,
  },

  // DARA PAGE
  'dara.heroSlides': {
    type: 'array',
    itemFields: [
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'ctaText', label: 'Button Text', type: 'text' },
      { key: 'src', label: 'Background Image', type: 'image' },
      { key: 'alt', label: 'Alt Text', type: 'text' },
    ],
  },
  'dara.clock': {
    type: 'object',
    objectFields: [
      { key: 'clockSectionTitle', label: 'Section Title', type: 'text' },
      { key: 'clockSectionDesc', label: 'Description', type: 'textarea' },
      { key: 'liveClockLabel', label: 'Clock Label', type: 'text' },
      { key: 'pressToAnnounce', label: 'Announce Button Text', type: 'text' },
    ],
  },
  'dara.gallery': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
  },
  'dara.features': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Feature Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
  'dara.pillars': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Pillar Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
  'dara.privacy': {
    type: 'object',
    objectFields: [
      { key: 'headingLine1', label: 'Heading Line 1', type: 'text' },
      { key: 'headingLine2', label: 'Heading Line 2', type: 'text' },
      { key: 'image', label: 'Background Image', type: 'image' },
    ],
    arrayKey: 'cards',
    itemFields: [
      { key: 'title', label: 'Card Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
  'dara.purpose': {
    type: 'object',
    objectFields: [
      { key: 'line1', label: 'Line 1', type: 'text' },
      { key: 'line2', label: 'Line 2', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Background Image', type: 'image' },
    ],
  },
  'dara.cta': {
    type: 'object',
    objectFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
    ],
  },

  // AURA PAGE
  'aura.heroSlides': {
    type: 'array',
    itemFields: [
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'ctaText', label: 'Button Text', type: 'text' },
      { key: 'src', label: 'Background Image', type: 'image' },
      { key: 'alt', label: 'Alt Text', type: 'text' },
    ],
  },
  'aura.board': {
    type: 'object',
    objectFields: [
      { key: 'title', label: 'Product Title', type: 'text' },
      { key: 'subtitle', label: 'Category Subtitle', type: 'text' },
      { key: 'description', label: 'Overview Description', type: 'textarea' },
      { key: 'buttonText', label: 'CTA Button Text', type: 'text' },
    ],
  },
  'home.board': {
    type: 'object',
    objectFields: [
      { key: 'title', label: 'Product Title', type: 'text' },
      { key: 'subtitle', label: 'Category Subtitle', type: 'text' },
      { key: 'description', label: 'Overview Description', type: 'textarea' },
      { key: 'buttonText', label: 'CTA Button Text', type: 'text' },
    ],
  },
  'aura.boardSlides': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'src', label: 'Image', type: 'image' },
      { key: 'alt', label: 'Alt Text', type: 'text' },
    ],
  },
  'aura.gallery': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
  },
  'aura.features': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Feature Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
  'aura.pillars': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Pillar Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
  'aura.security': {
    type: 'object',
    objectFields: [
      { key: 'headingLine1', label: 'Heading Line 1', type: 'text' },
      { key: 'headingLine2', label: 'Heading Line 2', type: 'text' },
      { key: 'image', label: 'Background Image', type: 'image' },
    ],
    arrayKey: 'cards',
    itemFields: [
      { key: 'title', label: 'Card Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
  'aura.purpose': {
    type: 'object',
    objectFields: [
      { key: 'line1', label: 'Line 1', type: 'text' },
      { key: 'line2', label: 'Line 2', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Background Image', type: 'image' },
    ],
  },
  'aura.cta': {
    type: 'object',
    objectFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
    ],
  },

  // ANANDA PAGE
  'ananda.heroSlides': {
    type: 'array',
    itemFields: [
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'ctaText', label: 'Button Text', type: 'text' },
      { key: 'src', label: 'Background Image', type: 'image' },
      { key: 'alt', label: 'Alt Text', type: 'text' },
    ],
  },
  'ananda.features': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Capability Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
  'ananda.capabilities': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Capability Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
  'ananda.testimonials': {
    type: 'array',
    itemFields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role / Title', type: 'text' },
      { key: 'studio', label: 'Practice / Studio', type: 'text' },
      { key: 'quote', label: 'Testimonial Quote', type: 'textarea' },
      { key: 'image', label: 'Avatar Image', type: 'image' },
    ],
  },
  'ananda.mosaicStudies': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Project Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Project Image', type: 'image' },
    ],
  },
  'ananda.caseStudies': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Project Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Project Image', type: 'image' },
    ],
  },
  'ananda.cta': {
    type: 'object',
    objectFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
    ],
  },

  // BLOGS PAGE
  'blogs.items': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Article Title', type: 'text' },
      { key: 'categoryLabel', label: 'Category Tag', type: 'text' },
      { key: 'date', label: 'Publish Date', type: 'text' },
      { key: 'readTime', label: 'Read Time', type: 'text' },
      { key: 'desc', label: 'Summary', type: 'textarea' },
      { key: 'image', label: 'Cover Image', type: 'image' },
    ],
  },
  'blogs.blogs': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Article Title', type: 'text' },
      { key: 'categoryLabel', label: 'Category Tag', type: 'text' },
      { key: 'date', label: 'Publish Date', type: 'text' },
      { key: 'readTime', label: 'Read Time', type: 'text' },
      { key: 'desc', label: 'Summary', type: 'textarea' },
      { key: 'image', label: 'Cover Image', type: 'image' },
    ],
  },

  // ABOUT US PAGE
  'about.hero': {
    type: 'object',
    objectFields: [
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'image', label: 'Hero Background Image', type: 'image' },
    ],
  },
  'about.mission': {
    type: 'object',
    objectFields: [
      { key: 'title', label: 'Mission Title', type: 'text' },
      { key: 'statement', label: 'Mission Statement', type: 'textarea' },
      { key: 'elaboration', label: 'Mission Elaboration', type: 'textarea' },
    ],
  },
  'about.studioStories': {
    type: 'array',
    itemFields: [
      { key: 'num', label: 'Story Number (e.g. 01)', type: 'text' },
      { key: 'tag', label: 'Tag (e.g. THE MAKER SPIRIT)', type: 'text' },
      { key: 'title', label: 'Story Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Story Image', type: 'image' },
    ],
  },
  'about.lifecycleSteps': {
    type: 'array',
    itemFields: [
      { key: 'num', label: 'Step Number', type: 'text' },
      { key: 'title', label: 'Step Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
  'about.perspectives': {
    type: 'array',
    itemFields: [
      { key: 'quote', label: 'Quote', type: 'textarea' },
      { key: 'name', label: 'Person Name', type: 'text' },
      { key: 'role', label: 'Role / Designation', type: 'text' },
      { key: 'org', label: 'Organization', type: 'text' },
      { key: 'image', label: 'Avatar / Photo', type: 'image' },
    ],
  },
  'about.cta': {
    type: 'object',
    objectFields: [
      { key: 'title', label: 'Headline / Title', type: 'text' },
      { key: 'subtitle', label: 'Description', type: 'textarea' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
    ],
  },

  // CAREERS PAGE
  'careers.hero': {
    type: 'object',
    objectFields: [
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'image', label: 'Hero Background Image', type: 'image' },
    ],
  },
  'careers.convictions': {
    type: 'array',
    itemFields: [
      { key: 'num', label: 'Principle Number', type: 'text' },
      { key: 'title', label: 'Principle Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
  'careers.lifeBenches': {
    type: 'array',
    itemFields: [
      { key: 'tag', label: 'Tag (e.g. THE MAKER SPIRIT)', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Bench Photo', type: 'image' },
    ],
  },
  'careers.items': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Position Title', type: 'text' },
      { key: 'division', label: 'Division / Team', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'type', label: 'Employment Type', type: 'text' },
      { key: 'experience', label: 'Experience Level', type: 'text' },
      { key: 'desc', label: 'Role Overview', type: 'textarea' },
    ],
  },
  'careers.careers': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Position Title', type: 'text' },
      { key: 'division', label: 'Division / Team', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'type', label: 'Employment Type', type: 'text' },
      { key: 'experience', label: 'Experience Level', type: 'text' },
      { key: 'desc', label: 'Role Overview', type: 'textarea' },
    ],
  },
  'careers.benefits': {
    type: 'array',
    itemFields: [
      { key: 'title', label: 'Benefit Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
    ],
  },
  'careers.cta': {
    type: 'object',
    objectFields: [
      { key: 'title', label: 'Headline / Title', type: 'text' },
      { key: 'subtitle', label: 'Description', type: 'textarea' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
    ],
  },

  // PRIVACY POLICY PAGE
  'privacyPolicy.hero': {
    type: 'object',
    objectFields: [
      { key: 'titleLine1', label: 'Title Line 1', type: 'text' },
      { key: 'titleLine2', label: 'Title Line 2 (Highlight)', type: 'text' },
      { key: 'intro', label: 'Introductory Statement', type: 'textarea' },
    ],
  },
  'privacyPolicy.sections': {
    type: 'array',
    itemFields: [
      { key: 'num', label: 'Section Badge (e.g. Section 01)', type: 'text' },
      { key: 'label', label: 'Navigation Label (e.g. 1. Privacy by Architecture)', type: 'text' },
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'content', label: 'Policy Content (paragraphs)', type: 'textarea' },
      { key: 'bulletPoints', label: 'Clauses / Bullet Points (one per line)', type: 'textarea' },
      { key: 'contactEmail', label: 'Contact / DPO Email (optional)', type: 'text' },
    ],
  },

  // TERMS OF SERVICE PAGE
  'termsOfService.hero': {
    type: 'object',
    objectFields: [
      { key: 'titleLine1', label: 'Title Line 1', type: 'text' },
      { key: 'titleLine2', label: 'Title Line 2 (Highlight)', type: 'text' },
      { key: 'intro', label: 'Introductory Statement', type: 'textarea' },
    ],
  },
  'termsOfService.articles': {
    type: 'array',
    itemFields: [
      { key: 'badge', label: 'Article Badge (e.g. Article 01)', type: 'text' },
      { key: 'tag', label: 'Scope Tag (e.g. Preamble & Scope)', type: 'text' },
      { key: 'label', label: 'Navigation Label (e.g. 1. Preamble & Master Agreement)', type: 'text' },
      { key: 'title', label: 'Article Title', type: 'text' },
      { key: 'content', label: 'Article Content (paragraphs)', type: 'textarea' },
      { key: 'bulletPoints', label: 'Sub-clauses / Bullet Points (one per line)', type: 'textarea' },
      { key: 'contactEmail', label: 'Legal Contact Email (optional)', type: 'text' },
      { key: 'securityEmail', label: 'Security & Incident Desk Email (optional)', type: 'text' },
    ],
  },

  // SETTINGS & WEBSITE HEADER
  'settings.header': {
    type: 'object',
    objectFields: [
      { key: 'logo', label: 'Brand Logo Image', type: 'image' },
      { key: 'companyName', label: 'Company / Brand Name', type: 'text' },
      { key: 'regionText', label: 'Region / Country Label', type: 'text' },
      { key: 'signInText', label: 'Sign In Button Text', type: 'text' },
      { key: 'navProducts', label: 'Navigation: Products', type: 'text' },
      { key: 'navBlogs', label: 'Navigation: Blogs', type: 'text' },
      { key: 'navAbout', label: 'Navigation: About Us', type: 'text' },
      { key: 'navCareers', label: 'Navigation: Careers', type: 'text' },
    ],
  },
  // SETTINGS & WEBSITE FOOTER
  'settings.footer': {
    type: 'object',
    objectFields: [
      { key: 'logo', label: 'Footer Logo Image', type: 'image' },
      { key: 'companyName', label: 'Company / Brand Name', type: 'text' },
      { key: 'footerTagline', label: 'Footer Tagline / Bio', type: 'textarea' },
      { key: 'copyrightText', label: 'Copyright Notice', type: 'text' },
      { key: 'twitter', label: 'Twitter (X) URL', type: 'text' },
      { key: 'linkedin', label: 'LinkedIn Page URL', type: 'text' },
      { key: 'github', label: 'GitHub URL', type: 'text' },
      { key: 'contactEmail', label: 'Contact Email', type: 'text' },
      { key: 'contactPhone', label: 'Contact Phone', type: 'text' },
      { key: 'officeAddress', label: 'Office Address', type: 'textarea' },
    ],
  },
  'settings.commonCta': {
    type: 'object',
    objectFields: [
      { key: 'title', label: 'Default CTA Title', type: 'text' },
      { key: 'subtitle', label: 'Default CTA Description', type: 'textarea' },
      { key: 'buttonText', label: 'Default CTA Button Text', type: 'text' },
    ],
  },
  'privacyPolicy.contact': {
    type: 'object',
    objectFields: [
      { key: 'label', label: 'Direct Inquiry Box Heading', type: 'text' },
      { key: 'contactEmail', label: 'Direct Inquiry Email', type: 'text' },
    ],
  },
  'termsOfService.contact': {
    type: 'object',
    objectFields: [
      { key: 'label', label: 'Compliance Desk Heading', type: 'text' },
      { key: 'deskDescription', label: 'Desk Description', type: 'textarea' },
      { key: 'contactEmail', label: 'Compliance Desk Email', type: 'text' },
    ],
  },
}

// ==========================================
// IMAGE FIELD COMPONENT
// ==========================================
function ImageField({ value, onChange, label, frontendBaseUrl = '', onApplyToAll = null }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadMedia(file, value)
      if (res.success) {
        onChange(res.path)
        showToast(`Uploaded: ${res.filename}`, 'success')
      }
    } catch (err) {
      showToast(`Upload failed: ${err.message}`, 'error')
    }
    setUploading(false)
  }

  const imageSrc = value
    ? (value.startsWith('/') ? `${frontendBaseUrl}${value}` : value)
    : ''

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{label}</label>
        {onApplyToAll && value && (
          <button
            type="button"
            onClick={onApplyToAll}
            title="Use this single uploaded photo for all slides in this carousel (saves Cloudinary uploads)"
            className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer underline transition-colors"
          >
            <Copy size={12} />
            <span>Apply to all slides</span>
          </button>
        )}
      </div>
      {value && (
        <div className="w-full h-32 rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700 relative">
          <img
            src={imageSrc}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              if (value.startsWith('/') && !e.currentTarget.dataset.fallbackTried) {
                e.currentTarget.dataset.fallbackTried = 'true'
                e.currentTarget.src = value
              }
            }}
          />
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/image-path.jpg"
          className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:border-white focus:outline-none"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded-lg text-xs text-white flex items-center gap-1 cursor-pointer"
        >
          <Upload size={14} />
          {uploading ? '...' : 'Upload'}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
    </div>
  )
}

// ==========================================
// SECTION COMPANIONS (Tabs for paired sections)
// ==========================================
const SECTION_COMPANIONS = {
  'home.geoSpatial': {
    targetSection: 'home',
    targetField: 'geoSpatialSlides',
    targetLabel: 'GeoSpatial Simulation Slides',
    currentTab: 'Overview Text',
    targetTab: 'Carousel Slides',
  },
  'home.geoSpatialSlides': {
    targetSection: 'home',
    targetField: 'geoSpatial',
    targetLabel: 'Ananda Overview',
    currentTab: 'Carousel Slides',
    targetTab: 'Overview Text',
  },
  'home.healthcare': {
    targetSection: 'home',
    targetField: 'healthcareSlides',
    targetLabel: 'Dara Showcase Slides',
    currentTab: 'Overview Text',
    targetTab: 'Carousel Slides',
  },
  'home.healthcareSlides': {
    targetSection: 'home',
    targetField: 'healthcare',
    targetLabel: 'Dara Overview',
    currentTab: 'Carousel Slides',
    targetTab: 'Overview Text',
  },
  'aura.board': {
    targetSection: 'aura',
    targetField: 'boardSlides',
    targetLabel: 'Aura Board Slides',
    currentTab: 'Overview Text',
    targetTab: 'Carousel Slides',
  },
  'aura.boardSlides': {
    targetSection: 'aura',
    targetField: 'board',
    targetLabel: 'Aura Overview',
    currentTab: 'Carousel Slides',
    targetTab: 'Overview Text',
  },
  'home.board': {
    targetSection: 'aura',
    targetField: 'boardSlides',
    targetLabel: 'Aura Board Slides',
    currentTab: 'Overview Text',
    targetTab: 'Carousel Slides',
  },
  'privacyPolicy.hero': {
    targetSection: 'privacyPolicy',
    targetField: 'sections',
    targetLabel: 'Policy Clauses & Sections',
    currentTab: 'Hero Header',
    targetTab: 'Policy Clauses',
  },
  'privacyPolicy.sections': {
    targetSection: 'privacyPolicy',
    targetField: 'hero',
    targetLabel: 'Privacy Hero Header',
    currentTab: 'Policy Clauses',
    targetTab: 'Hero Header',
  },
  'termsOfService.hero': {
    targetSection: 'termsOfService',
    targetField: 'articles',
    targetLabel: 'Terms Articles & Clauses',
    currentTab: 'Hero Header',
    targetTab: 'Articles & Clauses',
  },
  'termsOfService.articles': {
    targetSection: 'termsOfService',
    targetField: 'hero',
    targetLabel: 'Terms Hero Header',
    currentTab: 'Articles & Clauses',
    targetTab: 'Hero Header',
  },
  'settings.header': {
    targetSection: 'settings',
    targetField: 'footer',
    targetLabel: 'Website Footer',
    currentTab: 'Website Header',
    targetTab: 'Website Footer',
  },
  'settings.footer': {
    targetSection: 'settings',
    targetField: 'header',
    targetLabel: 'Website Header',
    currentTab: 'Website Footer',
    targetTab: 'Website Header',
  },
}

// ==========================================
// SECTION EDITOR MODAL
// ==========================================
function SectionEditorModal({ isOpen, onClose, section, field, label, cms, onUpdate, onSwitchSection, frontendBaseUrl = '' }) {
  const defKey = `${section}.${field}`
  const companion = SECTION_COMPANIONS[defKey]
  let def = SECTION_FIELDS[defKey] ||
    (field === 'capabilities' ? SECTION_FIELDS['ananda.features'] : null) ||
    (field === 'caseStudies' ? SECTION_FIELDS['ananda.mosaicStudies'] : null) ||
    (section === 'blogs' ? SECTION_FIELDS['blogs.items'] : null) ||
    (section === 'careers' && (field === 'items' || field === 'careers') ? SECTION_FIELDS['careers.items'] : null) ||
    (field === 'cta' ? {
      type: 'object',
      objectFields: [
        { key: 'title', label: 'Call to Action Title', type: 'text' },
        { key: 'subtitle', label: 'Description', type: 'textarea' },
        { key: 'buttonText', label: 'Button Text', type: 'text' },
      ],
    } : null)

  const [localData, setLocalData] = useState(null)
  const [expandedItem, setExpandedItem] = useState(0)

  // Initialize local copy when modal opens
  useEffect(() => {
    if (isOpen && cms && section && field) {
      let rawData = null

      if (section === 'blogs') {
        rawData = cms.blogs || DEFAULT_CMS_DATA.blogs || []
      } else if (section === 'careers' && (field === 'items' || field === 'careers')) {
        rawData = Array.isArray(cms.careers) ? cms.careers : (cms.careers?.items || DEFAULT_CMS_DATA.careers?.items || DEFAULT_CMS_DATA.careers || [])
      } else if (section === 'careers' && field === 'cta') {
        const careersObj = (typeof cms.careers === 'object' && !Array.isArray(cms.careers)) ? cms.careers : {}
        const defaultCareersObj = (typeof DEFAULT_CMS_DATA.careers === 'object' && !Array.isArray(DEFAULT_CMS_DATA.careers)) ? DEFAULT_CMS_DATA.careers : {}
        const existingCta = careersObj.cta || defaultCareersObj.cta || {}
        rawData = {
          title: existingCta.title || 'Don’t See Your Exact Bench?',
          subtitle: existingCta.subtitle || existingCta.desc || 'We are always looking for exceptional computational physicists, optical sensor designers, and low-level firmware hackers. Reach out directly to our founders.',
          desc: existingCta.desc || existingCta.subtitle || 'We are always looking for exceptional computational physicists, optical sensor designers, and low-level firmware hackers. Reach out directly to our founders.',
          buttonText: existingCta.buttonText || 'Send General Technical Inquiry',
          ...existingCta,
        }
      } else if (section === 'careers') {
        const pageData = (!Array.isArray(cms.careers) ? cms.careers : null) || DEFAULT_CMS_DATA.careers || {}
        rawData = pageData[field]
      } else {
        const pageData = cms[section] || DEFAULT_CMS_DATA[section] || {}
        const defaultPageData = DEFAULT_CMS_DATA[section] || {}

        rawData = pageData[field]

        // Check aliases if fieldData is empty
        if (!rawData || (Array.isArray(rawData) && rawData.length === 0)) {
          if (field === 'capabilities' || field === 'features') {
            rawData = pageData.features || pageData.capabilities || defaultPageData.features || defaultPageData.capabilities
          } else if (field === 'caseStudies' || field === 'mosaicStudies') {
            rawData = pageData.mosaicStudies || pageData.caseStudies || defaultPageData.mosaicStudies || defaultPageData.caseStudies
          } else {
            rawData = defaultPageData[field]
          }
        }

        if (section === 'settings' && field === 'header') {
          const existingHeader = pageData.header || defaultPageData.header || {}
          rawData = {
            logo: existingHeader.logo || pageData.logo || 'https://res.cloudinary.com/fukpn05e/image/upload/v1795505972/uandwelabs/cms/logo_1795505971242.png',
            companyName: existingHeader.companyName || pageData.companyName || 'UANDWE Labs',
            regionText: existingHeader.regionText || 'India',
            signInText: existingHeader.signInText || 'Sign In',
            navProducts: existingHeader.navProducts || 'Products',
            navBlogs: existingHeader.navBlogs || 'Blogs',
            navAbout: existingHeader.navAbout || 'About Us',
            navCareers: existingHeader.navCareers || 'Careers',
            ...existingHeader,
          }
        } else if (section === 'settings' && field === 'footer') {
          const existingSettings = pageData || defaultPageData || {}
          const existingFooter = existingSettings.footer || {}
          rawData = {
            logo: existingFooter.logo || existingSettings.logo || 'https://res.cloudinary.com/fukpn05e/image/upload/v1795505972/uandwelabs/cms/logo_1795505971242.png',
            companyName: existingFooter.companyName || existingSettings.companyName || 'UANDWE Labs',
            footerTagline: existingFooter.footerTagline || existingSettings.footerTagline || '',
            copyrightText: existingFooter.copyrightText || existingSettings.copyrightText || '© 2026 uandwelabs. All rights reserved.',
            twitter: existingFooter.twitter || existingSettings.socialLinks?.twitter || '',
            linkedin: existingFooter.linkedin || existingSettings.socialLinks?.linkedin || '',
            github: existingFooter.github || existingSettings.socialLinks?.github || '',
            contactEmail: existingFooter.contactEmail || existingSettings.contactEmail || '',
            contactPhone: existingFooter.contactPhone || existingSettings.contactPhone || '',
            officeAddress: existingFooter.officeAddress || existingSettings.officeAddress || '',
            ...existingFooter,
          }
        } else if (section === 'home' && field === 'beliefs') {
          const existingBeliefs = pageData.beliefs || defaultPageData.beliefs || {}
          rawData = {
            title1: existingBeliefs.title1 || (existingBeliefs.title ? existingBeliefs.title.split(' ').slice(0, 2).join(' ') : 'What We'),
            title2: existingBeliefs.title2 || (existingBeliefs.title ? existingBeliefs.title.split(' ').slice(2).join(' ') : 'Believe In'),
            subtitle: existingBeliefs.subtitle || 'Core Engineering Principles',
            intro: existingBeliefs.intro || existingBeliefs.desc || existingBeliefs.description || 'Great products begin with clear thinking, purposeful design, and an uncompromising commitment to getting the details right. At UANDWE Labs, we build technology that endures.',
            items: existingBeliefs.items || defaultPageData.beliefs?.items || [],
            ...existingBeliefs,
          }
        } else if (section === 'privacyPolicy' && field === 'contact') {
          const existingContact = pageData.contact || defaultPageData.contact || {}
          rawData = {
            label: existingContact.label || 'Direct Inquiry',
            contactEmail: existingContact.contactEmail || pageData.contactEmail || 'privacy@uandwelabs.com',
            ...existingContact,
          }
        } else if (section === 'termsOfService' && field === 'contact') {
          const existingContact = pageData.contact || defaultPageData.contact || {}
          rawData = {
            label: existingContact.label || 'Compliance Desk',
            deskDescription: existingContact.deskDescription || 'Questions regarding master enterprise agreements (MSA) or custom hardware SLAs:',
            contactEmail: existingContact.contactEmail || pageData.contactEmail || 'legal@uandwelabs.com',
            ...existingContact,
          }
        } else if (field === 'cta') {
          const existingCta = (typeof pageData === 'object' && !Array.isArray(pageData) && pageData.cta) ||
            (typeof defaultPageData === 'object' && !Array.isArray(defaultPageData) && defaultPageData.cta) || {}
          rawData = {
            title: existingCta.title || (section === 'about' ? 'Ready to Build What Truly Matters?' : ''),
            subtitle: existingCta.subtitle || existingCta.desc || (section === 'about' ? 'We are continually expanding our research and engineering branch in Bengaluru. Work alongside fluid aerodynamicists, sensor architects, and computational designers.' : ''),
            buttonText: existingCta.buttonText || existingCta.btnText || existingCta.ctaBtn || (section === 'about' ? 'Explore Open Careers' : ''),
            ...existingCta,
          }
        }
      }

      if (section === 'about' && field === 'mission' && typeof rawData === 'string') {
        rawData = {
          title: 'Technology Made for Real Life',
          statement: rawData,
          elaboration: 'Our studio brings together dreamers, architects, craftspeople, and thinkers who care deeply about everyday life. Whether we are designing comfortable spaces where cool breezes flow naturally, or creating gentle devices that keep grandparents safe at home without cameras watching over them, we believe good technology should feel like second nature—protecting your dignity, respecting your peace of mind, and bringing people closer together.'
        }
      }

      // Dynamic fallback schema if def not predefined
      if (!def && rawData) {
        if (Array.isArray(rawData) && rawData.length > 0) {
          def = {
            type: 'array',
            itemFields: Object.keys(rawData[0] || {})
              .filter(k => k !== 'id' && k !== 'meta')
              .map(k => ({
                key: k,
                label: k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1'),
                type: (k.toLowerCase().includes('image') || k.toLowerCase().includes('src') || k.toLowerCase().includes('thumb'))
                  ? 'image'
                  : (k.toLowerCase().includes('desc') || k.toLowerCase().includes('quote') || k.toLowerCase().includes('statement'))
                    ? 'textarea'
                    : 'text'
              }))
          }
        } else if (typeof rawData === 'object' && !Array.isArray(rawData)) {
          def = {
            type: 'object',
            objectFields: Object.keys(rawData)
              .filter(k => typeof rawData[k] !== 'object')
              .map(k => ({
                key: k,
                label: k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1'),
                type: (k.toLowerCase().includes('desc') || k.toLowerCase().includes('text')) ? 'textarea' : 'text'
              }))
          }
        }
      }

      // Initialize based on expected type
      if (def?.type === 'array' || Array.isArray(rawData)) {
        const arr = (Array.isArray(rawData) && rawData.length > 0)
          ? rawData
          : (Array.isArray(DEFAULT_CMS_DATA[section]?.[field]) ? DEFAULT_CMS_DATA[section][field] : (Array.isArray(rawData) ? rawData : []))
        setLocalData(JSON.parse(JSON.stringify(arr)))
      } else {
        const obj = (rawData && typeof rawData === 'object' && !Array.isArray(rawData))
          ? rawData
          : (DEFAULT_CMS_DATA[section]?.[field] || {})
        setLocalData(JSON.parse(JSON.stringify(obj)))
      }

      setExpandedItem(0)
    }
  }, [isOpen, cms, section, field, def])

  if (!isOpen) return null

  if (localData === null) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-start justify-end">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-lg h-full bg-neutral-900 border-l border-neutral-700 shadow-2xl flex flex-col p-6 items-center justify-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4" />
          <p className="text-sm text-neutral-300">Loading {label || 'section editor'}...</p>
        </div>
      </div>
    )
  }

  // Safe fallback if def is still missing
  if (!def) {
    def = Array.isArray(localData)
      ? { type: 'array', itemFields: [{ key: 'title', label: 'Title', type: 'text' }, { key: 'desc', label: 'Description', type: 'textarea' }] }
      : { type: 'object', objectFields: Object.keys(localData).map(k => ({ key: k, label: k, type: 'text' })) }
  }

  const handleSave = () => {
    onUpdate(section, field, localData)
    onClose()
  }

  // For array type fields
  const updateArrayItem = (idx, key, value) => {
    if (Array.isArray(localData)) {
      const updated = [...localData]
      updated[idx] = { ...updated[idx], [key]: value }
      setLocalData(updated)
    }
  }

  const addArrayItem = () => {
    if (Array.isArray(localData)) {
      const template = {}
      def.itemFields.forEach(f => { template[f.key] = '' })
      if (def.metaFields) template.meta = []
      setLocalData([...localData, template])
      setExpandedItem(localData.length)
    }
  }

  const removeArrayItem = (idx) => {
    if (Array.isArray(localData) && localData.length > 1) {
      setLocalData(localData.filter((_, i) => i !== idx))
      if (expandedItem >= localData.length - 1) setExpandedItem(Math.max(0, expandedItem - 1))
    }
  }

  const moveItem = (idx, direction) => {
    if (!Array.isArray(localData)) return
    const newIdx = idx + direction
    if (newIdx < 0 || newIdx >= localData.length) return
    const updated = [...localData]
    ;[updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]]
    setLocalData(updated)
    setExpandedItem(newIdx)
  }

  // Update object field
  const updateObjectField = (key, value) => {
    setLocalData({ ...localData, [key]: value })
  }

  // Update nested array inside object (e.g. beliefs.items, privacy.cards)
  const updateNestedArrayItem = (arrKey, idx, key, value) => {
    const arr = [...(localData[arrKey] || [])]
    arr[idx] = { ...arr[idx], [key]: value }
    setLocalData({ ...localData, [arrKey]: arr })
  }

  const addNestedArrayItem = (arrKey) => {
    const arr = [...(localData[arrKey] || [])]
    const template = {}
    def.itemFields.forEach(f => { template[f.key] = '' })
    arr.push(template)
    setLocalData({ ...localData, [arrKey]: arr })
    setExpandedItem(arr.length - 1)
  }

  const removeNestedArrayItem = (arrKey, idx) => {
    const arr = (localData[arrKey] || []).filter((_, i) => i !== idx)
    setLocalData({ ...localData, [arrKey]: arr })
  }

  // Update meta array inside an array item
  const updateMeta = (itemIdx, metaIdx, key, value) => {
    if (!Array.isArray(localData)) return
    const updated = [...localData]
    const meta = [...(updated[itemIdx].meta || [])]
    meta[metaIdx] = { ...meta[metaIdx], [key]: value }
    updated[itemIdx] = { ...updated[itemIdx], meta }
    setLocalData(updated)
  }

  const addMeta = (itemIdx) => {
    if (!Array.isArray(localData)) return
    const updated = [...localData]
    const meta = [...(updated[itemIdx].meta || []), { label: '', value: '' }]
    updated[itemIdx] = { ...updated[itemIdx], meta }
    setLocalData(updated)
  }

  const removeMeta = (itemIdx, metaIdx) => {
    if (!Array.isArray(localData)) return
    const updated = [...localData]
    const meta = (updated[itemIdx].meta || []).filter((_, i) => i !== metaIdx)
    updated[itemIdx] = { ...updated[itemIdx], meta }
    setLocalData(updated)
  }

  const renderField = (fieldDef, value, onChange, onApplyToAll = null) => {
    if (fieldDef.type === 'image') {
      return (
        <ImageField
          value={value}
          onChange={onChange}
          label={fieldDef.label}
          frontendBaseUrl={frontendBaseUrl}
          onApplyToAll={onApplyToAll}
        />
      )
    }
    if (fieldDef.type === 'textarea') {
      return (
        <div>
          <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{fieldDef.label}</label>
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="mt-1 w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:border-white focus:outline-none resize-y"
          />
        </div>
      )
    }
    return (
      <div>
        <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{fieldDef.label}</label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:border-white focus:outline-none"
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Side Panel */}
      <div className="relative w-full max-w-lg h-full bg-neutral-900 border-l border-neutral-700 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex flex-col px-5 py-4 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">{label}</h2>
              <p className="text-xs text-neutral-400 mt-0.5">{section} → {field}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {companion && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-800">
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-medium mr-1">Section Part:</span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white text-black shadow-xs cursor-default">
                {companion.currentTab}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (onSwitchSection) {
                    onSwitchSection(companion.targetSection, companion.targetField, companion.targetLabel)
                  }
                }}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer border border-neutral-700 flex items-center gap-1.5"
              >
                <span>Switch to: {companion.targetTab}</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* ARRAY TYPE */}
          {def.type === 'array' && Array.isArray(localData) && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-300">{localData.length} items</span>
                <button onClick={addArrayItem} className="flex items-center gap-1 px-3 py-1.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-neutral-200 cursor-pointer">
                  <Plus size={14} /> Add
                </button>
              </div>

              {/* Quick Action: Single Image for all slides */}
              {(field === 'healthcareSlides' || field === 'geoSpatialSlides') && (
                <div className="p-3 bg-neutral-800/80 border border-neutral-700 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-white block">1 Photo for All Slides</span>
                    <span className="text-[11px] text-neutral-400">
                      Upload 1 photo once to Cloudinary and use it across all {localData.length} cards without storing 3 duplicates.
                    </span>
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0">
                    <Upload size={13} />
                    <span>Upload 1 for All</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        showToast(`Uploading ${file.name} to Cloudinary...`, 'info')
                        try {
                          const prevUrl = localData?.[0]?.src || null
                          const res = await uploadMedia(file, prevUrl)
                          if (res.success) {
                            const updated = localData.map(it => ({ ...it, src: res.path }))
                            setLocalData(updated)
                            showToast('Uploaded to Cloudinary once and applied to all slides!', 'success')
                          }
                        } catch (err) {
                          showToast(`Upload failed: ${err.message}`, 'error')
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {localData.map((item, idx) => (
                <div key={idx} className="border border-neutral-700 rounded-xl overflow-hidden">
                  {/* Item Header (Collapsible) */}
                  <div
                    onClick={() => setExpandedItem(expandedItem === idx ? -1 : idx)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-neutral-800 hover:bg-neutral-750 text-left cursor-pointer select-none"
                  >
                    <span className="text-sm font-medium text-white">
                      {item.headline || item.title || item.name || `Item ${idx + 1}`}
                    </span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={(e) => { e.stopPropagation(); moveItem(idx, -1) }} className="p-1 hover:bg-neutral-700 rounded text-neutral-400 cursor-pointer" title="Move Up">
                        <ChevronUp size={14} />
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); moveItem(idx, 1) }} className="p-1 hover:bg-neutral-700 rounded text-neutral-400 cursor-pointer" title="Move Down">
                        <ChevronDown size={14} />
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeArrayItem(idx) }} className="p-1 hover:bg-red-900/50 rounded text-neutral-400 hover:text-red-400 cursor-pointer" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Item Fields (Expanded) */}
                  {expandedItem === idx && (
                    <div className="px-4 py-3 space-y-3 border-t border-neutral-700">
                      {def.itemFields.map((f) => {
                        const isImageField = f.type === 'image'
                        const handleApplyToAll = isImageField && item[f.key] ? () => {
                          const src = item[f.key]
                          const updated = localData.map(it => ({ ...it, [f.key]: src }))
                          setLocalData(updated)
                          showToast(`Applied photo to all ${localData.length} slides!`, 'success')
                        } : null

                        return (
                          <div key={f.key}>
                            {renderField(f, item[f.key], (val) => updateArrayItem(idx, f.key, val), handleApplyToAll)}
                          </div>
                        )
                      })}

                      {/* Meta specs (for showcase slides) */}
                      {def.metaFields && item.meta && (
                        <div className="pt-2 border-t border-neutral-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Spec Cards</span>
                            <button onClick={() => addMeta(idx)} className="text-xs text-white/60 hover:text-white cursor-pointer">+ Add Spec</button>
                          </div>
                          {(item.meta || []).map((m, mi) => (
                            <div key={mi} className="flex gap-2 mb-2 items-center">
                              <input
                                type="text"
                                value={m.label || ''}
                                onChange={(e) => updateMeta(idx, mi, 'label', e.target.value)}
                                placeholder="Label"
                                className="flex-1 px-2 py-1.5 bg-neutral-800 border border-neutral-700 rounded text-xs text-white focus:border-white focus:outline-none"
                              />
                              <input
                                type="text"
                                value={m.value || ''}
                                onChange={(e) => updateMeta(idx, mi, 'value', e.target.value)}
                                placeholder="Value"
                                className="flex-1 px-2 py-1.5 bg-neutral-800 border border-neutral-700 rounded text-xs text-white focus:border-white focus:outline-none"
                              />
                              <button onClick={() => removeMeta(idx, mi)} className="p-1 text-neutral-500 hover:text-red-400 cursor-pointer">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* OBJECT TYPE */}
          {def.type === 'object' && typeof localData === 'object' && !Array.isArray(localData) && (
            <>
              {/* Top-level object fields */}
              {def.objectFields?.map((f) => (
                <div key={f.key}>
                  {renderField(f, localData[f.key], (val) => updateObjectField(f.key, val))}
                </div>
              ))}

              {/* Nested array (e.g. beliefs.items, privacy.cards) */}
              {def.arrayKey && (
                <div className="pt-3 border-t border-neutral-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-neutral-300">
                      {def.arrayKey} ({(localData[def.arrayKey] || []).length} items)
                    </span>
                    <button
                      onClick={() => addNestedArrayItem(def.arrayKey)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-neutral-200 cursor-pointer"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>

                  {(localData[def.arrayKey] || []).map((item, idx) => (
                    <div key={idx} className="border border-neutral-700 rounded-xl overflow-hidden mb-3">
                      <div
                        onClick={() => setExpandedItem(expandedItem === idx ? -1 : idx)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-800 text-left cursor-pointer select-none"
                      >
                        <span className="text-sm font-medium text-white">
                          {item.title || item.name || `Item ${idx + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeNestedArrayItem(def.arrayKey, idx) }}
                          className="p-1 hover:bg-red-900/50 rounded text-neutral-400 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {expandedItem === idx && (
                        <div className="px-4 py-3 space-y-3 border-t border-neutral-700">
                          {def.itemFields.map((f) => (
                            <div key={f.key}>
                              {renderField(f, item[f.key], (val) => updateNestedArrayItem(def.arrayKey, idx, f.key, val))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-neutral-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-sm font-medium rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-white hover:bg-neutral-200 text-black text-sm font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save size={16} />
            Save Section
          </button>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// MAIN ADMIN APP
// ==========================================
export default function App() {
  const [cms, setCms] = useState(() => getCachedCms() || DEFAULT_CMS_DATA)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('uandwe_admin_auth') === 'true'
  })
  const [passcode, setPasscode] = useState('')
  const [authError, setAuthError] = useState('')
  const [serverOnline, setServerOnline] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [viewMode, setViewMode] = useState('desktop') // desktop | mobile
  const [frontendBaseUrl, setFrontendBaseUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const site = params.get('site') || params.get('preview')
      if (site) return site.replace(/\/$/, '')
      const saved = localStorage.getItem('uandwe_frontend_url')
      if (saved) return saved.replace(/\/$/, '')
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const port = params.get('port') || localStorage.getItem('uandwe_frontend_port') || '5174'
        return `http://localhost:${port}`
      }
    }
    return import.meta.env.VITE_FRONTEND_URL || 'https://uandwelabs.vercel.app'
  })
  const [activePath, setActivePath] = useState(() => {
    if (typeof window === 'undefined') return '/'
    const params = new URLSearchParams(window.location.search)
    const page = params.get('page')
    if (page) return page.startsWith('/') ? page : `/${page}`
    try {
      const saved = sessionStorage.getItem('uandwe_admin_active_path')
      if (saved) return saved
    } catch {}
    return '/'
  })

  // Section editor modal state with persistence across browser refresh
  const [editorOpen, setEditorOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    const params = new URLSearchParams(window.location.search)
    if (params.get('section') && params.get('field')) return true
    try {
      return sessionStorage.getItem('uandwe_admin_editor_open') === 'true'
    } catch {}
    return false
  })
  const [editSection, setEditSection] = useState(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    const sec = params.get('section')
    if (sec) return sec
    try {
      return sessionStorage.getItem('uandwe_admin_edit_section') || null
    } catch {}
    return null
  })
  const [editField, setEditField] = useState(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    const fld = params.get('field')
    if (fld) return fld
    try {
      return sessionStorage.getItem('uandwe_admin_edit_field') || null
    } catch {}
    return null
  })
  const [editLabel, setEditLabel] = useState(() => {
    if (typeof window === 'undefined') return ''
    const params = new URLSearchParams(window.location.search)
    const lbl = params.get('label')
    if (lbl) return decodeURIComponent(lbl)
    try {
      return sessionStorage.getItem('uandwe_admin_edit_label') || ''
    } catch {}
    return ''
  })

  // Persist activePath in URL and sessionStorage across browser refresh
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      sessionStorage.setItem('uandwe_admin_active_path', activePath)
      const url = new URL(window.location.href)
      url.searchParams.set('page', activePath)
      window.history.replaceState(null, '', url.toString())
    } catch {}
  }, [activePath])

  // Persist modal state in URL and sessionStorage across browser refresh
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (editorOpen && editSection && editField) {
        sessionStorage.setItem('uandwe_admin_editor_open', 'true')
        sessionStorage.setItem('uandwe_admin_edit_section', editSection)
        sessionStorage.setItem('uandwe_admin_edit_field', editField)
        sessionStorage.setItem('uandwe_admin_edit_label', editLabel || '')
        const url = new URL(window.location.href)
        url.searchParams.set('section', editSection)
        url.searchParams.set('field', editField)
        if (editLabel) url.searchParams.set('label', editLabel)
        window.history.replaceState(null, '', url.toString())
      } else {
        sessionStorage.removeItem('uandwe_admin_editor_open')
        sessionStorage.removeItem('uandwe_admin_edit_section')
        sessionStorage.removeItem('uandwe_admin_edit_field')
        sessionStorage.removeItem('uandwe_admin_edit_label')
        const url = new URL(window.location.href)
        url.searchParams.delete('section')
        url.searchParams.delete('field')
        url.searchParams.delete('label')
        window.history.replaceState(null, '', url.toString())
      }
    } catch {}
  }, [editorOpen, editSection, editField, editLabel])

  const iframeRef = useRef(null)

  // Load CMS data on mount & check URL params for direct edit trigger
  useEffect(() => {
    async function load() {
      const res = await fetchCms()
      if (res?.data) {
        if (res.data?.aura?.gallery) {
          res.data.aura.gallery = res.data.aura.gallery.filter(
            (item) => !item.title?.toLowerCase().includes('biomimetic')
          )
        }
        setCms(res.data)
        setServerOnline(!!res.success)
        if (res.success) showToast('Connected to Backend on Port 5001', 'success')
        else showToast('Backend offline — using cached data', 'info')
      }
    }
    load()

    // Check if opened directly with target section to edit
    const params = new URLSearchParams(window.location.search)
    const sec = params.get('section')
    const fld = params.get('field')
    const lbl = params.get('label')
    if (sec && fld) {
      setEditSection(sec)
      setEditField(fld)
      setEditLabel(lbl ? decodeURIComponent(lbl) : `${sec} ${fld}`)
      setEditorOpen(true)
    }
  }, [])

  // Listen for messages from the frontend iframe
  useEffect(() => {
    const handleMessage = (e) => {
      // Admin check: iframe asking if it's in admin mode
      if (e.data?.type === 'ADMIN_CHECK') {
        iframeRef.current?.contentWindow?.postMessage({ type: 'ADMIN_ACTIVATE' }, '*')
      }

      // Edit section request from iframe
      if (e.data?.type === 'EDIT_SECTION') {
        setEditSection(e.data.section)
        setEditField(e.data.field)
        setEditLabel(e.data.label)
        setEditorOpen(true)
      }

      // Route change notification from iframe
      if (e.data?.type === 'ROUTE_CHANGE' && e.data.path) {
        const cleanPath = e.data.path.split('#')[0] || '/'
        setActivePath(cleanPath)
      }

      // Section scroll notification from iframe (track in session without forcing iframe reloads)
      if (e.data?.type === 'SECTION_CHANGE' || e.data?.type === 'SECTION_SCROLL') {
        try {
          if (e.data.section) {
            sessionStorage.setItem('uandwe_active_section', e.data.section)
          }
          if (e.data.scrollY !== undefined) {
            sessionStorage.setItem('uandwe_scroll_y', String(e.data.scrollY))
          }
        } catch {}
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Send admin activation to iframe when it loads
  const handleIframeLoad = () => {
    setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage({ type: 'ADMIN_ACTIVATE' }, '*')
    }, 500)
  }

  const getPreviewUrl = (path = activePath) => {
    const base = (frontendBaseUrl || '').replace(/\/$/, '')
    const separator = path.includes('?') ? '&' : '?'
    return `${base}${path}${separator}admin=true`
  }

  // Preserve stable iframe URL so React renders do not cause iframe reloads/blinking
  const [initialIframeUrl] = useState(() => {
    const base = (frontendBaseUrl || '').replace(/\/$/, '')
    const separator = activePath.includes('?') ? '&' : '?'
    return `${base}${activePath}${separator}admin=true`
  })

  const updateFrontendUrl = (newUrl) => {
    if (!newUrl) return
    const cleanUrl = newUrl.trim().replace(/\/$/, '')
    setFrontendBaseUrl(cleanUrl)
    if (typeof window !== 'undefined') {
      localStorage.setItem('uandwe_frontend_url', cleanUrl)
    }
    if (iframeRef.current) {
      const separator = activePath.includes('?') ? '&' : '?'
      iframeRef.current.src = `${cleanUrl}${activePath}${separator}admin=true&t=${Date.now()}`
    }
    showToast(`Preview website updated to ${cleanUrl}`, 'info')
  }

  // Switch port between 5174 and 5173
  const switchPort = (newPort) => {
    updateFrontendUrl(`http://localhost:${newPort}`)
  }

  // Reload iframe
  const reloadIframe = () => {
    if (iframeRef.current) {
      const base = (frontendBaseUrl || '').replace(/\/$/, '')
      const separator = activePath.includes('?') ? '&' : '?'
      iframeRef.current.src = `${base}${activePath}${separator}admin=true&t=${Date.now()}`
    }
    showToast('Reloading preview...', 'info')
  }

  // Navigate iframe to a specific page
  const navigateIframe = (path) => {
    setActivePath(path)
    if (iframeRef.current) {
      const base = (frontendBaseUrl || '').replace(/\/$/, '')
      const separator = path.includes('?') ? '&' : '?'
      iframeRef.current.src = `${base}${path}${separator}admin=true`
    }
  }

  // Handle section update from editor modal
  const handleSectionUpdate = async (section, field, data) => {
    let updated = { ...cms }

    if (section === 'blogs') {
      updated.blogs = data
    } else if (section === 'careers') {
      if (field === 'items' || field === 'careers') {
        if (Array.isArray(updated.careers)) {
          updated.careers = data
        } else {
          updated.careers = { ...(updated.careers || {}), items: data }
        }
      } else {
        const careersObj = (typeof updated.careers === 'object' && !Array.isArray(updated.careers))
          ? { ...updated.careers }
          : { items: Array.isArray(updated.careers) ? updated.careers : [] }
        careersObj[field] = data
        updated.careers = careersObj
      }
    } else {
      const pageObj = { ...(cms[section] || {}) }
      pageObj[field] = data

      // Synchronize aliases
      if (field === 'capabilities') pageObj.features = data
      if (field === 'features') pageObj.capabilities = data
      if (field === 'caseStudies') pageObj.mosaicStudies = data
      if (field === 'mosaicStudies') pageObj.caseStudies = data
      if (field === 'cta') {
        if (data?.subtitle && !data?.desc) data.desc = data.subtitle
        if (data?.desc && !data?.subtitle) data.subtitle = data.desc
      }

      // Synchronize settings.header with settings.companyName and settings.logo
      if (section === 'settings' && field === 'header') {
        if (data?.companyName) {
          pageObj.companyName = data.companyName
          if (pageObj.footer) pageObj.footer.companyName = data.companyName
        }
        if (data?.logo) {
          pageObj.logo = data.logo
          if (pageObj.footer) pageObj.footer.logo = data.logo
        }
      }
      // Synchronize settings.footer with settings.companyName, settings.logo, settings.footerTagline, etc.
      if (section === 'settings' && field === 'footer') {
        pageObj.footer = data
        if (data?.footerTagline) pageObj.footerTagline = data.footerTagline
        if (data?.companyName) pageObj.companyName = data.companyName
        if (data?.logo) pageObj.logo = data.logo
        if (data?.copyrightText) pageObj.copyrightText = data.copyrightText
        if (!pageObj.socialLinks) pageObj.socialLinks = {}
        if (data?.twitter) pageObj.socialLinks.twitter = data.twitter
        if (data?.linkedin) pageObj.socialLinks.linkedin = data.linkedin
        if (data?.github) pageObj.socialLinks.github = data.github
        if (data?.contactEmail) pageObj.contactEmail = data.contactEmail
        if (data?.contactPhone) pageObj.contactPhone = data.contactPhone
        if (data?.officeAddress) pageObj.officeAddress = data.officeAddress
      }
      // Synchronize contact emails
      if (section === 'privacyPolicy' && field === 'contact') {
        if (data?.contactEmail) pageObj.contactEmail = data.contactEmail
      }
      if (section === 'termsOfService' && field === 'contact') {
        if (data?.contactEmail) pageObj.contactEmail = data.contactEmail
      }

      // Synchronize home.beliefs title with title1 and title2
      if (section === 'home' && field === 'beliefs') {
        if (data?.title1 || data?.title2) {
          data.title = `${data.title1 || ''} ${data.title2 || ''}`.trim()
        }
      }

      // Synchronize Aura Board between home and aura
      if (section === 'home' && field === 'board') {
        if (!updated.aura) updated.aura = {}
        updated.aura.board = data
      }
      if (section === 'aura' && field === 'board') {
        if (!updated.home) updated.home = {}
        updated.home.board = data
      }

      updated[section] = pageObj
    }

    setCms(updated)

    // 1. Instantly update iframe preview in real time (Zero Latency Reflection)
    try {
      iframeRef.current?.contentWindow?.postMessage({
        type: 'CMS_UPDATE',
        section,
        field,
        data,
        cms: updated,
      }, '*')
    } catch {}

    // 2. Persist to backend
    setIsSaving(true)
    showToast('Saving changes...', 'info')
    try {
      const res = await saveCms(updated)
      if (res?.success) {
        setServerOnline(true)
        setLastSaved(new Date().toLocaleTimeString())
        showToast('Changes saved and live!', 'success')

        // Tell iframe to re-sync CMS data
        iframeRef.current?.contentWindow?.postMessage({ type: 'CMS_REFRESH' }, '*')
      } else {
        throw new Error(res?.error || 'Save failed')
      }
    } catch (err) {
      showToast(`Saved to preview (Backend: ${err.message})`, 'warning')
    }
    setIsSaving(false)
  }

  // Authentication
  const handleLogin = () => {
    if (passcode.trim() === 'uandwe2026' || passcode.trim() === 'admin') {
      setIsAuthenticated(true)
      sessionStorage.setItem('uandwe_admin_auth', 'true')
      setAuthError('')
      showToast('Admin Console Unlocked', 'success')
    } else {
      setAuthError('Invalid passcode')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('uandwe_admin_auth')
    showToast('Admin Console Locked', 'info')
  }

  // ==========================================
  // LOGIN GATE
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center font-['Inter']">
        <div className="w-full max-w-sm mx-4">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-black" />
            </div>
            <h1 className="text-2xl font-semibold text-white">UandWe Labs Admin</h1>
            <p className="text-sm text-neutral-400 mt-2">Enter admin passcode to unlock the Visual Live Website Editor.</p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setAuthError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter passcode..."
              autoFocus
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm placeholder-neutral-500 focus:border-white focus:outline-none"
            />
            {authError && <p className="text-red-400 text-xs">{authError}</p>}
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-white hover:bg-neutral-200 text-black text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Unlock Admin
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    )
  }

  // ==========================================
  // MAIN ADMIN INTERFACE
  // ==========================================
  const iframeWidth = viewMode === 'mobile' ? 'max-w-[390px]' : 'w-full'

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-950 font-['Inter'] overflow-hidden relative">
      {/* IFRAME: Actual Website (100% full-screen matching real user view) */}
      <div className="w-full h-full bg-white overflow-hidden relative">
        <iframe
          ref={iframeRef}
          src={initialIframeUrl}
          className="w-full h-full border-0 bg-white"
          title="UandWe Labs Website Preview"
          onLoad={handleIframeLoad}
        />
      </div>

      {/* Floating Website Preview URL Controller */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 p-1.5 px-3 rounded-full bg-neutral-900/90 hover:bg-neutral-900 text-neutral-300 border border-neutral-700/80 shadow-2xl backdrop-blur-md text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-neutral-400 font-mono hidden md:inline">Website:</span>
        <span className="font-mono text-neutral-200 max-w-[200px] truncate" title={frontendBaseUrl}>
          {frontendBaseUrl}
        </span>
        <button
          type="button"
          onClick={() => {
            const next = window.prompt(
              'Enter Live Website URL (e.g. https://uandwelabs.vercel.app or http://localhost:5174):',
              frontendBaseUrl
            )
            if (next && next.trim()) {
              updateFrontendUrl(next)
            }
          }}
          className="ml-1 p-1 hover:text-white text-neutral-400 cursor-pointer rounded hover:bg-neutral-800 transition-colors"
          title="Change preview website URL"
        >
          <ExternalLink size={12} />
        </button>
        <button
          type="button"
          onClick={reloadIframe}
          className="p-1 hover:text-white text-neutral-400 cursor-pointer rounded hover:bg-neutral-800 transition-colors"
          title="Reload preview"
        >
          <RefreshCw size={12} />
        </button>

        <div className="h-4 w-px bg-neutral-700 mx-1 hidden sm:block" />
        <span className="text-neutral-400 font-mono hidden sm:inline">Page:</span>
        <select
          value={activePath}
          onChange={(e) => navigateIframe(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-white font-mono cursor-pointer"
        >
          <option value="/">Home</option>
          <option value="/ananda">Ananda</option>
          <option value="/dara">Dara</option>
          <option value="/aura">Aura</option>
          <option value="/blogs">Blogs</option>
          <option value="/about">About Us</option>
          <option value="/careers">Careers</option>
          <option value="/terms">Terms of Service</option>
          <option value="/privacy">Privacy Policy</option>
        </select>
      </div>

      {/* Discreet Exit Admin Button */}
      <button
        type="button"
        onClick={handleLogout}
        title="Lock admin"
        className="fixed bottom-4 right-4 z-40 p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-neutral-400 hover:text-red-400 border border-neutral-700/80 shadow-2xl cursor-pointer transition-colors flex items-center gap-1.5 text-xs backdrop-blur-md"
      >
        <LogOut size={14} />
        <span className="hidden sm:inline font-medium">Exit Admin</span>
      </button>

      {/* SECTION EDITOR MODAL (Slides in from right when user clicks any [Edit Section] button) */}
      <SectionEditorModal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        section={editSection}
        field={editField}
        label={editLabel}
        cms={cms}
        onUpdate={handleSectionUpdate}
        onSwitchSection={(sec, fld, lbl) => {
          setEditSection(sec)
          setEditField(fld)
          setEditLabel(lbl)
        }}
        frontendBaseUrl={frontendBaseUrl}
      />

      <ToastContainer />

      {/* Slide-in animation */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  )
}
