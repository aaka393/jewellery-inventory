import React from 'react';
import { Home, Building, MapPin, Edit, Trash2, Check } from 'lucide-react';
import { Address } from '../../types/address';

interface AddressCardProps {
  address: Address;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  showActions?: boolean;
  showSelectButton?: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  showActions = true,
  showSelectButton = false,
}) => {
  const getAddressTypeIcon = () => {
    switch (address.addressType) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'office':
        return <Building className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getAddressTypeLabel = () => {
    switch (address.addressType) {
      case 'home':
        return '🏡 Home';
      case 'office':
        return '🏢 Office';
      default:
        return '📦 Other';
    }
  };

  return (
    <div
      className={`w-full border rounded-xl p-4 sm:p-6 transition-all duration-200 ${
        isSelected
          ? 'border-[#DEC9A3] bg-[#f4f1e7] shadow-md'
          : 'border-[#e5ded0] hover:border-[#DEC9A3] hover:shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex-1">
        {/* Address Type and Default Label */}
        <div className="flex items-center flex-wrap gap-2 mb-2 text-sm font-serif text-[#4A3F36]">
          {getAddressTypeIcon()}
          <span className="italic">{getAddressTypeLabel()}</span>
          {address.isDefault && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
              Default
            </span>
          )}
        </div>

        {/* Name and Contact */}
        <div className="mb-2">
          <h3 className="font-semibold text-[#4A3F36] truncate">{address.fullName}</h3>
          <p className="text-sm text-[#4A3F36] font-light">{address.mobileNumber}</p>
        </div>

        {/* Address Details */}
        <div className="text-sm text-[#4A3F36] leading-relaxed font-light space-y-1">
          <p className="break-words">{address.houseNumber}</p>
          <p className="break-words">{address.streetArea}</p>
          {address.landmark && <p className="break-words">Landmark: {address.landmark}</p>}
          <p>
            {address.city}, {address.state} - {address.pincode}
          </p>
        </div>
      </div>

      {/* Edit / Delete */}
      {showActions && (
        <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:ml-4 flex-shrink-0">
          {onEdit && (
            <button
              onClick={onEdit}
              title="Edit address"
              className="p-2 text-[#4A3F36] hover:text-[#aa732f] hover:bg-[#f4f1e7] rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              title="Delete address"
              className="p-2 text-[#4A3F36] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>

    {/* Footer Actions */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 pt-4 border-t border-[#eae4d8] gap-3">
      {!address.isDefault && onSetDefault && (
        <button
          onClick={onSetDefault}
          className="text-sm text-[#aa732f] hover:text-[#8f5c20] font-medium font-serif italic transition-colors"
          title="Set as default address"
        >
          Set as Default
        </button>
      )}

      {showSelectButton && onSelect && (
        <button
          onClick={onSelect}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors font-serif italic w-full sm:w-auto ${
            isSelected
              ? 'bg-[#aa732f] text-white'
              : 'bg-[#DEC9A3] text-[#4A3F36] hover:bg-[#d1b990]'
          }`}
          title={isSelected ? 'Selected for delivery' : 'Select this address'}
        >
          {isSelected ? (
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              <span>Selected</span>
            </span>
          ) : (
            'Deliver Here'
          )}
        </button>
      )}
    </div>
    </div>
  );

};

export default AddressCard;
