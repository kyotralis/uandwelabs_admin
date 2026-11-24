import { useState } from 'react'
import { Upload, Check, Copy, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { uploadMedia } from '../services/api'
import { showToast } from './Toast'

const ALL_ASSETS = [
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

export default function MediaLibrary() {
  const [copiedPath, setCopiedPath] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [customAssets, setCustomAssets] = useState([])

  const handleCopy = (path) => {
    navigator.clipboard.writeText(path)
    setCopiedPath(path)
    showToast(`Copied ${path} to clipboard!`, 'success')
    setTimeout(() => setCopiedPath(null), 2000)
  }

  const handleUpload = async (file) => {
    if (!file) return
    setIsUploading(true)
    showToast(`Uploading ${file.name}...`, 'info')
    try {
      const res = await uploadMedia(file)
      setIsUploading(false)
      if (res && res.success) {
        showToast('Image uploaded successfully!', 'success')
        setCustomAssets((prev) => [{ label: res.filename, path: res.path }, ...prev])
      }
    } catch (err) {
      setIsUploading(false)
      showToast(`Upload failed: ${err.message}`, 'error')
    }
  }

  const list = [...customAssets, ...ALL_ASSETS]

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-neutral-400" />
              <span>Media Asset Library & File Uploader</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Upload photos directly into frontend public folder or copy existing paths for any section.
            </p>
          </div>

          <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold flex items-center gap-2 transition-all shadow-md">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading Image...' : 'Upload Image from PC'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload(file)
              }}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5 group hover:border-neutral-600 transition-colors"
            >
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
                <img src={item.path} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-white truncate">{item.label}</div>
                <div className="text-[10px] text-neutral-500 font-mono truncate">{item.path}</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(item.path)}
                className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-medium text-neutral-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedPath === item.path ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Path</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
