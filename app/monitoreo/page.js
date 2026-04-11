"use client"
import { useEffect, useState } from "react"

export default function Monitoreo() {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetch("https://ssl.smn.gob.ar/feeds/CAP/rss_alertaCAP_nuevo.xml")
      .then(res => res.text())
      .then(str => {
        const parser = new DOMParser()
        const xml = parser.parseFromString(str, "text/xml")

        const nodes = Array.from(xml.getElementsByTagName("item"))

        const parsed = nodes.map(node => {
          const title = node.getElementsByTagName("title")[0]?.textContent
          const description = node.getElementsByTagName("description")[0]?.textContent
          const onset = node.getElementsByTagName("onset")[0]?.textContent

          return {
            title,
            description,
            onset
          }
        })

        setItems(parsed)
      })
      .catch(() => setItems([]))
  }, [])

  return (
    <div className="min-h-screen bg-[#f4f4f4] p-8">

      <h1 className="text-2xl font-bold mb-6">
        Monitoreo - Alertas SMN
      </h1>

      <div className="space-y-4">

        {items.map((item, i) => {

          const textoPlano = (item.description || "").replace(/<[^>]+>/g, "")

          const fecha = item.onset
            ? new Date(item.onset).toLocaleString("es-AR")
            : "Sin fecha"

          // intento simple de ubicación
          const ubicacionMatch = textoPlano.match(/en (.*?)(\.|,)/i)
          const ubicacion = ubicacionMatch ? ubicacionMatch[1] : "No especificado"

          return (
            <div key={i} className="bg-white p-4 rounded shadow-sm border-l-4 border-[#ee3224]">

              <h2 className="font-semibold text-[#ee3224]">
                {item.title}
              </h2>

              <p className="text-sm text-gray-700 mt-1">
                <strong>Ubicación:</strong> {ubicacion}
              </p>

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

    </div>
  )
}
