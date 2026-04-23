'use client'

import { useState } from 'react'
import { Icon } from '@/components/icons'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'

export function DownloadPdfButton() {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const res = await fetch('/api/resume')
      if (!res.ok) throw new Error('PDF generation failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'samridh-limbu-resume.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="btn btn-primary"
      style={{ fontFamily: MONO, fontSize: 10, opacity: loading ? 0.65 : 1, cursor: loading ? 'wait' : 'pointer' }}
    >
      <Icon name="download" size={11} />
      {loading ? 'generating...' : 'PDF'}
    </button>
  )
}
