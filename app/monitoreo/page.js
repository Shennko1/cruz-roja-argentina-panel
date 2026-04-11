"use client"
import { useEffect, useState } from "react"

export default function Monitoreo() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    fetch("https://api.rss2json.com/v1/api.json?rss_url=https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo.xml")
      .then(res => res.json())
      .then((data: any) => {
        setItems(data.items || [])
      })
  }, [])

  return (
    <div className="p-8">

      {items.map((item: any, i: number) => {
        const fecha = item.pubDate
          ? new Date(item.pubDate).toLocaleString("es-AR")
          : "Sin fecha"

        const textoPlano = (item.description || "").replace(/<[^>]+>/g, "")

        return (
          <div key={i} className="bg-white p-4 rounded shadow-sm border-l-4 border-[#ee3224]">

            <h2 className="font-semibold text-[#ee3224]">
              {item.title}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              {fecha}
            </p>

            <p className="text-sm mt-2 text-gray-800">
              {textoPlano}
            </p>

          </div>
        )
      })}

    </div>
  )
}
