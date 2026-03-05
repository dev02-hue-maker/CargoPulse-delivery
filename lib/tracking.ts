/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/tracking.ts
"use server";

import { supabase } from "./supabaseClient";
import { v2 as cloudinary } from 'cloudinary';

// ============================================
// CLOUDINARY CONFIGURATION
// ============================================
console.log("[Cloudinary] Initializing Cloudinary configuration");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("[Cloudinary] Configuration complete", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing',
  api_key: process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing',
});

// ============================================
// ENHANCED TYPES FOR PHASE 1
// ============================================

export type PackageStatus = 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
export type PackageType = 'document' | 'parcel' | 'pallet' | 'crate' | 'envelope' | 'other';
export type ServiceCategory = 'express' | 'ground' | 'freight' | 'international' | 'same_day';
export type ImageType = 'package' | 'label' | 'delivery_proof' | 'signature' | 'other';

export interface PackageImage {
  id: string;
  package_id: string;
  image_url: string;
  image_public_id: string;
  image_type: ImageType;
  uploaded_by: string;
  uploaded_at: string;
  is_primary: boolean;
  sort_order: number;
  metadata: any;
}

export interface LocationHistory {
  id: string;
  package_id: string;
  country: string;
  city?: string;
  coordinates?: { lat: number; lng: number };
  status: PackageStatus;
  updated_at: string;
  metadata?: any;
}

export interface CountryCoordinates {
  country_code: string;
  country_name: string;
  latitude: number;
  longitude: number;
  map_center: { lat: number; lng: number };
  bounding_box?: any;
}

export interface TrackingPackage {
  id: string;
  tracking_number: string;
  status: PackageStatus;
  service_type: string;
  service_category?: ServiceCategory;
  service_level?: string;
  recipient_name: string;
  recipient_address: string;
  recipient_city?: string;
  sender_name: string;
  sender_address: string;
  sender_city?: string;
  
  // Country fields for map tracking
  origin_country?: string;
  origin_city?: string;
  current_country?: string;
  current_city?: string;
  destination_country?: string;
  destination_city?: string;
  
  // Enhanced package details
  package_type?: PackageType;
  pieces?: number;
  weight?: string;
  dimensions?: string;
  special_handling?: string[];
  reference_numbers?: Record<string, string>;
  is_fragile?: boolean;
  is_perishable?: boolean;
  is_hazardous?: boolean;
  contents_description?: string;
  department?: string;
  project_code?: string;
  
  // Delivery info
  estimated_delivery?: string;
  actual_delivery?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Virtual fields (from view)
  origin_country_name?: string;
  current_country_name?: string;
  destination_country_name?: string;
  origin_coordinates?: { lat: number; lng: number };
  current_coordinates?: { lat: number; lng: number };
  destination_coordinates?: { lat: number; lng: number };
  location_history?: LocationHistory[];
}

export interface TrackingEvent {
  id: string;
  package_id: string;
  status: PackageStatus;
  description: string;
  location: string;
  location_country?: string;
  location_city?: string;
  event_timestamp: string;
  created_at: string;
  metadata?: any;
}

export interface TrackingDetails {
  package: TrackingPackage;
  events: TrackingEvent[];
  images?: PackageImage[];
}

// ============================================
// ENHANCED CREATE PACKAGE DATA TYPE
// ============================================

export interface CreatePackageData {
  // Basic Info
  tracking_number: string;
  service_type: string;
  service_category?: ServiceCategory;
  service_level?: string;
  
  // Sender Info
  sender_name: string;
  sender_address: string;
  sender_city?: string;
  sender_country?: string;
  
  // Recipient Info
  recipient_name: string;
  recipient_address: string;
  recipient_city?: string;
  recipient_country?: string;
  
  // Package Details
  package_type?: PackageType;
  pieces?: number;
  weight?: string;
  dimensions?: string;
  special_handling?: string[];
  reference_numbers?: Record<string, string>;
  is_fragile?: boolean;
  is_perishable?: boolean;
  is_hazardous?: boolean;
  contents_description?: string;
  department?: string;
  project_code?: string;
  
  // Location Tracking (for map)
  origin_country?: string;
  origin_city?: string;
  current_country?: string;
  current_city?: string;
  destination_country?: string;
  destination_city?: string;
  
  // Delivery
  estimated_delivery?: string;
  initial_status?: PackageStatus;
  
  // Images (for Cloudinary upload)
  images?: {
    image_type: ImageType;
    file?: File;
    url?: string;
    is_primary?: boolean;
  }[];
}

export interface UpdatePackageData {
  tracking_number?: string;
  status?: PackageStatus;
  service_type?: string;
  service_category?: ServiceCategory;
  service_level?: string;
  recipient_name?: string;
  recipient_address?: string;
  recipient_city?: string;
  recipient_country?: string;
  sender_name?: string;
  sender_address?: string;
  sender_city?: string;
  sender_country?: string;
  weight?: string;
  dimensions?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  
  // New fields
  package_type?: PackageType;
  pieces?: number;
  special_handling?: string[];
  reference_numbers?: Record<string, string>;
  is_fragile?: boolean;
  is_perishable?: boolean;
  is_hazardous?: boolean;
  contents_description?: string;
  department?: string;
  project_code?: string;
  
  // Location fields
  origin_country?: string;
  origin_city?: string;
  current_country?: string;
  current_city?: string;
  destination_country?: string;
  destination_city?: string;
}

// ============================================
// CLOUDINARY UPLOAD FUNCTION
// ============================================

export async function uploadToCloudinary(
  file: File | Buffer,
  options?: {
    folder?: string;
    public_id?: string;
    transformation?: any;
    tags?: string[];
  }
): Promise<{
  url?: string;
  public_id?: string;
  error?: string;
}> {
  console.log("[Cloudinary] Starting upload process", {
    hasFile: !!file,
    fileType: file instanceof File ? file.type : 'Buffer',
    options: options ? JSON.stringify(options) : 'none'
  });

  try {
    // Convert file to base64 if it's a File object
    let fileBuffer: Buffer;
    let fileBase64: string;

    if (file instanceof File) {
      console.log("[Cloudinary] Converting File to Buffer");
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      fileBase64 = fileBuffer.toString('base64');
      console.log("[Cloudinary] File converted successfully", {
        size: fileBuffer.length,
        mimeType: file.type
      });
    } else {
      fileBuffer = file;
      fileBase64 = fileBuffer.toString('base64');
      console.log("[Cloudinary] Using provided Buffer", {
        size: fileBuffer.length
      });
    }

    // Prepare upload options
    const uploadOptions: any = {
      folder: options?.folder || 'cargopulse',
      resource_type: 'auto',
    };

    if (options?.public_id) {
      uploadOptions.public_id = options.public_id;
      console.log("[Cloudinary] Using custom public_id:", options.public_id);
    }

    if (options?.transformation) {
      uploadOptions.transformation = options.transformation;
    }

    if (options?.tags) {
      uploadOptions.tags = options.tags;
    }

    console.log("[Cloudinary] Uploading to cloud with options:", uploadOptions);

    // Define the callback type
    type UploadCallback = (error: any, result: any) => void;

    // Upload to Cloudinary with proper typing
    const result = await new Promise<any>((resolve, reject) => {
      const callback: UploadCallback = (error, result) => {
        if (error) {
          console.error("[Cloudinary] Upload error:", error);
          reject(error);
        } else {
          console.log("[Cloudinary] Upload successful:", {
            public_id: result?.public_id,
            url: result?.secure_url,
            format: result?.format,
            size: result?.bytes
          });
          resolve(result);
        }
      };
      
      cloudinary.uploader.upload(
        `data:image/jpeg;base64,${fileBase64}`,
        uploadOptions,
        callback
      );
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };

  } catch (error) {
    console.error("[Cloudinary] Upload failed:", error);
    return { error: "Failed to upload image to Cloudinary" };
  }
}

// ============================================
// DELETE IMAGE FROM CLOUDINARY
// ============================================

export async function deleteFromCloudinary(publicId: string): Promise<{
  success?: boolean;
  error?: string;
}> {
  console.log("[Cloudinary] Deleting image:", publicId);

  try {
    // Define the callback type
    type DeleteCallback = (error: any, result: any) => void;

    const result = await new Promise<any>((resolve, reject) => {
      const callback: DeleteCallback = (error, result) => {
        if (error) {
          console.error("[Cloudinary] Delete error:", error);
          reject(error);
        } else {
          console.log("[Cloudinary] Delete successful:", result);
          resolve(result);
        }
      };
      
      cloudinary.uploader.destroy(publicId, callback);
    });

    return { success: true };
  } catch (error) {
    console.error("[Cloudinary] Delete failed:", error);
    return { error: "Failed to delete image from Cloudinary" };
  }
}

// ============================================
// MAIN FUNCTIONS
// ============================================

// Get tracking details by tracking number (enhanced with map data)
export async function getTrackingDetails(trackingNumber: string): Promise<{
  trackingDetails?: TrackingDetails;
  error?: string;
}> {
  try {
    console.log(`[getTrackingDetails] 🚀 Fetching details for: ${trackingNumber}`);

    // First get the basic package data
    const { data: packageData, error: packageError } = await supabase
      .from("tracking_packages")
      .select("*")
      .eq("tracking_number", trackingNumber)
      .single();

    if (packageError) {
      console.error("[getTrackingDetails] ❌ Error fetching package:", packageError);
      return { error: "Tracking number not found" };
    }

    if (!packageData) {
      console.error("[getTrackingDetails] ❌ No package found");
      return { error: "Tracking number not found" };
    }

    console.log("[getTrackingDetails] ✅ Package found:", {
      id: packageData.id,
      tracking_number: packageData.tracking_number,
      current_country: packageData.current_country,
      destination_country: packageData.destination_country
    });

    // Get country coordinates for map
    const { data: countryData, error: countryError } = await supabase
      .from("country_coordinates")
      .select("*")
      .in("country_code", [
        packageData.origin_country,
        packageData.current_country,
        packageData.destination_country
      ].filter(Boolean));

    if (countryError) {
      console.error("[getTrackingDetails] ⚠️ Error fetching country coordinates:", countryError);
    }

    // Create a map of country coordinates
    const countryMap = (countryData || []).reduce((acc: any, country: any) => {
      acc[country.country_code] = {
        name: country.country_name,
        coordinates: country.map_center,
        latitude: country.latitude,
        longitude: country.longitude
      };
      return acc;
    }, {});

    console.log("[getTrackingDetails] 🗺️ Country coordinates loaded:", Object.keys(countryMap));

    // Get tracking events
    const { data: eventsData, error: eventsError } = await supabase
      .from("tracking_events")
      .select("*")
      .eq("package_id", packageData.id)
      .order("event_timestamp", { ascending: false });

    if (eventsError) {
      console.error("[getTrackingDetails] ⚠️ Error fetching events:", eventsError);
    }

    // Get location history for map animation
    const { data: locationHistory, error: historyError } = await supabase
      .from("location_history")
      .select("*")
      .eq("package_id", packageData.id)
      .order("updated_at", { ascending: true });

    if (historyError) {
      console.error("[getTrackingDetails] ⚠️ Error fetching location history:", historyError);
    }

    // Get package images
    const { data: imagesData, error: imagesError } = await supabase
      .from("package_images")
      .select("*")
      .eq("package_id", packageData.id)
      .order("sort_order", { ascending: true });

    if (imagesError) {
      console.error("[getTrackingDetails] ⚠️ Error fetching images:", imagesError);
    }

    console.log(`[getTrackingDetails] 📸 Found ${imagesData?.length || 0} images`);

    // Enhance package data with country information
    const enhancedPackage = {
      ...packageData,
      origin_country_name: countryMap[packageData.origin_country]?.name,
      current_country_name: countryMap[packageData.current_country]?.name,
      destination_country_name: countryMap[packageData.destination_country]?.name,
      origin_coordinates: countryMap[packageData.origin_country]?.coordinates,
      current_coordinates: countryMap[packageData.current_country]?.coordinates,
      destination_coordinates: countryMap[packageData.destination_country]?.coordinates,
      location_history: locationHistory || []
    };

    const trackingDetails: TrackingDetails = {
      package: enhancedPackage as TrackingPackage,
      events: (eventsData || []) as TrackingEvent[],
      images: (imagesData || []) as PackageImage[]
    };

    console.log("[getTrackingDetails] ✅ Success! Returning tracking details:", {
      tracking_number: trackingNumber,
      events: trackingDetails.events.length,
      images: trackingDetails.images?.length,
      current_location: enhancedPackage.current_country_name,
      destination: enhancedPackage.destination_country_name
    });

    return { trackingDetails };
  } catch (err) {
    console.error("[getTrackingDetails] 💥 Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}
// ============================================
// ENHANCED CREATE PACKAGE WITH PHASE 1 FEATURES
// ============================================

export async function createPackage(packageData: CreatePackageData): Promise<{
  package?: TrackingPackage;
  error?: string;
}> {
  try {
    console.log("[createPackage] Creating new package:", {
      tracking_number: packageData.tracking_number,
      hasImages: !!(packageData.images && packageData.images.length > 0),
      imageCount: packageData.images?.length || 0
    });

    // Check if tracking number already exists
    const { data: existingPackage } = await supabase
      .from("tracking_packages")
      .select("tracking_number")
      .eq("tracking_number", packageData.tracking_number)
      .single();

    if (existingPackage) {
      console.log("[createPackage] Tracking number already exists:", packageData.tracking_number);
      return { error: "Tracking number already exists" };
    }

    // Auto-populate country fields if not provided
    const originCountry = packageData.origin_country || await extractCountryFromAddress(packageData.sender_address);
    const destCountry = packageData.destination_country || await extractCountryFromAddress(packageData.recipient_address);
    const currentCountry = packageData.current_country || originCountry;

    // Auto-populate city fields
    const originCity = packageData.origin_city || extractCityFromAddress(packageData.sender_address);
    const destCity = packageData.destination_city || extractCityFromAddress(packageData.recipient_address);
    const currentCity = packageData.current_city || originCity;

    // Format full location strings
    const currentLocation = `${currentCity}, ${currentCountry}`;
    const destination = `${destCity}, ${destCountry}`;
    const lastLocation = `${originCity}, ${originCountry}`;

    // Build the package object with all new fields including location fields
    const packageToCreate = {
      // Basic Info
      tracking_number: packageData.tracking_number,
      status: packageData.initial_status || 'pending',
      service_type: packageData.service_type,
      service_category: packageData.service_category,
      service_level: packageData.service_level,
      
      // Sender Info
      sender_name: packageData.sender_name,
      sender_address: packageData.sender_address,
      sender_city: packageData.sender_city || extractCityFromAddress(packageData.sender_address),
      
      // Recipient Info
      recipient_name: packageData.recipient_name,
      recipient_address: packageData.recipient_address,
      recipient_city: packageData.recipient_city || extractCityFromAddress(packageData.recipient_address),
      
      // Package Details
      package_type: packageData.package_type || 'parcel',
      pieces: packageData.pieces || 1,
      weight: packageData.weight,
      dimensions: packageData.dimensions,
      special_handling: packageData.special_handling || [],
      reference_numbers: packageData.reference_numbers || {},
      is_fragile: packageData.is_fragile || false,
      is_perishable: packageData.is_perishable || false,
      is_hazardous: packageData.is_hazardous || false,
      contents_description: packageData.contents_description,
      department: packageData.department,
      project_code: packageData.project_code,
      
      // Location Tracking (for map) - Individual components
      origin_country: originCountry,
      origin_city: originCity,
      current_country: currentCountry,
      current_city: currentCity,
      destination_country: destCountry,
      destination_city: destCity,
      
      // Location Tracking - Combined fields (for backward compatibility)
      current_location: currentLocation,
      destination: destination,
      last_location: lastLocation,
      
      // Delivery
      estimated_delivery: packageData.estimated_delivery,
    };

    console.log("[createPackage] Inserting package into database:", packageToCreate);

    const { data, error } = await supabase
      .from("tracking_packages")
      .insert([packageToCreate])
      .select()
      .single();

    if (error) {
      console.error("[createPackage] Error creating package:", error);
      return { error: "Failed to create package" };
    }

    console.log("[createPackage] Package created successfully with ID:", data.id);

    // Create initial tracking event with country info
    const initialLocation = `${originCity}, ${originCountry}`;
    const initialEvent = {
      package_id: data.id,
      status: packageData.initial_status || 'pending',
      description: getStatusDescription(packageData.initial_status || 'pending'),
      location: initialLocation,
      location_country: originCountry,
      location_city: originCity,
      event_timestamp: new Date().toISOString(),
      metadata: {
        origin: originCountry,
        destination: destCountry
      }
    };

    console.log("[createPackage] Creating initial tracking event");
    await supabase
      .from("tracking_events")
      .insert([initialEvent]);

    // Add initial location history for map animation
    console.log("[createPackage] Adding location history");
    await supabase
      .from("location_history")
      .insert([{
        package_id: data.id,
        country: originCountry,
        city: originCity,
        location: initialLocation,
        status: packageData.initial_status || 'pending',
        updated_at: new Date().toISOString(),
        metadata: {
          type: 'initial'
        }
      }]);

    // Handle image uploads if any
    if (packageData.images && packageData.images.length > 0) {
      console.log(`[createPackage] Processing ${packageData.images.length} images for upload`);
      
      for (let i = 0; i < packageData.images.length; i++) {
        const image = packageData.images[i];
        
        if (image.file) {
          console.log(`[createPackage] Uploading image ${i + 1}/${packageData.images.length}:`, {
            type: image.image_type,
            isPrimary: image.is_primary
          });

          // Upload to Cloudinary
          const uploadResult = await uploadToCloudinary(image.file, {
            folder: `cargopulse/${data.tracking_number}`,
            tags: [data.tracking_number, image.image_type],
          });

          if (uploadResult.error) {
            console.error(`[createPackage] Failed to upload image ${i + 1}:`, uploadResult.error);
            continue;
          }

          if (uploadResult.url && uploadResult.public_id) {
            console.log(`[createPackage] Image uploaded successfully:`, {
              url: uploadResult.url,
              public_id: uploadResult.public_id
            });

            // Add to database
            const imageResult = await addPackageImage(data.id, {
              image_url: uploadResult.url,
              image_public_id: uploadResult.public_id,
              image_type: image.image_type,
              is_primary: image.is_primary || false,
              sort_order: i,
              metadata: {
                uploaded_via: 'create_package',
                original_filename: image.file.name
              }
            });

            if (imageResult.error) {
              console.error(`[createPackage] Failed to save image record ${i + 1}:`, imageResult.error);
            } else {
              console.log(`[createPackage] Image record saved successfully`);
            }
          }
        } else if (image.url) {
          // Handle pre-uploaded images (just save the reference)
          console.log(`[createPackage] Saving pre-uploaded image reference:`, image.url);
          
          await addPackageImage(data.id, {
            image_url: image.url,
            image_public_id: '', // No public_id for external images
            image_type: image.image_type,
            is_primary: image.is_primary || false,
            sort_order: i,
            metadata: {
              uploaded_via: 'external'
            }
          });
        }
      }
      
      console.log("[createPackage] All images processed");
    }

    console.log("[createPackage] Fetching complete package with map data");
    // Fetch the complete package with map data
    const { data: completePackage } = await supabase
      .from("package_tracking_with_map")
      .select("*")
      .eq("id", data.id)
      .single();

    console.log("[createPackage] Package creation complete");
    return { package: completePackage as TrackingPackage };
  } catch (err) {
    console.error("[createPackage] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
} 
// ============================================
// IMAGE MANAGEMENT FUNCTIONS (for Cloudinary)
// ============================================

export async function uploadAndAddPackageImage(
  packageId: string,
  file: File,
  imageData: {
    image_type: ImageType;
    is_primary?: boolean;
    sort_order?: number;
  }
): Promise<{
  image?: PackageImage;
  error?: string;
}> {
  console.log(`[uploadAndAddPackageImage] Starting for package: ${packageId}`, {
    type: imageData.image_type,
    isPrimary: imageData.is_primary
  });

  try {
    // First get package details for folder structure
    const { data: packageData, error: packageError } = await supabase
      .from("tracking_packages")
      .select("tracking_number")
      .eq("id", packageId)
      .single();

    if (packageError || !packageData) {
      console.error("[uploadAndAddPackageImage] Package not found:", packageId);
      return { error: "Package not found" };
    }

    console.log("[uploadAndAddPackageImage] Found package:", packageData.tracking_number);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(file, {
      folder: `cargopulse/${packageData.tracking_number}`,
      tags: [packageData.tracking_number, imageData.image_type],
    });

    if (uploadResult.error) {
      console.error("[uploadAndAddPackageImage] Upload failed:", uploadResult.error);
      return { error: uploadResult.error };
    }

    if (!uploadResult.url || !uploadResult.public_id) {
      console.error("[uploadAndAddPackageImage] Upload returned no URL/public_id");
      return { error: "Upload failed - no URL returned" };
    }

    console.log("[uploadAndAddPackageImage] Upload successful:", {
      url: uploadResult.url,
      public_id: uploadResult.public_id
    });

    // Add to database
    const result = await addPackageImage(packageId, {
      image_url: uploadResult.url,
      image_public_id: uploadResult.public_id,
      image_type: imageData.image_type,
      is_primary: imageData.is_primary,
      sort_order: imageData.sort_order || 0,
      metadata: {
        uploaded_via: 'direct_upload',
        original_filename: file.name,
        file_size: file.size,
        file_type: file.type
      }
    });

    if (result.error) {
      console.error("[uploadAndAddPackageImage] Database insert failed:", result.error);
      return { error: result.error };
    }

    console.log("[uploadAndAddPackageImage] Complete! Image saved to database");
    return { image: result.image };
  } catch (err) {
    console.error("[uploadAndAddPackageImage] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

export async function addPackageImage(
  packageId: string,
  imageData: {
    image_url: string;
    image_public_id: string;
    image_type: ImageType;
    is_primary?: boolean;
    sort_order?: number;
    metadata?: any;
  }
): Promise<{
  image?: PackageImage;
  error?: string;
}> {
  try {
    console.log(`[addPackageImage] Adding image to package: ${packageId}`, {
      type: imageData.image_type,
      isPrimary: imageData.is_primary,
      hasPublicId: !!imageData.image_public_id
    });

    // If this is primary, unset any other primary images
    if (imageData.is_primary) {
      console.log("[addPackageImage] Unsetting previous primary images");
      await supabase
        .from("package_images")
        .update({ is_primary: false })
        .eq("package_id", packageId);
    }

    const { data, error } = await supabase
      .from("package_images")
      .insert([{
        package_id: packageId,
        image_url: imageData.image_url,
        image_public_id: imageData.image_public_id,
        image_type: imageData.image_type,
        is_primary: imageData.is_primary || false,
        sort_order: imageData.sort_order || 0,
        metadata: imageData.metadata || {},
        uploaded_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("[addPackageImage] Error adding image:", error);
      return { error: "Failed to add image" };
    }

    console.log("[addPackageImage] Image added successfully with ID:", data.id);
    return { image: data as PackageImage };
  } catch (err) {
    console.error("[addPackageImage] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

export async function deletePackageImage(imageId: string): Promise<{
  success?: boolean;
  error?: string;
}> {
  try {
    console.log(`[deletePackageImage] Deleting image: ${imageId}`);

    // First get the image details to get the public_id
    const { data: image, error: fetchError } = await supabase
      .from("package_images")
      .select("image_public_id")
      .eq("id", imageId)
      .single();

    if (fetchError) {
      console.error("[deletePackageImage] Error fetching image:", fetchError);
      return { error: "Image not found" };
    }

    // Delete from Cloudinary if it has a public_id
    if (image?.image_public_id) {
      console.log("[deletePackageImage] Deleting from Cloudinary:", image.image_public_id);
      const cloudinaryResult = await deleteFromCloudinary(image.image_public_id);
      if (cloudinaryResult.error) {
        console.warn("[deletePackageImage] Cloudinary delete failed:", cloudinaryResult.error);
        // Continue with database delete even if Cloudinary fails
      }
    }

    // Delete from database
    const { error } = await supabase
      .from("package_images")
      .delete()
      .eq("id", imageId);

    if (error) {
      console.error("[deletePackageImage] Error deleting from database:", error);
      return { error: "Failed to delete image" };
    }

    console.log("[deletePackageImage] Image deleted successfully");
    return { success: true };
  } catch (err) {
    console.error("[deletePackageImage] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

export async function getPackageImages(packageId: string): Promise<{
  images?: PackageImage[];
  error?: string;
}> {
  try {
    console.log(`[getPackageImages] Fetching images for package: ${packageId}`);

    const { data, error } = await supabase
      .from("package_images")
      .select("*")
      .eq("package_id", packageId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[getPackageImages] Error fetching images:", error);
      return { error: "Failed to fetch images" };
    }

    console.log(`[getPackageImages] Found ${data?.length || 0} images`);
    return { images: data as PackageImage[] };
  } catch (err) {
    console.error("[getPackageImages] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

export async function setPrimaryImage(imageId: string, packageId: string): Promise<{
  success?: boolean;
  error?: string;
}> {
  try {
    console.log(`[setPrimaryImage] Setting image ${imageId} as primary for package ${packageId}`);

    // First unset all primary images for this package
    await supabase
      .from("package_images")
      .update({ is_primary: false })
      .eq("package_id", packageId);

    // Then set the selected image as primary
    const { error } = await supabase
      .from("package_images")
      .update({ is_primary: true })
      .eq("id", imageId);

    if (error) {
      console.error("[setPrimaryImage] Error setting primary image:", error);
      return { error: "Failed to set primary image" };
    }

    console.log("[setPrimaryImage] Primary image set successfully");
    return { success: true };
  } catch (err) {
    console.error("[setPrimaryImage] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// ============================================
// LOCATION UPDATE FOR MAP ANIMATION
// ============================================

export async function updatePackageLocation(
  trackingNumber: string,
  locationData: {
    country: string;
    city?: string;
    status?: PackageStatus;
    description?: string;
  }
): Promise<{
  package?: TrackingPackage;
  error?: string;
}> {
  try {
    console.log(`[updatePackageLocation] Updating location for: ${trackingNumber} to ${locationData.country}`);

    // Get package
    const { data: packageData, error: packageError } = await supabase
      .from("tracking_packages")
      .select("id, current_country, current_city, status")
      .eq("tracking_number", trackingNumber)
      .single();

    if (packageError || !packageData) {
      console.error("[updatePackageLocation] Package not found:", trackingNumber);
      return { error: "Package not found" };
    }

    console.log("[updatePackageLocation] Current package state:", {
      current_country: packageData.current_country,
      current_city: packageData.current_city,
      status: packageData.status
    });

    // Update package location
    const updates: any = {
      current_country: locationData.country,
      current_city: locationData.city || packageData.current_city,
      updated_at: new Date().toISOString()
    };

    if (locationData.status) {
      updates.status = locationData.status;
    }

    const { data: updatedPackage, error: updateError } = await supabase
      .from("tracking_packages")
      .update(updates)
      .eq("tracking_number", trackingNumber)
      .select()
      .single();

    if (updateError) {
      console.error("[updatePackageLocation] Error updating location:", updateError);
      return { error: "Failed to update location" };
    }

    // Add location history
    console.log("[updatePackageLocation] Adding location history");
    await supabase
      .from("location_history")
      .insert([{
        package_id: packageData.id,
        country: locationData.country,
        city: locationData.city,
        status: locationData.status || packageData.status,
        updated_at: new Date().toISOString()
      }]);

    // Add tracking event for location change
    const eventDescription = locationData.description || 
      `Package arrived at ${locationData.country}${locationData.city ? ', ' + locationData.city : ''}`;

    console.log("[updatePackageLocation] Adding tracking event");
    await supabase
      .from("tracking_events")
      .insert([{
        package_id: packageData.id,
        status: locationData.status || packageData.status,
        description: eventDescription,
        location: locationData.city || locationData.country,
        location_country: locationData.country,
        location_city: locationData.city,
        event_timestamp: new Date().toISOString()
      }]);

    console.log("[updatePackageLocation] Location updated successfully");

    // Fetch updated package with map data
    const { data: completePackage } = await supabase
      .from("package_tracking_with_map")
      .select("*")
      .eq("id", packageData.id)
      .single();

    return { package: completePackage as TrackingPackage };
  } catch (err) {
    console.error("[updatePackageLocation] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getStatusDescription(status: PackageStatus): string {
  const descriptions = {
    pending: 'Shipment information received',
    picked_up: 'Package picked up by carrier',
    in_transit: 'Package in transit',
    out_for_delivery: 'Out for delivery',
    delivered: 'Delivered',
    exception: 'Delivery exception'
  };
  return descriptions[status];
}

export async function extractCountryFromAddress(address: string): Promise<string | undefined> {
  if (!address) return undefined;
  
  // Comprehensive country mapping
  const countryMap: Record<string, string> = {
    // Europe
    'albania': 'AL', 'albanian': 'AL',
    'andorra': 'AD', 'andorran': 'AD',
    'austria': 'AT', 'austrian': 'AT',
    'belarus': 'BY', 'belarusian': 'BY',
    'belgium': 'BE', 'belgian': 'BE',
    'bosnia': 'BA', 'bosnian': 'BA', 'bosnia and herzegovina': 'BA',
    'bulgaria': 'BG', 'bulgarian': 'BG',
    'croatia': 'HR', 'croatian': 'HR',
    'cyprus': 'CY', 'cypriot': 'CY',
    'czech': 'CZ', 'czech republic': 'CZ',
    'denmark': 'DK', 'danish': 'DK',
    'estonia': 'EE', 'estonian': 'EE',
    'finland': 'FI', 'finnish': 'FI',
    'france': 'FR', 'french': 'FR',
    'germany': 'DE', 'german': 'DE',
    'greece': 'GR', 'greek': 'GR',
    'hungary': 'HU', 'hungarian': 'HU',
    'iceland': 'IS', 'icelandic': 'IS',
    'ireland': 'IE', 'irish': 'IE',
    'italy': 'IT', 'italian': 'IT',
    'latvia': 'LV', 'latvian': 'LV',
    'liechtenstein': 'LI', 'liechtensteiner': 'LI',
    'lithuania': 'LT', 'lithuanian': 'LT',
    'luxembourg': 'LU', 'luxembourger': 'LU',
    'malta': 'MT', 'maltese': 'MT',
    'moldova': 'MD', 'moldovan': 'MD',
    'monaco': 'MC', 'monacan': 'MC',
    'montenegro': 'ME', 'montenegrin': 'ME',
    'netherlands': 'NL', 'dutch': 'NL', 'holland': 'NL',
    'north macedonia': 'MK', 'macedonia': 'MK', 'macedonian': 'MK',
    'norway': 'NO', 'norwegian': 'NO',
    'poland': 'PL', 'polish': 'PL',
    'portugal': 'PT', 'portuguese': 'PT',
    'romania': 'RO', 'romanian': 'RO',
    'san marino': 'SM', 'sammarinese': 'SM',
    'serbia': 'RS', 'serbian': 'RS',
    'slovakia': 'SK', 'slovak': 'SK',
    'slovenia': 'SI', 'slovenian': 'SI',
    'spain': 'ES', 'spanish': 'ES',
    'sweden': 'SE', 'swedish': 'SE',
    'switzerland': 'CH', 'swiss': 'CH',
    'ukraine': 'UA', 'ukrainian': 'UA',
    'united kingdom': 'GB', 'uk': 'GB', 'britain': 'GB', 'british': 'GB', 'england': 'GB', 'scotland': 'GB', 'wales': 'GB',
    'vatican': 'VA', 'vatican city': 'VA', 'holy see': 'VA',
    
    // Asia
    'afghanistan': 'AF', 'afghan': 'AF',
    'armenia': 'AM', 'armenian': 'AM',
    'azerbaijan': 'AZ', 'azerbaijani': 'AZ',
    'bahrain': 'BH', 'bahraini': 'BH',
    'bangladesh': 'BD', 'bangladeshi': 'BD',
    'bhutan': 'BT', 'bhutanese': 'BT',
    'brunei': 'BN', 'bruneian': 'BN',
    'cambodia': 'KH', 'cambodian': 'KH',
    'china': 'CN', 'chinese': 'CN',
    'georgia': 'GE', 'georgian': 'GE',
    'hong kong': 'HK', 'hongkong': 'HK',
    'india': 'IN', 'indian': 'IN',
    'indonesia': 'ID', 'indonesian': 'ID',
    'iran': 'IR', 'iranian': 'IR',
    'iraq': 'IQ', 'iraqi': 'IQ',
    'israel': 'IL', 'israeli': 'IL',
    'japan': 'JP', 'japanese': 'JP',
    'jordan': 'JO', 'jordanian': 'JO',
    'kazakhstan': 'KZ', 'kazakh': 'KZ',
    'kuwait': 'KW', 'kuwaiti': 'KW',
    'kyrgyzstan': 'KG', 'kyrgyz': 'KG',
    'laos': 'LA', 'laotian': 'LA',
    'lebanon': 'LB', 'lebanese': 'LB',
    'macao': 'MO', 'macau': 'MO',
    'malaysia': 'MY', 'malaysian': 'MY',
    'maldives': 'MV', 'maldivian': 'MV',
    'mongolia': 'MN', 'mongolian': 'MN',
    'myanmar': 'MM', 'burma': 'MM', 'burmese': 'MM',
    'nepal': 'NP', 'nepalese': 'NP',
    'north korea': 'KP', 'north korean': 'KP',
    'oman': 'OM', 'omani': 'OM',
    'pakistan': 'PK', 'pakistani': 'PK',
    'palestine': 'PS', 'palestinian': 'PS',
    'philippines': 'PH', 'philippine': 'PH', 'filipino': 'PH',
    'qatar': 'QA', 'qatari': 'QA',
    'saudi arabia': 'SA', 'saudi': 'SA',
    'singapore': 'SG', 'singaporean': 'SG',
    'south korea': 'KR', 'korea': 'KR', 'korean': 'KR',
    'sri lanka': 'LK', 'sri lankan': 'LK',
    'syria': 'SY', 'syrian': 'SY',
    'taiwan': 'TW', 'taiwanese': 'TW',
    'tajikistan': 'TJ', 'tajik': 'TJ',
    'thailand': 'TH', 'thai': 'TH',
    'timor-leste': 'TL', 'east timor': 'TL', 'timorese': 'TL',
    'turkey': 'TR', 'turkish': 'TR',
    'turkmenistan': 'TM', 'turkmen': 'TM',
    'united arab emirates': 'AE', 'uae': 'AE', 'emirates': 'AE',
    'uzbekistan': 'UZ', 'uzbek': 'UZ',
    'vietnam': 'VN', 'vietnamese': 'VN',
    'yemen': 'YE', 'yemeni': 'YE',
    
    // Africa
    'algeria': 'DZ', 'algerian': 'DZ',
    'angola': 'AO', 'angolan': 'AO',
    'benin': 'BJ', 'beninese': 'BJ',
    'botswana': 'BW', 'botswanan': 'BW',
    'burkina faso': 'BF', 'burkinabe': 'BF',
    'burundi': 'BI', 'burundian': 'BI',
    'cabo verde': 'CV', 'cape verde': 'CV', 'cape verdean': 'CV',
    'cameroon': 'CM', 'cameroonian': 'CM',
    'central african republic': 'CF', 'central african': 'CF',
    'chad': 'TD', 'chadian': 'TD',
    'comoros': 'KM', 'comoran': 'KM',
    'congo': 'CD', 'democratic republic of the congo': 'CD', 'drc': 'CD',
    'congo republic': 'CG', 'republic of the congo': 'CG',
    'cote d\'ivoire': 'CI', 'ivory coast': 'CI', 'ivorian': 'CI',
    'djibouti': 'DJ', 'djiboutian': 'DJ',
    'egypt': 'EG', 'egyptian': 'EG',
    'equatorial guinea': 'GQ', 'equatorial guinean': 'GQ',
    'eritrea': 'ER', 'eritrean': 'ER',
    'eswatini': 'SZ', 'swaziland': 'SZ', 'swazi': 'SZ',
    'ethiopia': 'ET', 'ethiopian': 'ET',
    'gabon': 'GA', 'gabonese': 'GA',
    'gambia': 'GM', 'gambian': 'GM',
    'ghana': 'GH', 'ghanaian': 'GH',
    'guinea': 'GN', 'guinean': 'GN',
    'guinea-bissau': 'GW', 'bissau-guinean': 'GW',
    'kenya': 'KE', 'kenyan': 'KE',
    'lesotho': 'LS', 'basotho': 'LS',
    'liberia': 'LR', 'liberian': 'LR',
    'libya': 'LY', 'libyan': 'LY',
    'madagascar': 'MG', 'malagasy': 'MG',
    'malawi': 'MW', 'malawian': 'MW',
    'mali': 'ML', 'malian': 'ML',
    'mauritania': 'MR', 'mauritanian': 'MR',
    'mauritius': 'MU', 'mauritian': 'MU',
    'morocco': 'MA', 'moroccan': 'MA',
    'mozambique': 'MZ', 'mozambican': 'MZ',
    'namibia': 'NA', 'namibian': 'NA',
    'niger': 'NE', 'nigerien': 'NE',
    'nigeria': 'NG', 'nigerian': 'NG',
    'rwanda': 'RW', 'rwandan': 'RW',
    'sao tome': 'ST', 'sao tome and principe': 'ST', 'sao tomean': 'ST',
    'senegal': 'SN', 'senegalese': 'SN',
    'seychelles': 'SC', 'seychellois': 'SC',
    'sierra leone': 'SL', 'sierra leonean': 'SL',
    'somalia': 'SO', 'somalian': 'SO',
    'south africa': 'ZA', 'south african': 'ZA',
    'south sudan': 'SS', 'south sudanese': 'SS',
    'sudan': 'SD', 'sudanese': 'SD',
    'tanzania': 'TZ', 'tanzanian': 'TZ',
    'togo': 'TG', 'togolese': 'TG',
    'tunisia': 'TN', 'tunisian': 'TN',
    'uganda': 'UG', 'ugandan': 'UG',
    'zambia': 'ZM', 'zambian': 'ZM',
    'zimbabwe': 'ZW', 'zimbabwean': 'ZW',
    
    // Americas
    'argentina': 'AR', 'argentine': 'AR',
    'bahamas': 'BS', 'bahamian': 'BS',
    'barbados': 'BB', 'barbadian': 'BB',
    'belize': 'BZ', 'belizean': 'BZ',
    'bolivia': 'BO', 'bolivian': 'BO',
    'brazil': 'BR', 'brazilian': 'BR',
    'canada': 'CA', 'canadian': 'CA',
    'chile': 'CL', 'chilean': 'CL',
    'colombia': 'CO', 'colombian': 'CO',
    'costa rica': 'CR', 'costa rican': 'CR',
    'cuba': 'CU', 'cuban': 'CU',
    'dominica': 'DM', 'dominican': 'DM',
    'dominican republic': 'DO',
    'ecuador': 'EC', 'ecuadorian': 'EC',
    'el salvador': 'SV', 'salvadoran': 'SV',
    'grenada': 'GD', 'grenadian': 'GD',
    'guatemala': 'GT', 'guatemalan': 'GT',
    'guyana': 'GY', 'guyanese': 'GY',
    'haiti': 'HT', 'haitian': 'HT',
    'honduras': 'HN', 'honduran': 'HN',
    'jamaica': 'JM', 'jamaican': 'JM',
    'mexico': 'MX', 'mexican': 'MX',
    'nicaragua': 'NI', 'nicaraguan': 'NI',
    'panama': 'PA', 'panamanian': 'PA',
    'paraguay': 'PY', 'paraguayan': 'PY',
    'peru': 'PE', 'peruvian': 'PE',
    'puerto rico': 'PR', 'puerto rican': 'PR',
    'suriname': 'SR', 'surinamese': 'SR',
    'trinidad': 'TT', 'trinidad and tobago': 'TT', 'trinidadian': 'TT',
    'united states': 'US', 'usa': 'US', 'america': 'US', 'american': 'US',
    'uruguay': 'UY', 'uruguayan': 'UY',
    'venezuela': 'VE', 'venezuelan': 'VE',
    
    // Oceania
    'australia': 'AU', 'australian': 'AU',
    'fiji': 'FJ', 'fijian': 'FJ',
     'marshall islands': 'MH', 'marshallese': 'MH',
    'micronesia': 'FM', 'micronesian': 'FM',
    'nauru': 'NR', 'nauruan': 'NR',
     'new zealand': 'NZ', 'kiwi': 'NZ',
    'palau': 'PW', 'palauan': 'PW',
    'papua new guinea': 'PG', 'papua new guinean': 'PG',
    'samoa': 'WS', 'samoan': 'WS',
    'solomon islands': 'SB', 'solomon islander': 'SB',
    'tonga': 'TO', 'tongan': 'TO',
    'tuvalu': 'TV', 'tuvaluan': 'TV',
    'vanuatu': 'VU', 'ni-vanuatu': 'VU',
    
    // Caribbean & Territories
    'anguilla': 'AI', 'anguillan': 'AI',
    'antigua': 'AG', 'antigua and barbuda': 'AG', 'antiguan': 'AG',
    'aruba': 'AW', 'aruban': 'AW',
    'bermuda': 'BM', 'bermudian': 'BM',
    'bonaire': 'BQ', 'bonairean': 'BQ',
    'british virgin islands': 'VG', 'bvi': 'VG',
    'cayman islands': 'KY', 'caymanian': 'KY',
    'cook islands': 'CK', 'cook islander': 'CK',
    'curacao': 'CW', 'curacaoan': 'CW',
    'falkland islands': 'FK', 'falkland': 'FK',
    'faroe islands': 'FO', 'faroese': 'FO',
    'french guiana': 'GF', 'french guianese': 'GF',
    'french polynesia': 'PF', 'tahiti': 'PF',
    'greenland': 'GL', 'greenlandic': 'GL',
    'guadeloupe': 'GP', 'guadeloupean': 'GP',
    'guam': 'GU', 'guamanian': 'GU',
      'guernsey': 'GG',
    'isle of man': 'IM', 'manx': 'IM',
     'jersey': 'JE',
    'kosovo': 'XK', 'kosovar': 'XK',
    'martinique': 'MQ', 'martinican': 'MQ',
    'mayotte': 'YT', 'mahoran': 'YT',
    'montserrat': 'MS', 'montserratian': 'MS',
    'new caledonia': 'NC', 'new caledonian': 'NC',
    'niue': 'NU', 'niuean': 'NU',
    'norfolk island': 'NF', 'norfolk islander': 'NF',
    'northern mariana islands': 'MP', 'northern marianan': 'MP',
    'pitcairn islands': 'PN', 'pitcairn': 'PN',
    'reunion': 'RE', 'reunionese': 'RE',
    'saint barthelemy': 'BL', 'st barthelemy': 'BL',
    'saint helena': 'SH', 'st helena': 'SH',
    'saint kitts': 'KN', 'saint kitts and nevis': 'KN', 'st kitts': 'KN',
    'saint lucia': 'LC', 'st lucia': 'LC', 'saint lucian': 'LC',
    'saint martin': 'MF', 'st martin': 'MF',
    'saint pierre': 'PM', 'st pierre': 'PM',
    'saint vincent': 'VC', 'st vincent': 'VC', 'saint vincent and the grenadines': 'VC',
    'sint maarten': 'SX', 'st maarten': 'SX',
    'svalbard': 'SJ', 'svalbard and jan mayen': 'SJ',
    'tokelau': 'TK', 'tokelauan': 'TK',
    'turks and caicos': 'TC', 'turks and caicos islands': 'TC',
    'us virgin islands': 'VI', 'usvi': 'VI',
     'wallis and futuna': 'WF',
    'western sahara': 'EH', 'sahrawi': 'EH'
  };

  // Convert address to lowercase for case-insensitive matching
  const lowerAddress = address.toLowerCase();
  
  // Check for exact matches first (full country names)
  for (const [countryName, code] of Object.entries(countryMap)) {
    if (lowerAddress.includes(countryName)) {
      console.log(`[extractCountryFromAddress] Found match: ${countryName} -> ${code}`);
      return code;
    }
  }
  
  // Check for common patterns like postal codes, country codes in parentheses, etc.
  const countryCodePattern = /\b([A-Z]{2})\b/g;
  const matches = address.match(countryCodePattern);
  if (matches) {
    for (const match of matches) {
      // Validate if it's a known country code
      const knownCodes = Object.values(countryMap);
      if (knownCodes.includes(match)) {
        console.log(`[extractCountryFromAddress] Found country code: ${match}`);
        return match;
      }
    }
  }
  
  console.log(`[extractCountryFromAddress] No country found in address: ${address}`);
  return undefined;
}

// Helper function to extract city from address
// Helper function to extract city from address
export async function extractCityFromAddress(address: string): Promise<string | undefined> {
  if (!address) return undefined;
  
  // Split by commas and take the first part (usually the city)
  const parts = address.split(',').map(part => part.trim());
  
  // Common patterns: "City, State, Country" or "City, Country"
  if (parts.length >= 2) {
    // Usually the first part is the city
    return parts[0];
  }
  
  // If no commas, try to extract from common patterns
  const words = address.split(' ');
  if (words.length > 0) {
    // Look for common city indicators
    const cityIndicators = ['city', 'town', 'village', 'municipality'];
    for (let i = 0; i < words.length; i++) {
      if (cityIndicators.includes(words[i].toLowerCase()) && i + 1 < words.length) {
        return words[i + 1];
      }
    }
    
    // Default to the first word if it looks like a city name (capitalized, not too long)
    if (words[0].length > 2 && words[0][0] === words[0][0].toUpperCase()) {
      return words[0];
    }
  }
  
  return undefined;
}

export async function updatePackage(
  trackingNumber: string, 
  updates: UpdatePackageData
): Promise<{
  package?: TrackingPackage;
  error?: string;
}> {
  try {
    console.log(`[updatePackage] Updating package: ${trackingNumber}`, updates);

    // Check if tracking number is being updated and if it already exists
    if (updates.tracking_number && updates.tracking_number !== trackingNumber) {
      const { data: existingPackage } = await supabase
        .from("tracking_packages")
        .select("tracking_number")
        .eq("tracking_number", updates.tracking_number)
        .single();

      if (existingPackage) {
        console.log("[updatePackage] New tracking number already exists:", updates.tracking_number);
        return { error: "Tracking number already exists" };
      }
    }

    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Remove any undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { data, error } = await supabase
      .from("tracking_packages")
      .update(updateData)
      .eq("tracking_number", trackingNumber)
      .select()
      .single();

    if (error) {
      console.error("[updatePackage] Error updating package:", error);
      return { error: "Failed to update package" };
    }

    console.log("[updatePackage] Package updated successfully");
    return { package: data as TrackingPackage };
  } catch (err) {
    console.error("[updatePackage] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// Update package status and add tracking event
export async function updatePackageStatus(
  trackingNumber: string,
  status: TrackingPackage['status'],
  description?: string,
  location?: string,
  country?: string, // Parameter for country update
  city?: string     // Parameter for city update
): Promise<{
  package?: TrackingPackage;
  event?: TrackingEvent;
  error?: string;
}> {
  try {
    // Clean the tracking number - remove any whitespace and convert to uppercase
    const cleanTrackingNumber = trackingNumber.trim().toUpperCase();
    
    console.log(`[updatePackageStatus] 🚀 ============ STARTING UPDATE ============`);
    console.log(`[updatePackageStatus] 🚀 Raw tracking number received: "${trackingNumber}"`);
    console.log(`[updatePackageStatus] 🚀 Cleaned tracking number: "${cleanTrackingNumber}"`);
    console.log(`[updatePackageStatus] 📦 Update data:`, {
      newStatus: status,
      newCountry: country || 'unchanged',
      newCity: city || 'unchanged',
      location: location || 'auto',
      description: description || 'auto'
    });

    // First, let's check if the package exists by doing a simple count query
    console.log(`[updatePackageStatus] 🔍 Checking if package exists: ${cleanTrackingNumber}`);
    
    const { count, error: countError } = await supabase
      .from("tracking_packages")
      .select("*", { count: 'exact', head: true })
      .eq("tracking_number", cleanTrackingNumber);

    if (countError) {
      console.error("[updatePackageStatus] ❌ Error checking package existence:", countError);
      console.error("[updatePackageStatus] ❌ Count error details:", {
        message: countError.message,
        details: countError.details,
        hint: countError.hint,
        code: countError.code
      });
    }

    console.log(`[updatePackageStatus] 📊 Package existence check:`, {
      found: count === 1,
      count: count
    });

    if (count === 0) {
      // Let's try to find similar tracking numbers to help debug
      console.log(`[updatePackageStatus] 🔍 Searching for similar tracking numbers...`);
      
      const { data: similarPackages, error: similarError } = await supabase
        .from("tracking_packages")
        .select("tracking_number")
        .ilike("tracking_number", `%${cleanTrackingNumber.slice(0, 8)}%`)
        .limit(5);

      if (!similarError && similarPackages && similarPackages.length > 0) {
        console.log(`[updatePackageStatus] 🔍 Similar tracking numbers found:`, 
          similarPackages.map(p => p.tracking_number));
      } else {
        console.log(`[updatePackageStatus] 🔍 No similar tracking numbers found`);
      }

      // Also check if the package exists with a different case
      const { data: caseInsensitive, error: caseError } = await supabase
        .from("tracking_packages")
        .select("tracking_number")
        .ilike("tracking_number", cleanTrackingNumber);

      if (!caseError && caseInsensitive && caseInsensitive.length > 0) {
        console.log(`[updatePackageStatus] 🔍 Found with case-insensitive search:`, 
          caseInsensitive.map(p => p.tracking_number));
      }

      console.error(`[updatePackageStatus] ❌ Package not found: ${cleanTrackingNumber}`);
      return { error: `Package with tracking number ${cleanTrackingNumber} not found` };
    }

    // Now get the full package data
    console.log(`[updatePackageStatus] 📦 Fetching full package data for: ${cleanTrackingNumber}`);
    
    const { data: packageData, error: packageError } = await supabase
      .from("tracking_packages")
      .select(`
        id, 
        status, 
        current_country, 
        current_city,
        tracking_number,
        sender_name,
        sender_address,
        recipient_name,
        recipient_address,
        origin_country,
        destination_country,
        service_type,
        weight,
        dimensions,
        estimated_delivery,
        created_at,
        updated_at
      `)
      .eq("tracking_number", cleanTrackingNumber)
      .single();

    if (packageError) {
      console.error("[updatePackageStatus] ❌ Error fetching package:", packageError);
      console.error("[updatePackageStatus] ❌ Error details:", {
        message: packageError.message,
        details: packageError.details,
        hint: packageError.hint,
        code: packageError.code
      });
      return { error: `Failed to fetch package: ${packageError.message}` };
    }

    if (!packageData) {
      console.error("[updatePackageStatus] ❌ Package data is null for:", cleanTrackingNumber);
      return { error: "Package not found - data is null" };
    }

    console.log("[updatePackageStatus] ✅ Package found successfully:", {
      id: packageData.id,
      tracking_number: packageData.tracking_number,
      current_status: packageData.status,
      current_country: packageData.current_country,
      current_city: packageData.current_city
    });

    // Prepare update object
    const updateData: any = {
      status: status,
      updated_at: new Date().toISOString()
    };

    // Add country update if provided
    if (country) {
      updateData.current_country = country;
      console.log(`[updatePackageStatus] 🌍 Will update country from "${packageData.current_country}" to "${country}"`);
    }

    // Add city update if provided
    if (city) {
      updateData.current_city = city;
      console.log(`[updatePackageStatus] 🏙️ Will update city from "${packageData.current_city}" to "${city}"`);
    }

    console.log("[updatePackageStatus] 📝 Update data prepared:", updateData);

    // Update package status and location
    console.log(`[updatePackageStatus] 💾 Executing update for package ID: ${packageData.id}`);
    
    const { data: updatedPackage, error: updateError } = await supabase
      .from("tracking_packages")
      .update(updateData)
      .eq("id", packageData.id) // Use ID instead of tracking number for more reliability
      .select() // REMOVED the virtual fields that don't exist
      .single();

    if (updateError) {
      console.error("[updatePackageStatus] ❌ Error updating package:", updateError);
      console.error("[updatePackageStatus] ❌ Error details:", {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code
      });
      return { error: `Failed to update package: ${updateError.message}` };
    }

    if (!updatedPackage) {
      console.error("[updatePackageStatus] ❌ No data returned after update");
      return { error: "Update succeeded but no data returned" };
    }

    console.log("[updatePackageStatus] ✅ Package updated successfully:", {
      id: updatedPackage.id,
      tracking_number: updatedPackage.tracking_number,
      newStatus: updatedPackage.status,
      newCountry: updatedPackage.current_country,
      newCity: updatedPackage.current_city
    });

    // Get country coordinates for location history (optional - don't fail if not found)
    let countryCoordinates = null;
    if (country) {
      console.log(`[updatePackageStatus] 🗺️ Attempting to fetch coordinates for country: ${country}`);
      const { data: countryData, error: countryError } = await supabase
        .from("country_coordinates")
        .select("map_center, latitude, longitude")
        .eq("country_code", country)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors
      
      if (countryError) {
        console.warn("[updatePackageStatus] ⚠️ Could not fetch country coordinates:", countryError.message);
      } else if (countryData) {
        countryCoordinates = countryData.map_center;
        console.log("[updatePackageStatus] ✅ Country coordinates fetched:", countryCoordinates);
      } else {
        console.log("[updatePackageStatus] ℹ️ No coordinates found for country:", country);
      }
    }

    // Add location history entry (optional - don't fail if table doesn't exist)
    if (country || city) {
      console.log("[updatePackageStatus] 📍 Attempting to add location history entry");
      const historyEntry = {
        package_id: packageData.id,
        country: country || updatedPackage.current_country || packageData.current_country,
        city: city || updatedPackage.current_city || packageData.current_city,
        status: status,
        coordinates: countryCoordinates,
        updated_at: new Date().toISOString(),
        metadata: {
          type: 'status_update',
          previous_country: packageData.current_country,
          previous_status: packageData.status,
          update_source: 'admin_panel'
        }
      };
      
      console.log("[updatePackageStatus] 📝 History entry:", historyEntry);
      
      const { error: historyError } = await supabase
        .from("location_history")
        .insert([historyEntry]);

      if (historyError) {
        console.warn("[updatePackageStatus] ⚠️ Failed to add location history (table might not exist):", historyError.message);
        // Don't fail the whole operation if history table doesn't exist
      } else {
        console.log("[updatePackageStatus] ✅ Location history added successfully");
      }
    }

    // Generate event description based on status and location
    let eventDescription = description;
    if (!eventDescription) {
      if (country && country !== packageData.current_country) {
        // If country changed, create a custom message
        eventDescription = `Package arrived in ${country}${city ? `, ${city}` : ''}`;
      } else {
        eventDescription = getStatusDescription(status);
      }
    }

    // Generate event location
    let eventLocation = location;
    if (!eventLocation) {
      if (city) {
        eventLocation = city;
      } else if (country) {
        eventLocation = country;
      } else {
        eventLocation = getDefaultLocation(status, packageData);
      }
    }

    console.log("[updatePackageStatus] 📝 Creating tracking event:", {
      description: eventDescription,
      location: eventLocation,
      country: country || packageData.current_country,
      city: city || packageData.current_city
    });

    // Add tracking event
    const eventData = {
      package_id: packageData.id,
      status: status,
      description: eventDescription,
      location: eventLocation,
      location_country: country || packageData.current_country,
      location_city: city || packageData.current_city,
      event_timestamp: new Date().toISOString(),
      metadata: {
        country_updated: !!country,
        city_updated: !!city,
        previous_country: packageData.current_country,
        previous_status: packageData.status
      }
    };

    console.log("[updatePackageStatus] 📝 Event data:", eventData);

    const { data: eventResult, error: eventError } = await supabase
      .from("tracking_events")
      .insert([eventData])
      .select()
      .single();

    if (eventError) {
      console.error("[updatePackageStatus] ❌ Error adding tracking event:", eventError);
      console.error("[updatePackageStatus] ❌ Event error details:", {
        message: eventError.message,
        details: eventError.details,
        hint: eventError.hint,
        code: eventError.code
      });
      // Still return success for package update even if event creation fails
      return { 
        package: updatedPackage as TrackingPackage,
        error: "Package updated but failed to create tracking event" 
      };
    }

    console.log("[updatePackageStatus] ✅ Tracking event created:", {
      eventId: eventResult.id,
      eventStatus: eventResult.status
    });

    console.log("[updatePackageStatus] ✅ ============ UPDATE COMPLETE ============");
    console.log("[updatePackageStatus] ✅ Final result:", {
      trackingNumber: updatedPackage.tracking_number,
      status: updatedPackage.status,
      country: updatedPackage.current_country,
      city: updatedPackage.current_city,
      eventId: eventResult.id
    });

    return { 
      package: updatedPackage as TrackingPackage,
      event: eventResult as TrackingEvent
    };
  } catch (err) {
    console.error("[updatePackageStatus] 💥 Unexpected error:", err);
    if (err instanceof Error) {
      console.error("[updatePackageStatus] 💥 Error details:", {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
    }
    return { error: "Unexpected error occurred" };
  }
}

// Delete package
export async function deletePackage(trackingNumber: string): Promise<{
  success?: boolean;
  error?: string;
}> {
  try {
    console.log(`[deletePackage] Deleting package: ${trackingNumber}`);

    // First get all images for this package
    const { data: packageData } = await supabase
      .from("tracking_packages")
      .select("id")
      .eq("tracking_number", trackingNumber)
      .single();

    if (packageData) {
      // Get all images
      const { data: images } = await supabase
        .from("package_images")
        .select("image_public_id")
        .eq("package_id", packageData.id);

      // Delete images from Cloudinary
      if (images && images.length > 0) {
        console.log(`[deletePackage] Deleting ${images.length} images from Cloudinary`);
        for (const image of images) {
          if (image.image_public_id) {
            await deleteFromCloudinary(image.image_public_id);
          }
        }
      }
    }

    // Delete package (cascade will delete images from database)
    const { error } = await supabase
      .from("tracking_packages")
      .delete()
      .eq("tracking_number", trackingNumber);

    if (error) {
      console.error("[deletePackage] Error deleting package:", error);
      return { error: "Failed to delete package" };
    }

    console.log("[deletePackage] Package deleted successfully");
    return { success: true };
  } catch (err) {
    console.error("[deletePackage] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// Add tracking event
export async function addTrackingEvent(
  trackingNumber: string,
  eventData: Omit<TrackingEvent, 'id' | 'package_id' | 'created_at'>
): Promise<{
  event?: TrackingEvent;
  error?: string;
}> {
  try {
    console.log(`[addTrackingEvent] Adding event for: ${trackingNumber}`);

    // First get the package ID and current status
    const { data: packageData, error: packageError } = await supabase
      .from("tracking_packages")
      .select("id, status")
      .eq("tracking_number", trackingNumber)
      .single();

    if (packageError || !packageData) {
      console.error("[addTrackingEvent] Package not found:", trackingNumber);
      return { error: "Package not found" };
    }

    const { data, error } = await supabase
      .from("tracking_events")
      .insert([{
        ...eventData,
        package_id: packageData.id
      }])
      .select()
      .single();

    if (error) {
      console.error("[addTrackingEvent] Error adding event:", error);
      return { error: "Failed to add tracking event" };
    }

    // Update package status if it's different
    if (eventData.status !== packageData.status) {
      console.log("[addTrackingEvent] Updating package status to match event");
      await supabase
        .from("tracking_packages")
        .update({ status: eventData.status })
        .eq("id", packageData.id);
    }

    console.log("[addTrackingEvent] Event added successfully");
    return { event: data as TrackingEvent };
  } catch (err) {
    console.error("[addTrackingEvent] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// Get all packages (for admin view)
export async function getAllPackages(): Promise<{
  packages?: TrackingPackage[];
  error?: string;
}> {
  try {
    console.log("[getAllPackages] Fetching all packages");

    const { data, error } = await supabase
      .from("tracking_packages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getAllPackages] Error fetching packages:", error);
      return { error: "Failed to fetch packages" };
    }

    console.log(`[getAllPackages] Found ${data?.length || 0} packages`);
    return { packages: data as TrackingPackage[] };
  } catch (err) {
    console.error("[getAllPackages] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// Get package by ID
export async function getPackageById(id: string): Promise<{
  package?: TrackingPackage;
  error?: string;
}> {
  try {
    console.log(`[getPackageById] Fetching package: ${id}`);

    const { data, error } = await supabase
      .from("tracking_packages")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[getPackageById] Error fetching package:", error);
      return { error: "Package not found" };
    }

    return { package: data as TrackingPackage };
  } catch (err) {
    console.error("[getPackageById] Unexpected error:", err);
    return { error: "Unexpected error occurred" };
  }
}

// Helper function to get default location based on status
function getDefaultLocation(status: TrackingPackage['status'], packageData: any): string {
  const locations: Record<PackageStatus, string> = {
    pending: packageData?.sender_address?.split(',')[0] || 'Origin Facility',
    picked_up: packageData?.sender_address?.split(',')[0] || 'Pickup Location',
    in_transit: 'Distribution Center',
    out_for_delivery: packageData?.recipient_address?.split(',')[0] || 'Local Facility',
    delivered: packageData?.recipient_address?.split(',')[0] || 'Destination',
    exception: 'Processing Facility'
  };
  return locations[status];
}