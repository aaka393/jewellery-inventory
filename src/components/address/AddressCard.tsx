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
          ? 'border-purple-500 bg-purple-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          {/* Address Type and Default Label */}
          <div className="flex items-center space-x-2 mb-2 text-sm font-medium text-gray-700">
            {getAddressTypeIcon()}
            <span>{getAddressTypeLabel()}</span>
            {address.isDefault && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                Default
              </span>
            )}
          </div>

          {/* Name and Contact */}
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900">{address.fullName}</h3>
            <p className="text-sm text-gray-600">{address.mobileNumber}</p>
          </div>

          {/* Address Details */}
          <div className="text-sm text-gray-700 leading-relaxed">
            <p>{address.houseNumber}</p>
            <p>{address.streetArea}</p>
            {address.landmark && <p>Landmark: {address.landmark}</p>}
            <p>
              {address.city}, {address.state} - {address.pincode}
            </p>
          </div>
        </div>

        {/* Edit / Delete */}
        {showActions && (
          <div className="flex sm:flex-col items-start gap-2 sm:ml-4">
            {onEdit && (
              <button
                onClick={onEdit}
                title="Edit address"
                className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                title="Delete address"
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100 gap-2">
        {!address.isDefault && onSetDefault && (
          <button
            onClick={onSetDefault}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Set as Default
          </button>
        )}

        {showSelectButton && onSelect && (
          <button
            onClick={onSelect}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isSelected
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
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
