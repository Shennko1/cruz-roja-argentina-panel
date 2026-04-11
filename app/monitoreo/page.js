"use client"
import { useEffect, useState } from "react"

export default function Monitoreo() {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetch("https://api.rss2json.com/v1/api.json?rss_url=https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo.xml")
      .then(res => res.json())
      .then(data => {
        setItems(data.items || [])
      })
  }, [])

  return (
    <div className="min-h-screen bg-[#f4f4f4] p-8">

      <h1 className="text-2xl font-bold mb-6">
        Monitoreo - Alertas SMN
      </h1>

      <div className="space-y-4">

        {items.map((item, i) => (
          <div key={i} className="bg-white p-4 rounded shadow-sm">

            <h2 className="font-semibold text-[#ee3224]">
              {item.title}
            </h2>

            <p className="text-sm text-gray-600 mt-1">
              {item.pubDate}
            </p>

            <p 
              className="text-sm mt-2"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />

          </div>
        ))}

      </div>

    </div>
  )
}
