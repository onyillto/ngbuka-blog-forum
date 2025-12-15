"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

// =======================================================
// 1. TYPES & INTERFACES
// =======================================================

interface FeaturedCar {
  _id: string;
  brand: string;
  carModel: string;
  year: string;
  category: string;
  description: string;
  price: string;
  imageUrl: string;
  imagePublicId: string;
  createdAt: string;
}

interface FormData {
  brand: string;
  carModel: string;
  year: string;
  category: string;
  description: string;
  price: string;
}

// =======================================================
// 2. CONSTANTS
// =======================================================

const API_BASE_URL =
  `${process.env.NEXT_PUBLIC_BaseURL}/featured-cars` ||
  "http://localhost:5080/api/featured-cars";
const MAX_CARS = 6;
const DEFAULT_FORM_STATE: FormData = {
  brand: "",
  carModel: "",
  year: "",
  category: "",
  description: "",
  price: "",
};

// =======================================================
// 3. ICONS
// =======================================================

const EditIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-4.606 2.594a1 1 0 00-1.042 1.042l-.5 4.5a1 1 0 00.957 1.059l4.5-.5a1 1 0 001.042-1.042l-.5-4.5a1 1 0 00-1.059-.957l-4.5.5z" />
  </svg>
);
const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 100 2v6a1 1 0 100-2V8z"
      clipRule="evenodd"
    />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);

// =======================================================
// 4. MAIN COMPONENT
// =======================================================

const FeaturedCarAdminPage: React.FC = () => {
  const [cars, setCars] = useState<FeaturedCar[]>([]);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_STATE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null); // Stores the _id of the car being edited

  // --- Fetching Logic ---
  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error("Failed to fetch cars");
      const data: FeaturedCar[] = await response.json();
      setCars(data);
    } catch (error) {
      toast.error("Could not load cars.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // --- Form Handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files ? e.target.files[0] : null);
  };

  const resetForm = () => {
    setFormData(DEFAULT_FORM_STATE);
    setSelectedFile(null);
    setIsEditing(null);
  };

  // --- CRUD Operations ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isEditing && cars.length >= MAX_CARS) {
      toast.error(`Cannot add more than ${MAX_CARS} featured cars.`);
      setLoading(false);
      return;
    }

    if (!isEditing && !selectedFile) {
      toast.error("Image file is required for new cars.");
      setLoading(false);
      return;
    }

    // Create the multipart form data payload
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (selectedFile) {
      data.append("imageUrl", selectedFile);
    }

    try {
      let response: Response;
      let url = API_BASE_URL;

      if (isEditing) {
        // UPDATE operation
        url = `${API_BASE_URL}/${isEditing}`;
        response = await fetch(url, {
          method: "PUT",
          body: data, // Using FormData for image and fields
        });
      } else {
        // CREATE operation
        response = await fetch(url, {
          method: "POST",
          body: data, // Using FormData for image and fields
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }

      toast.success(
        isEditing ? "Car updated successfully!" : "Car added successfully!"
      );
      resetForm(); // Reset form after successful submission
      fetchCars(); // Reload the list
    } catch (error: unknown) {
      toast.error((error as Error).message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this featured car? The image will also be removed from Cloudinary."
      )
    )
      return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Deletion failed");
      }

      toast.success("Car deleted successfully!");
      fetchCars(); // Reload the list
    } catch (error: unknown) {
      toast.error(
        (error as Error).message || "An error occurred during deletion."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car: FeaturedCar) => {
    setIsEditing(car._id);
    setFormData({
      brand: car.brand,
      carModel: car.carModel,
      year: car.year,
      category: car.category,
      description: car.description,
      price: car.price,
    });
    // Do not set selectedFile, as we don't need to re-upload it unless chosen
  };

  // --- Memoized Values ---
  const isMaxCarsReached = useMemo(
    () => cars.length >= MAX_CARS,
    [cars.length]
  );
  const actionButtonText = isEditing ? "Update Car" : "Add Car";

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-gray-200 pb-4">
        Manage Featured Cars
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* =======================================================
            LEFT COLUMN: CREATE/UPDATE FORM
            ======================================================= */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit sticky top-8">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-700">
            {isEditing
              ? `Editing: ${formData.brand} ${formData.carModel}`
              : "Add New Featured Car"}
          </h2>
          {!isEditing && isMaxCarsReached && (
            <div className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
              Maximum of {MAX_CARS} cars reached. Please edit or delete an
              existing one to add more.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Car Image (
                {isEditing
                  ? "optional – leave blank to keep current"
                  : "required"}
                )
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {isEditing && !selectedFile && (
                <p className="text-xs text-gray-500 mt-1">
                  Current Image:{" "}
                  <a
                    href={cars.find((c) => c._id === isEditing)?.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-900 hover:underline"
                  >
                    View Image
                  </a>
                </p>
              )}
            </div>

            {/* Input Fields */}
            {Object.entries(DEFAULT_FORM_STATE).map(([key, placeholder]) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700 capitalize"
                >
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .replace("Car Model", "Model")}
                </label>
                {key === "description" ? (
                  <textarea
                    id={key}
                    name={key}
                    rows={3}
                    value={formData[key as keyof FormData]}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-800 focus:ring-blue-800 sm:text-sm p-2"
                  />
                ) : (
                  <input
                    type={
                      key === "year"
                        ? "number"
                        : key === "price"
                        ? "text"
                        : "text"
                    }
                    id={key}
                    name={key}
                    value={formData[key as keyof FormData]}
                    onChange={handleInputChange}
                    required
                    placeholder={placeholder}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-800 focus:ring-blue-800 sm:text-sm p-2"
                  />
                )}
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-2">
              <button
                type="submit"
                disabled={loading || (!isEditing && isMaxCarsReached)}
                className={`flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
                  loading || (!isEditing && isMaxCarsReached)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                }`}
              >
                {loading ? (
                  "Processing..."
                ) : isEditing ? (
                  actionButtonText
                ) : (
                  <>
                    <PlusIcon /> {actionButtonText}
                  </>
                )}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* =======================================================
            RIGHT COLUMN: CAR LIST (READ)
            ======================================================= */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Featured Cars ({cars.length} / {MAX_CARS})
            </h2>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                isMaxCarsReached
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {isMaxCarsReached ? "Limit Reached" : "Room Available"}
            </span>
          </div>

          <div className="space-y-4">
            {cars.map((car) => (
              <CarListItem
                key={car._id}
                car={car}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isProcessing={loading}
              />
            ))}
          </div>

          {!cars.length && !loading && (
            <div className="p-10 text-center bg-white rounded-xl shadow-md text-gray-500">
              No featured cars yet. Start by adding one using the form above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =======================================================
// 5. CAR LIST ITEM SUB-COMPONENT
// =======================================================

interface CarListItemProps {
  car: FeaturedCar;
  onEdit: (car: FeaturedCar) => void;
  onDelete: (id: string) => void;
  isProcessing: boolean;
}

const CarListItem: React.FC<CarListItemProps> = ({
  car,
  onEdit,
  onDelete,
  isProcessing,
}) => {
  return (
    <div className="flex items-center bg-white p-4 rounded-xl shadow-md border border-gray-100 transition duration-150 hover:shadow-lg">
      {/* Image and Basic Info */}
      <div className="relative w-20 h-20 flex-shrink-0 mr-4 rounded-lg overflow-hidden border border-gray-200">
        <Image
          src={
            car.imageUrl ||
            "https://via.placeholder.com/80x80/EEEEEE/333333?text=N/A"
          }
          alt={`${car.brand} ${car.carModel}`}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold truncate text-gray-900">
            {car.brand} {car.carModel}{" "}
            <span className="text-sm font-normal text-gray-500">
              ({car.year})
            </span>
          </h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
            {car.category}
          </span>
        </div>
        <p className="text-sm text-gray-600 truncate mt-1">{car.description}</p>
        <p className="text-md font-bold text-orange-600 mt-1">{car.price}</p>
      </div>

      {/* Actions */}
      <div className="flex space-x-2 ml-4 flex-shrink-0">
        <button
          onClick={() => onEdit(car)}
          disabled={isProcessing}
          className="p-2 text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition duration-150 disabled:opacity-50"
          title="Edit Car"
        >
          <EditIcon />
        </button>
        <button
          onClick={() => onDelete(car._id)}
          disabled={isProcessing}
          className="p-2 text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition duration-150 disabled:opacity-50"
          title="Delete Car"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default FeaturedCarAdminPage;
