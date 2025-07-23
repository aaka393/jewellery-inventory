interface CardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: string | number;
  note?: string;
}
const Card: React.FC<CardProps> = ({ icon: Icon, title, value, note }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center">
      <div className="p-2 sm:p-3 bg-[#D4B896] rounded-lg flex-shrink-0">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#5f3c2c]" />
      </div>
      <div className="ml-3 sm:ml-4 min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium text-[#5f3c2c] truncate">{title}</p>
        <p className="text-xl sm:text-xl font-medium text-[#5f3c2c] truncate">{value}</p>
        {note && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{note}</p>}
      </div>
    </div>
  </div>

);


export default Card;
