{items.map((item, i) => {
  const fecha = new Date(item.pubDate).toLocaleString("es-AR")
  const textoPlano = item.description.replace(/<[^>]+>/g, "")

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
