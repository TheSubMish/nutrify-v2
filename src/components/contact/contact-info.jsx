
export function ContactInfo({ icon, title, info }) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400">{info}</p>
      </div>
    </div>
  )
}