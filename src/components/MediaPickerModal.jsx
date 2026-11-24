import { useState } from 'react'
import { X, Upload, Check } from 'lucide-react'
import { uploadMedia } from '../services/api'
import { showToast } from './Toast'

const WEBSITE_ASSETS = [
  { label: 'Aura Roadside LPR', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433117/uandwelabs/cms/aura_2_1795433115192.jpg' },
  { label: 'Aura Vision Street', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433119/uandwelabs/cms/aura_1_1795433117743.jpg' },
  { label: 'Aura Sentinel Checkpoint', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433121/uandwelabs/cms/aura_sentinel_ladybug_1795433118929.jpg' },
  { label: 'Aura Vision Campus', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433123/uandwelabs/cms/aura_vision_ladybug_1795433121288.jpg' },
  { label: 'Aura Ladybug Node (Studio)', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433125/uandwelabs/cms/aura_biomimetic_node_1795433123452.jpg' },
  { label: 'Aura Highway Dusk', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433127/uandwelabs/cms/hero_aura_highway_lpr_1795433125508.jpg' },
  { label: 'Ananda Urban Physics', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433129/uandwelabs/cms/hero_ananda_urban_physics_1795433127739.jpg' },
  { label: 'Ananda Riverside Skyline', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433130/uandwelabs/cms/goldenHourRiverside_1795433128934.jpg' },
  { label: 'Ananda Courtyard Windflow', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433132/uandwelabs/cms/goldenHourWindflow_1795433130713.jpg' },
  { label: 'Ananda Waterway Masterplan', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433134/uandwelabs/cms/geminiEcoCourtyard_1795433132756.jpg' },
  { label: 'Ananda Passive Exoskeleton', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433136/uandwelabs/cms/ananda_hero_exoskeleton_1795433134903.jpg' },
  { label: 'Ananda Hillside Breeze', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433138/uandwelabs/cms/residential_breeze_1795433136193.jpg' },
  { label: 'Ananda UB City Courtyard', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433139/uandwelabs/cms/ananda_indian_bangalore_ubcity_1795433137879.jpg' },
  { label: 'Dara Home Device', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795424401/uandwelabs/cms/Hands_Cradling_a_Dynamic_Heart_1795424399358.jpg' },
  { label: 'About Studio Architecture', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433140/uandwelabs/cms/about_hero_studio_1795433139418.jpg' },
  { label: 'About Team Collaboration', path: 'https://res.cloudinary.com/fukpn05e/image/upload/v1795433142/uandwelabs/cms/about_team_discussion_1795433140845.jpg' },
]

export default function MediaPickerModal({ open, onClose, onSelect, currentUrl = null }) {
  const [isUploading, setIsUploading] = useState(false)

  if (!open) return null

  const handleFileUpload = async (file) => {
    if (!file) return
    setIsUploading(true)
    showToast(`Uploading ${file.name}...`, 'info')
    try {
      const res = await uploadMedia(file, currentUrl)
      setIsUploading(false)
      if (res && res.success) {
        showToast('Image uploaded successfully!', 'success')
        onSelect(res.path)
        onClose()
      } else {
        throw new Error(res?.message || 'Upload failed')
      }
    } catch (err) {
      setIsUploading(false)
      showToast(`Upload failed: ${err.message}`, 'error')
    }
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <h3 className="font-bold text-white text-base">Select or Upload Image</h3>
            <p className="text-xs text-neutral-400">Choose from website asset library or upload a file from your PC.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Trigger */}
        <div className="flex items-center justify-between pb-1">
          <span className="text-xs text-neutral-400">Available Library Assets:</span>
          <label className="cursor-pointer px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold flex items-center gap-2 transition-all">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload Image from PC'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
              className="hidden"
            />
          </label>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-1 flex-1">
          {WEBSITE_ASSETS.map((asset) => (
            <button
              key={asset.path}
              type="button"
              onClick={() => {
                onSelect(asset.path)
                onClose()
              }}
              className="group rounded-2xl border border-neutral-800 hover:border-white overflow-hidden bg-neutral-950 text-left p-2.5 transition-all cursor-pointer"
            >
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-neutral-800 mb-2 border border-neutral-800">
                <img
                  src={asset.path}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-[11px] font-bold text-neutral-200 truncate">
                {asset.label}
              </div>
              <div className="text-[10px] text-neutral-500 font-mono truncate">
                {asset.path}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
