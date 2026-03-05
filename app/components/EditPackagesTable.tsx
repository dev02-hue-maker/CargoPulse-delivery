// components/Admin/EditPackagesTable.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEdit, 
  FiTrash2, 
  FiSearch, 
  FiRefreshCw, 
  FiPackage, 
  FiMapPin,
  FiNavigation,
  FiPlus,
  FiClock,
  FiGlobe,
  FiHome,
  FiFlag,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiSave,
  FiTruck,
  FiUser
} from 'react-icons/fi';
import { 
  getAllPackages, 
  deletePackage, 
  updatePackage, 
  updatePackageStatus,
  addTrackingEvent,
  type TrackingPackage,
  type TrackingEvent 
} from '@/lib/tracking';

// Define the UpdatePackageData type locally
interface UpdatePackageData {
  tracking_number?: string;
  status?: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  service_type?: string;
  recipient_name?: string;
  recipient_address?: string;
  sender_name?: string;
  sender_address?: string;
  destination?: string;
  current_location?: string;
  last_location?: string;
  weight?: string;
  dimensions?: string;
  estimated_delivery?: string;
}

// Country data for dropdown
const countries = [
  // Original ones
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'AU', name: 'Australia' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SG', name: 'Singapore' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'RU', name: 'Russia' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  
  // Europe (continued)
  { code: 'AL', name: 'Albania' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AT', name: 'Austria' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EE', name: 'Estonia' },
  { code: 'FI', name: 'Finland' },
  { code: 'GR', name: 'Greece' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MT', name: 'Malta' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MK', name: 'North Macedonia' },
  { code: 'NO', name: 'Norway' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' },
  { code: 'SM', name: 'San Marino' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SE', name: 'Sweden' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'VA', name: 'Vatican City' },
  
  // Asia (continued)
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BN', name: 'Brunei' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IL', name: 'Israel' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'MO', name: 'Macao' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NP', name: 'Nepal' },
  { code: 'KP', name: 'North Korea' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PS', name: 'Palestine' },
  { code: 'PH', name: 'Philippines' },
  { code: 'QA', name: 'Qatar' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'KR', name: 'South Korea' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' },
  
  // Africa (all countries)
  { code: 'DZ', name: 'Algeria' },
  { code: 'AO', name: 'Angola' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'CV', name: 'Cabo Verde' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CD', name: 'Congo Democratic Republic' },
  { code: 'CG', name: 'Congo Republic' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'EG', name: 'Egypt' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'KE', name: 'Kenya' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'ML', name: 'Mali' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SN', name: 'Senegal' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SO', name: 'Somalia' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'SD', name: 'Sudan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TG', name: 'Togo' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'UG', name: 'Uganda' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
  
  // Americas (North, Central, South America & Caribbean)
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CU', name: 'Cuba' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HN', name: 'Honduras' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'PA', name: 'Panama' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'SR', name: 'Suriname' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VE', name: 'Venezuela' },
  
  // Oceania & Pacific Islands
  { code: 'AS', name: 'American Samoa' },
  { code: 'CK', name: 'Cook Islands' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'PF', name: 'French Polynesia' },
  { code: 'GU', name: 'Guam' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NC', name: 'New Caledonia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NU', name: 'Niue' },
  { code: 'NF', name: 'Norfolk Island' },
  { code: 'MP', name: 'Northern Mariana Islands' },
  { code: 'PW', name: 'Palau' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PN', name: 'Pitcairn Islands' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'TK', name: 'Tokelau' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'WF', name: 'Wallis and Futuna' },
  
  // Territories & Other Regions
  { code: 'AX', name: 'Aland Islands' },
  { code: 'AI', name: 'Anguilla' },
  { code: 'AQ', name: 'Antarctica' },
  { code: 'AW', name: 'Aruba' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'BQ', name: 'Bonaire' },
  { code: 'BV', name: 'Bouvet Island' },
  { code: 'IO', name: 'British Indian Ocean Territory' },
  { code: 'VG', name: 'British Virgin Islands' },
  { code: 'KY', name: 'Cayman Islands' },
  { code: 'CX', name: 'Christmas Island' },
  { code: 'CC', name: 'Cocos Islands' },
  { code: 'CW', name: 'Curacao' },
  { code: 'FK', name: 'Falkland Islands' },
  { code: 'FO', name: 'Faroe Islands' },
  { code: 'GF', name: 'French Guiana' },
  { code: 'TF', name: 'French Southern Territories' },
  { code: 'GI', name: 'Gibraltar' },
  { code: 'GL', name: 'Greenland' },
  { code: 'GP', name: 'Guadeloupe' },
  { code: 'GG', name: 'Guernsey' },
  { code: 'HM', name: 'Heard Island' },
  { code: 'IM', name: 'Isle of Man' },
  { code: 'JE', name: 'Jersey' },
  { code: 'XK', name: 'Kosovo' },
  { code: 'MQ', name: 'Martinique' },
  { code: 'YT', name: 'Mayotte' },
  { code: 'MS', name: 'Montserrat' },
  { code: 'NT', name: 'Neutral Zone' },
  { code: 'RE', name: 'Reunion' },
  { code: 'BL', name: 'Saint Barthelemy' },
  { code: 'SH', name: 'Saint Helena' },
  { code: 'MF', name: 'Saint Martin' },
  { code: 'PM', name: 'Saint Pierre and Miquelon' },
  { code: 'SX', name: 'Sint Maarten' },
  { code: 'GS', name: 'South Georgia' },
  { code: 'SJ', name: 'Svalbard' },
  { code: 'TC', name: 'Turks and Caicos Islands' },
  { code: 'UM', name: 'United States Minor Outlying Islands' },
  { code: 'VI', name: 'US Virgin Islands' },
  { code: 'EH', name: 'Western Sahara' }
];

export default function EditPackagesTable() {
  const [packages, setPackages] = useState<TrackingPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPackage, setEditingPackage] = useState<TrackingPackage | null>(null);
  const [statusUpdatePackage, setStatusUpdatePackage] = useState<TrackingPackage | null>(null);
  const [addEventPackage, setAddEventPackage] = useState<TrackingPackage | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      console.log("[Admin] Loading all packages...");
      const result = await getAllPackages();
      
      if (result.error) {
        console.error("[Admin] Error loading packages:", result.error);
        setError(result.error);
      } else if (result.packages) {
        console.log(`[Admin] Loaded ${result.packages.length} packages`);
        setPackages(result.packages);
        setSuccessMessage(`Successfully loaded ${result.packages.length} packages`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error("[Admin] Failed to load packages:", err);
      setError('Failed to load packages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (trackingNumber: string) => {
    if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      return;
    }

    try {
      console.log(`[Admin] Deleting package: ${trackingNumber}`);
      const result = await deletePackage(trackingNumber);
      
      if (result.error) {
        console.error("[Admin] Delete error:", result.error);
        setError(result.error);
      } else {
        console.log(`[Admin] Package deleted successfully: ${trackingNumber}`);
        setPackages(prev => prev.filter(pkg => pkg.tracking_number !== trackingNumber));
        setSuccessMessage(`Package ${trackingNumber} deleted successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error("[Admin] Delete package error:", err);
      setError('Failed to delete package');
    }
  };

  const handleEdit = (pkg: TrackingPackage) => {
    console.log(`[Admin] Editing package: ${pkg.tracking_number}`);
    setEditingPackage(pkg);
  };

  const handleStatusUpdate = (pkg: TrackingPackage) => {
    console.log(`[Admin] Updating status for: ${pkg.tracking_number}`);
    setStatusUpdatePackage(pkg);
  };

  const handleAddEvent = (pkg: TrackingPackage) => {
    console.log(`[Admin] Adding event for: ${pkg.tracking_number}`);
    setAddEventPackage(pkg);
  };

  const handleSaveEdit = async (updatedPackage: TrackingPackage) => {
    try {
      console.log(`[Admin] Saving edits for: ${updatedPackage.tracking_number}`);
      const { tracking_number, ...updates } = updatedPackage;
      const result = await updatePackage(tracking_number, updates as UpdatePackageData);
      
      if (result.error) {
        console.error("[Admin] Save edit error:", result.error);
        setError(result.error);
      } else if (result.package) {
        console.log(`[Admin] Package updated successfully: ${tracking_number}`);
        setPackages(prev => prev.map(pkg => 
          pkg.tracking_number === tracking_number ? result.package! : pkg
        ));
        setEditingPackage(null);
        setSuccessMessage(`Package ${tracking_number} updated successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error("[Admin] Update package error:", err);
      setError('Failed to update package');
    }
  };

  const handleSaveStatusUpdate = async (
    trackingNumber: string, 
    status: TrackingPackage['status'], 
    description?: string, 
    location?: string,
    country?: string,
    city?: string
  ) => {
    try {
      console.log(`[Admin] Updating status for ${trackingNumber}:`, {
        status,
        country,
        city,
        location
      });

      const result = await updatePackageStatus(
        trackingNumber, 
        status, 
        description, 
        location,
        country,
        city
      );
      
      if (result.error) {
        console.error("[Admin] Status update error:", result.error);
        setError(result.error);
      } else if (result.package) {
        console.log(`[Admin] Status updated successfully for ${trackingNumber}:`, {
          newStatus: result.package.status,
          newCountry: result.package.current_country
        });
        setPackages(prev => prev.map(pkg => 
          pkg.tracking_number === trackingNumber ? result.package! : pkg
        ));
        setStatusUpdatePackage(null);
        setSuccessMessage(`Status updated for ${trackingNumber}. The map will now show the plane in ${result.package.current_country_name || result.package.current_country}`);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (err) {
      console.error("[Admin] Status update error:", err);
      setError('Failed to update package status');
    }
  };

  const handleSaveAddEvent = async (trackingNumber: string, eventData: Omit<TrackingEvent, 'id' | 'package_id' | 'created_at'>) => {
    try {
      console.log(`[Admin] Adding event for ${trackingNumber}:`, eventData);
      const result = await addTrackingEvent(trackingNumber, eventData);
      
      if (result.error) {
        console.error("[Admin] Add event error:", result.error);
        setError(result.error);
      } else {
        console.log(`[Admin] Event added successfully for ${trackingNumber}`);
        // Refresh packages to get updated status if it changed
        await loadPackages();
        setAddEventPackage(null);
        setSuccessMessage(`Event added successfully to ${trackingNumber}`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error("[Admin] Add event error:", err);
      setError('Failed to add tracking event');
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pkg.current_country_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (pkg.destination_country_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (pkg.recipient_address?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100 border-green-200';
      case 'out_for_delivery': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'in_transit': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'picked_up': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'exception': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getCountryFlag = (countryCode?: string): string => {
    if (!countryCode) return '🌍';
    const flags: Record<string, string> = {
      'US': '🇺🇸', 'CA': '🇨🇦', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
      'JP': '🇯🇵', 'CN': '🇨🇳', 'IN': '🇮🇳', 'BR': '🇧🇷', 'AU': '🇦🇺',
      'MX': '🇲🇽', 'AE': '🇦🇪', 'SG': '🇸🇬', 'ZA': '🇿🇦', 'RU': '🇷🇺',
      'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭'
    };
    return flags[countryCode] || '🌍';
  };

  if (editingPackage) {
    return (
      <EditPackageForm
        pkg={editingPackage}
        onSave={handleSaveEdit}
        onCancel={() => setEditingPackage(null)}
      />
    );
  }

  if (statusUpdatePackage) {
    return (
      <StatusUpdateForm
        pkg={statusUpdatePackage}
        onSave={handleSaveStatusUpdate}
        onCancel={() => setStatusUpdatePackage(null)}
        countries={countries}
      />
    );
  }

  if (addEventPackage) {
    return (
      <AddEventForm
        pkg={addEventPackage}
        onSave={handleSaveAddEvent}
        onCancel={() => setAddEventPackage(null)}
        countries={countries}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Package Management</h1>
              <p className="text-gray-600">View, edit, and track all shipments in real-time</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={loadPackages}
              className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Refresh packages"
            >
              <FiRefreshCw className={`w-5 h-5 text-gray-700 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
            >
              <p className="text-green-700 font-medium flex items-center space-x-2">
                <FiCheckCircle className="w-5 h-5" />
                <span>{successMessage}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by tracking number, recipient, sender, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className="text-red-700 font-medium flex items-center space-x-2">
                <FiAlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Packages Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading packages...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest data</p>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="p-12 text-center">
              <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No packages found</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tracking #</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Service</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Current Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Destination</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPackages.map((pkg, index) => (
                    <motion.tr
                      key={pkg.tracking_number}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-mono font-semibold text-gray-900">
                          {pkg.tracking_number}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                          <FiUser className="w-3 h-3" />
                          <span>{pkg.recipient_name || 'No recipient'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{pkg.service_type}</span>
                        {pkg.service_level && (
                          <div className="text-xs text-gray-500 mt-1">{pkg.service_level}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <FiMapPin className="w-4 h-4 text-purple-600 shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm flex items-center space-x-1">
                              <span>{getCountryFlag(pkg.current_country)}</span>
                              <span>{pkg.current_country_name || pkg.current_country || 'Unknown'}</span>
                            </div>
                            {pkg.current_city && (
                              <div className="text-xs text-gray-500">
                                {pkg.current_city}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <FiNavigation className="w-4 h-4 text-orange-600 shrink-0" />
                          <div>
                            <div className="text-sm text-gray-900 flex items-center space-x-1">
                              <span>{getCountryFlag(pkg.destination_country)}</span>
                              <span>{pkg.destination_country_name || pkg.destination_country || 'Unknown'}</span>
                            </div>
                            {pkg.destination_city && (
                              <div className="text-xs text-gray-500">
                                {pkg.destination_city}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(pkg.status)}`}>
                          {pkg.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {new Date(pkg.updated_at).toLocaleDateString()}
                          <br />
                          <span className="text-xs">
                            {new Date(pkg.updated_at).toLocaleTimeString()}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleEdit(pkg)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit Package Details"
                          >
                            <FiEdit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleStatusUpdate(pkg)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Update Status & Location"
                          >
                            <FiTruck className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleAddEvent(pkg)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Add Tracking Event"
                          >
                            <FiPlus className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(pkg.tracking_number)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete Package"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Package Count */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Showing {filteredPackages.length} of {packages.length} packages
          </span>
          <span className="text-gray-400 text-xs">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// Edit Package Form Component
interface EditPackageFormProps {
  pkg: TrackingPackage;
  onSave: (updatedPackage: TrackingPackage) => void;
  onCancel: () => void;
}

function EditPackageForm({ pkg, onSave, onCancel }: EditPackageFormProps) {
  const [formData, setFormData] = useState<TrackingPackage>(pkg);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSave(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'exception', label: 'Exception' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <FiEdit className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Package</h2>
            <p className="text-gray-600">Tracking: {pkg.tracking_number}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Type
              </label>
              <input
                type="text"
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sender Name
              </label>
              <input
                type="text"
                name="sender_name"
                value={formData.sender_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recipient Name
              </label>
              <input
                type="text"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Weight
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="e.g., 2.5 kg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="e.g., 30 × 20 × 10 cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sender Address
              </label>
              <textarea
                name="sender_address"
                value={formData.sender_address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recipient Address
              </label>
              <textarea
                name="recipient_address"
                value={formData.recipient_address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estimated Delivery
              </label>
              <input
                type="datetime-local"
                name="estimated_delivery"
                value={formData.estimated_delivery || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
              } text-white transition-colors`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

// Status Update Form Component (UPDATED with country support)
interface StatusUpdateFormProps {
  pkg: TrackingPackage;
  onSave: (
    trackingNumber: string, 
    status: TrackingPackage['status'], 
    description?: string, 
    location?: string,
    country?: string,
    city?: string
  ) => void;
  onCancel: () => void;
  countries: Array<{ code: string; name: string }>;
}

function StatusUpdateForm({ pkg, onSave, onCancel, countries }: StatusUpdateFormProps) {
  const [status, setStatus] = useState<TrackingPackage['status']>(pkg.status);
  const [country, setCountry] = useState(pkg.current_country || 'US');
  const [city, setCity] = useState(pkg.current_city || '');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(pkg.current_country_name || pkg.current_country || '');
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', description: 'Shipment information received', color: 'gray' },
    { value: 'picked_up', label: 'Picked Up', description: 'Package picked up by carrier', color: 'purple' },
    { value: 'in_transit', label: 'In Transit', description: 'Package in transit', color: 'blue' },
    { value: 'out_for_delivery', label: 'Out for Delivery', description: 'Out for delivery', color: 'orange' },
    { value: 'delivered', label: 'Delivered', description: 'Package delivered successfully', color: 'green' },
    { value: 'exception', label: 'Exception', description: 'Delivery exception - contact support', color: 'red' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const selectedStatus = statusOptions.find(s => s.value === status);
      const eventDescription = description || selectedStatus?.description || '';
      const selectedCountry = countries.find(c => c.code === country);
      
      console.log("[StatusUpdate] Submitting update:", {
        trackingNumber: pkg.tracking_number,
        status,
        country,
        city,
        location: location || selectedCountry?.name || country
      });

      await onSave(
        pkg.tracking_number, 
        status, 
        eventDescription, 
        location || selectedCountry?.name || country,
        country,
        city
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <FiTruck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Update Status & Location</h2>
            <p className="text-gray-600">Tracking: {pkg.tracking_number}</p>
          </div>
        </div>

        {/* Map Preview Notice */}
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <div className="flex items-center space-x-2 text-purple-700 mb-2">
            <FiGlobe className="w-5 h-5" />
            <span className="font-medium">Map Update</span>
          </div>
          <p className="text-sm text-purple-600">
            Changing the country will automatically move the airplane on the tracking map to the new location.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              New Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value as TrackingPackage['status'])}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    status === option.value
                      ? `border-${option.color}-600 bg-${option.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`font-semibold ${
                    status === option.value ? `text-${option.color}-700` : 'text-gray-700'
                  }`}>
                    {option.label}
                  </div>
                  <div className={`text-xs mt-1 ${
                    status === option.value ? `text-${option.color}-600` : 'text-gray-500'
                  }`}>
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Country Selection (for map) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
              <FiGlobe className="w-4 h-4" />
              <span>Current Country (Map Location)</span>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              The airplane on the map will move to this country
            </p>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
              <FiMapPin className="w-4 h-4" />
              <span>City (Optional)</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          {/* Location Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
              <FiHome className="w-4 h-4" />
              <span>Location Name (Optional)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Sorting Center, Local Facility"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          {/* Custom Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Custom Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add custom status description or leave empty for default"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Update Preview</h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Status:</span> <span className="font-medium text-gray-900">{statusOptions.find(s => s.value === status)?.label}</span></p>
              <p><span className="text-gray-500">Country:</span> <span className="font-medium text-gray-900">{countries.find(c => c.code === country)?.name} {country}</span></p>
              {city && <p><span className="text-gray-500">City:</span> <span className="font-medium text-gray-900">{city}</span></p>}
              <p><span className="text-gray-500">Description:</span> <span className="font-medium text-gray-900">{description || statusOptions.find(s => s.value === status)?.description}</span></p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              } text-white transition-colors`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Update Status & Location</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

// Add Event Form Component (UPDATED with country support)
interface AddEventFormProps {
  pkg: TrackingPackage;
  onSave: (trackingNumber: string, eventData: Omit<TrackingEvent, 'id' | 'package_id' | 'created_at'>) => void;
  onCancel: () => void;
  countries: Array<{ code: string; name: string }>;
}

function AddEventForm({ pkg, onSave, onCancel, countries }: AddEventFormProps) {
  const [status, setStatus] = useState<TrackingPackage['status']>(pkg.status);
  const [country, setCountry] = useState(pkg.current_country || 'US');
  const [city, setCity] = useState(pkg.current_city || '');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventTimestamp, setEventTimestamp] = useState(new Date().toISOString().slice(0, 16));
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'exception', label: 'Exception' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const selectedCountry = countries.find(c => c.code === country);
      
      console.log("[AddEvent] Submitting event:", {
        trackingNumber: pkg.tracking_number,
        status,
        country,
        city,
        location
      });

      await onSave(pkg.tracking_number, {
        status,
        description,
        location: location || city || selectedCountry?.name || country,
        location_country: country,
        location_city: city,
        event_timestamp: new Date(eventTimestamp).toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <FiPlus className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Tracking Event</h2>
            <p className="text-gray-600">Tracking: {pkg.tracking_number}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TrackingPackage['status'])}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
              <FiGlobe className="w-4 h-4" />
              <span>Country</span>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location Name
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Sorting Facility, Delivery Hub"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Timestamp
            </label>
            <input
              type="datetime-local"
              value={eventTimestamp}
              onChange={(e) => setEventTimestamp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
              } text-white transition-colors`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <FiPlus className="w-4 h-4" />
                  <span>Add Event</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}