// components/Admin/CreatePackageForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPackage, 
  FiUser, 
  FiMapPin, 
  FiTruck, 
  FiSave,
  FiNavigation,
  FiHome,
  FiGlobe,
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
  FiPlus,
  FiX,
  FiImage,
  FiTag,
  FiBox,
  FiDroplet,
  FiFileText,
  FiUpload,
  FiTrash2,
  FiStar
} from 'react-icons/fi';
import { FaFireFlameCurved } from 'react-icons/fa6';
import { createPackage, type CreatePackageData, type PackageType, type ServiceCategory, type ImageType } from '@/lib/tracking';

// Country data for map tracking
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

// Package types
const packageTypes: { value: PackageType; label: string; icon: React.ReactNode }[] = [
  { value: 'document', label: 'Document', icon: <FiFileText className="w-4 h-4" /> },
  { value: 'envelope', label: 'Envelope', icon: <FiFileText className="w-4 h-4" /> },
  { value: 'parcel', label: 'Parcel', icon: <FiBox className="w-4 h-4" /> },
  { value: 'pallet', label: 'Pallet', icon: <FiTruck className="w-4 h-4" /> },
  { value: 'crate', label: 'Crate', icon: <FiBox className="w-4 h-4" /> },
  { value: 'other', label: 'Other', icon: <FiPackage className="w-4 h-4" /> }
];

// Image types
const imageTypes: { value: ImageType; label: string; icon: React.ReactNode }[] = [
  { value: 'package', label: 'Package Photo', icon: <FiPackage className="w-4 h-4" /> },
  { value: 'label', label: 'Shipping Label', icon: <FiTag className="w-4 h-4" /> },
  { value: 'delivery_proof', label: 'Delivery Proof', icon: <FiCheckCircle className="w-4 h-4" /> },
  { value: 'signature', label: 'Signature', icon: <FiFileText className="w-4 h-4" /> },
  { value: 'other', label: 'Other', icon: <FiImage className="w-4 h-4" /> }
];

// Service categories
const serviceCategories: { value: ServiceCategory; label: string }[] = [
  { value: 'express', label: 'Express' },
  { value: 'ground', label: 'Ground' },
  { value: 'freight', label: 'Freight' },
  { value: 'international', label: 'International' },
  { value: 'same_day', label: 'Same Day' }
];

// Service levels
const serviceLevels = [
  'Priority',
  'Standard',
  'Economy',
  'First Class',
  'Business'
];

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'picked_up', label: 'Picked Up', color: 'bg-blue-100 text-blue-800' },
  { value: 'in_transit', label: 'In Transit', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'exception', label: 'Exception', color: 'bg-red-100 text-red-800' }
];

// Special handling options
const specialHandlingOptions = [
  { value: 'fragile', label: 'Fragile', icon: <FiAlertCircle className="w-4 h-4" /> },
  { value: 'perishable', label: 'Perishable', icon: <FiDroplet className="w-4 h-4" /> },
  { value: 'hazardous', label: 'Hazardous', icon: <FaFireFlameCurved className="w-4 h-4" /> },
  { value: 'live_animals', label: 'Live Animals', icon: <FiInfo className="w-4 h-4" /> },
  { value: 'medical', label: 'Medical Supplies', icon: <FiInfo className="w-4 h-4" /> },
  { value: 'high_value', label: 'High Value', icon: <FiTag className="w-4 h-4" /> }
];

interface ImageFile {
  file: File;
  preview: string;
  type: ImageType;
  isPrimary: boolean;
}

export default function CreatePackageForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  
  // Image upload state
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  
  const [formData, setFormData] = useState({
    // Basic Info
    tracking_number: '',
    service_type: 'CargoPulse Express',
    service_category: 'express' as ServiceCategory,
    service_level: 'Priority',
    
    // Sender Info
    sender_name: '',
    sender_address: '',
    sender_city: '',
    sender_country: 'US',
    
    // Recipient Info
    recipient_name: '',
    recipient_address: '',
    recipient_city: '',
    recipient_country: 'US',
    
    // Package Details
    package_type: 'parcel' as PackageType,
    pieces: 1,
    weight: '',
    dimensions: '',
    special_handling: [] as string[],
    reference_numbers: {} as Record<string, string>,
    is_fragile: false,
    is_perishable: false,
    is_hazardous: false,
    contents_description: '',
    department: '',
    project_code: '',
    
    // Location Tracking (for map)
    origin_country: 'US',
    origin_city: '',
    current_country: 'US',
    current_city: '',
    destination_country: 'US',
    destination_city: '',
    
    // Delivery
    estimated_delivery: '',
    initial_status: 'pending' as const
  });

  // Reference number fields
  const [referenceFields, setReferenceFields] = useState([
    { key: 'po_number', value: '' },
    { key: 'invoice_number', value: '' }
  ]);

  // Update formData when reference fields change
  useEffect(() => {
    const references: Record<string, string> = {};
    referenceFields.forEach(field => {
      if (field.key && field.value) {
        references[field.key] = field.value;
      }
    });
    setFormData(prev => ({
      ...prev,
      reference_numbers: references
    }));
  }, [referenceFields]);

  // Auto-populate cities from addresses
  useEffect(() => {
    if (formData.sender_address && !formData.origin_city) {
      const city = extractCityFromAddress(formData.sender_address);
      setFormData(prev => ({ ...prev, origin_city: city }));
    }
  }, [formData.sender_address]);

  useEffect(() => {
    if (formData.recipient_address && !formData.destination_city) {
      const city = extractCityFromAddress(formData.recipient_address);
      setFormData(prev => ({ ...prev, destination_city: city }));
    }
  }, [formData.recipient_address]);

  // Clean up image previews on unmount
  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  const serviceTypes = [
    'CargoPulse Express',
    'CargoPulse Ground',
    'CargoPulse International',
    'CargoPulse Freight',
    'CargoPulse SameDay'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSpecialHandlingToggle = (value: string) => {
    setFormData(prev => {
      const current = [...prev.special_handling];
      const index = current.indexOf(value);
      
      if (index === -1) {
        current.push(value);
      } else {
        current.splice(index, 1);
      }
      
      return {
        ...prev,
        special_handling: current
      };
    });
  };

  const handleReferenceFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...referenceFields];
    updated[index] = { ...updated[index], [field]: value };
    setReferenceFields(updated);
  };

  const addReferenceField = () => {
    setReferenceFields([...referenceFields, { key: '', value: '' }]);
  };

  const removeReferenceField = (index: number) => {
    if (referenceFields.length > 1) {
      setReferenceFields(referenceFields.filter((_, i) => i !== index));
    }
  };

  const generateTrackingNumber = () => {
    const prefix = 'CGP';
    const randomNum = Math.floor(100000000 + Math.random() * 900000000);
    const timestamp = Date.now().toString().slice(-4);
    setFormData(prev => ({
      ...prev,
      tracking_number: `${prefix}${randomNum}${timestamp}`
    }));
  };

  const handleUseSenderAsCurrent = () => {
    setFormData(prev => ({
      ...prev,
      current_country: prev.sender_country,
      current_city: prev.sender_city || extractCityFromAddress(prev.sender_address)
    }));
  };

  const handleUseRecipientAsDestination = () => {
    setFormData(prev => ({
      ...prev,
      destination_country: prev.recipient_country,
      destination_city: prev.recipient_city || extractCityFromAddress(prev.recipient_address)
    }));
  };

  // Image upload handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: 'package' as ImageType,
      isPrimary: images.length === 0 && files.indexOf(file) === 0 // First image is primary
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // If we removed the primary image, set the first image as primary
      if (prev[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      return newImages;
    });
  };

  const setImageAsPrimary = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index
    })));
  };

  const updateImageType = (index: number, type: ImageType) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, type } : img
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log("[Form] Submitting package with", images.length, "images");

      // Prepare data for API
      const submitData: CreatePackageData = {
        ...formData,
        origin_country: formData.origin_country || formData.sender_country,
        origin_city: formData.origin_city || extractCityFromAddress(formData.sender_address),
        destination_country: formData.destination_country || formData.recipient_country,
        destination_city: formData.destination_city || extractCityFromAddress(formData.recipient_address),
        current_country: formData.current_country || formData.sender_country,
        current_city: formData.current_city || extractCityFromAddress(formData.sender_address),
        // Add images to the submission
        images: images.map(img => ({
          file: img.file,
          image_type: img.type,
          is_primary: img.isPrimary
        }))
      };

      console.log("[Form] Submitting data with images");
      const result = await createPackage(submitData);
      
      if (result.error) {
        console.error("[Form] Submission error:", result.error);
        setError(result.error);
      } else {
        console.log("[Form] Package created successfully:", result.package?.tracking_number);
        setSuccess('Package created successfully! The package will appear on the tracking map.');
        
        // Reset form
        setFormData({
          tracking_number: '',
          service_type: 'CargoPulse Express',
          service_category: 'express',
          service_level: 'Priority',
          sender_name: '',
          sender_address: '',
          sender_city: '',
          sender_country: 'US',
          recipient_name: '',
          recipient_address: '',
          recipient_city: '',
          recipient_country: 'US',
          package_type: 'parcel',
          pieces: 1,
          weight: '',
          dimensions: '',
          special_handling: [],
          reference_numbers: {},
          is_fragile: false,
          is_perishable: false,
          is_hazardous: false,
          contents_description: '',
          department: '',
          project_code: '',
          origin_country: 'US',
          origin_city: '',
          current_country: 'US',
          current_city: '',
          destination_country: 'US',
          destination_city: '',
          estimated_delivery: '',
          initial_status: 'pending'
        });
        
        // Clear images
        setImages([]);
        setReferenceFields([
          { key: 'po_number', value: '' },
          { key: 'invoice_number', value: '' }
        ]);
      }
    } catch (err) {
      console.error("[Form] Unexpected error:", err);
      setError('Failed to create package');
    } finally {
      setIsLoading(false);
    }
  };

  const extractCityFromAddress = (address: string): string => {
    const parts = address.split(',');
    return parts[0]?.trim() || '';
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiInfo },
    { id: 'sender', label: 'Sender', icon: FiUser },
    { id: 'recipient', label: 'Recipient', icon: FiMapPin },
    { id: 'package', label: 'Package Details', icon: FiPackage },
    { id: 'location', label: 'Map Location', icon: FiGlobe },
    { id: 'references', label: 'Images & References', icon: FiImage }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FiPackage className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Create New Package</h1>
              <p className="text-purple-100 mt-1">Add a new shipment with map tracking and image support</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-8">
          <nav className="flex space-x-8 -mb-px overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <AnimatePresence mode="wait">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <motion.div
                key="basic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tracking Number *
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        name="tracking_number"
                        value={formData.tracking_number}
                        onChange={handleChange}
                        placeholder="CGP123456789"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={generateTrackingNumber}
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors whitespace-nowrap"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Type *
                    </label>
                    <select
                      name="service_type"
                      value={formData.service_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      required
                    >
                      {serviceTypes.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Category
                    </label>
                    <select
                      name="service_category"
                      value={formData.service_category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                      {serviceCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Level
                    </label>
                    <select
                      name="service_level"
                      value={formData.service_level}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                      {serviceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Initial Status
                    </label>
                    <select
                      name="initial_status"
                      value={formData.initial_status}
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
                      Estimated Delivery
                    </label>
                    <input
                      type="datetime-local"
                      name="estimated_delivery"
                      value={formData.estimated_delivery}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sender Tab */}
            {activeTab === 'sender' && (
              <motion.div
                key="sender"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sender Name *
                    </label>
                    <input
                      type="text"
                      name="sender_name"
                      value={formData.sender_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sender Country *
                    </label>
                    <select
                      name="sender_country"
                      value={formData.sender_country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      required
                    >
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sender Address *
                    </label>
                    <input
                      type="text"
                      name="sender_address"
                      value={formData.sender_address}
                      onChange={handleChange}
                      placeholder="123 Main St, City, State, ZIP"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sender City
                    </label>
                    <input
                      type="text"
                      name="sender_city"
                      value={formData.sender_city}
                      onChange={handleChange}
                      placeholder="New York"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Department (Optional)
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Shipping Dept"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recipient Tab */}
            {activeTab === 'recipient' && (
              <motion.div
                key="recipient"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      name="recipient_name"
                      value={formData.recipient_name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recipient Country *
                    </label>
                    <select
                      name="recipient_country"
                      value={formData.recipient_country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      required
                    >
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recipient Address *
                    </label>
                    <input
                      type="text"
                      name="recipient_address"
                      value={formData.recipient_address}
                      onChange={handleChange}
                      placeholder="456 Oak Ave, City, State, ZIP"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recipient City
                    </label>
                    <input
                      type="text"
                      name="recipient_city"
                      value={formData.recipient_city}
                      onChange={handleChange}
                      placeholder="Los Angeles"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="project_code"
                      value={formData.project_code}
                      onChange={handleChange}
                      placeholder="PROJ-2024-001"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Package Details Tab */}
            {activeTab === 'package' && (
              <motion.div
                key="package"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Package Type *
                    </label>
                    <select
                      name="package_type"
                      value={formData.package_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      required
                    >
                      {packageTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Pieces
                    </label>
                    <input
                      type="number"
                      name="pieces"
                      value={formData.pieces}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contents Description
                    </label>
                    <input
                      type="text"
                      name="contents_description"
                      value={formData.contents_description}
                      onChange={handleChange}
                      placeholder="Electronics, Documents, etc."
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
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="2.5 kg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleChange}
                      placeholder="30 × 20 × 10 cm"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Special Handling */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Special Handling
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {specialHandlingOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSpecialHandlingToggle(option.value)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl border-2 transition-all ${
                          formData.special_handling.includes(option.value)
                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        {option.icon}
                        <span className="text-sm font-medium">{option.label}</span>
                        {formData.special_handling.includes(option.value) && (
                          <FiCheckCircle className="w-4 h-4 ml-auto text-purple-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Safety Flags */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name="is_fragile"
                      checked={formData.is_fragile}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div className="flex items-center space-x-2">
                      <FiAlertCircle className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium text-gray-700">Fragile</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name="is_perishable"
                      checked={formData.is_perishable}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div className="flex items-center space-x-2">
                      <FiDroplet className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-gray-700">Perishable</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name="is_hazardous"
                      checked={formData.is_hazardous}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div className="flex items-center space-x-2">
                      <FaFireFlameCurved className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-gray-700">Hazardous</span>
                    </div>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Map Location Tab */}
            {activeTab === 'location' && (
              <motion.div
                key="location"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-2 text-purple-700">
                    <FiGlobe className="w-5 h-5" />
                    <span className="font-medium">Map Tracking Configuration</span>
                  </div>
                  <p className="text-sm text-purple-600 mt-1">
                    These locations will determine the airplane movement on the tracking map.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Origin */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <FiHome className="w-4 h-4 text-purple-600" />
                      <span>Origin Country</span>
                    </h4>
                    <select
                      name="origin_country"
                      value={formData.origin_country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="origin_city"
                      value={formData.origin_city}
                      onChange={handleChange}
                      placeholder="Origin City"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  {/* Current Location */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <FiNavigation className="w-4 h-4 text-blue-600" />
                      <span>Current Location</span>
                    </h4>
                    <select
                      name="current_country"
                      value={formData.current_country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="current_city"
                      value={formData.current_city}
                      onChange={handleChange}
                      placeholder="Current City"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleUseSenderAsCurrent}
                      className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center space-x-1"
                    >
                      <FiHome className="w-4 h-4" />
                      <span>Use sender country</span>
                    </button>
                  </div>

                  {/* Destination */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <FiMapPin className="w-4 h-4 text-green-600" />
                      <span>Destination</span>
                    </h4>
                    <select
                      name="destination_country"
                      value={formData.destination_country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="destination_city"
                      value={formData.destination_city}
                      onChange={handleChange}
                      placeholder="Destination City"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleUseRecipientAsDestination}
                      className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center space-x-1"
                    >
                      <FiMapPin className="w-4 h-4" />
                      <span>Use recipient country</span>
                    </button>
                  </div>
                </div>

                {/* Map Preview Placeholder */}
                <div className="mt-6 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="flex items-center justify-center space-x-3 text-gray-500">
                    <FiGlobe className="w-6 h-6" />
                    <span>Map preview will show airplane from {countries.find(c => c.code === formData.origin_country)?.name} to {countries.find(c => c.code === formData.destination_country)?.name}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Images & References Tab */}
            {activeTab === 'references' && (
              <motion.div
                key="references"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Image Upload Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <FiImage className="w-5 h-5 text-purple-600" />
                      <span>Package Images </span>
                    </h4>
                    <span className="text-xs text-gray-500">Max 10 images</span>
                  </div>

                  {/* Upload Area */}
                  <div className="mb-6">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleImageUpload}
                        disabled={images.length >= 10}
                      />
                    </label>
                  </div>

                  {/* Image Preview Grid */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                            <img
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Primary Badge */}
                            {image.isPrimary && (
                              <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                                <FiStar className="w-3 h-3" />
                                <span>Primary</span>
                              </div>
                            )}

                            {/* Image Type Selector */}
                            <select
                              value={image.type}
                              onChange={(e) => updateImageType(index, e.target.value as ImageType)}
                              className="absolute top-2 right-2 text-xs bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {imageTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>

                            {/* Action Buttons */}
                            <div className="absolute bottom-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                              {!image.isPrimary && (
                                <button
                                  type="button"
                                  onClick={() => setImageAsPrimary(index)}
                                  className="bg-blue-500 text-white p-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                                  title="Set as primary"
                                >
                                  <FiStar className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors ml-auto"
                                title="Remove image"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Upload Progress (if any) */}
                            {uploadProgress[image.file.name] && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reference Numbers Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <FiTag className="w-5 h-5 text-purple-600" />
                    <span>Reference Numbers</span>
                  </h4>
                  <div className="space-y-3">
                    {referenceFields.map((field, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={field.key}
                          onChange={(e) => handleReferenceFieldChange(index, 'key', e.target.value)}
                          placeholder="Reference type (e.g., PO#)"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => handleReferenceFieldChange(index, 'value', e.target.value)}
                          placeholder="Reference value"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        />
                        {referenceFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeReferenceField(index)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addReferenceField}
                      className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-medium mt-2"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Reference</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Summary */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <FiPackage className="w-5 h-5 text-purple-600" />
              <span>Package Summary</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Tracking:</span>
                <p className="font-semibold">{formData.tracking_number || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-500">Service:</span>
                <p className="font-semibold">{formData.service_type}</p>
              </div>
              <div>
                <span className="text-gray-500">From:</span>
                <p className="font-semibold">{countries.find(c => c.code === formData.origin_country)?.name}</p>
              </div>
              <div>
                <span className="text-gray-500">To:</span>
                <p className="font-semibold">{countries.find(c => c.code === formData.destination_country)?.name}</p>
              </div>
              <div>
                <span className="text-gray-500">Package Type:</span>
                <p className="font-semibold capitalize">{formData.package_type}</p>
              </div>
              <div>
                <span className="text-gray-500">Pieces:</span>
                <p className="font-semibold">{formData.pieces}</p>
              </div>
              <div>
                <span className="text-gray-500">Images:</span>
                <p className="font-semibold">{images.length} uploaded</p>
              </div>
              {formData.is_fragile && (
                <div>
                  <span className="text-gray-500">Special:</span>
                  <p className="font-semibold text-yellow-600">Fragile</p>
                </div>
              )}
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className="text-red-700 font-medium flex items-center space-x-2">
                <FiAlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl"
            >
              <p className="text-green-700 font-medium flex items-center space-x-2">
                <FiCheckCircle className="w-5 h-5" />
                <span>{success}</span>
              </p>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-4 rounded-xl font-semibold text-lg flex items-center space-x-3 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
              } text-white transition-all shadow-lg`}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Package...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  <span>Create Package</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}