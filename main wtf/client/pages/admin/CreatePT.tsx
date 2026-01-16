import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminData } from "@/contexts/AdminDataContext";
import { useAdminToast } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreatePT: React.FC = () => {
  const { addPersonalTrainer } = useAdminData();
  const { toast } = useAdminToast();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // PT Details
    firstName: "",
    secondName: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",

    // Address
    address: "",
    pinCode: "",
    city: "",
    state: "",
    country: "",

    // Additional
    status: "Active" as "Active" | "Inactive",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.secondName.trim())
      newErrors.secondName = "Second name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email format is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.specialization.trim())
      newErrors.specialization = "Specialization is required";
    if (!formData.experience.trim())
      newErrors.experience = "Experience is required";
    if (parseInt(formData.experience) < 0)
      newErrors.experience = "Experience must be positive";

    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.pinCode.trim()) newErrors.pinCode = "Pin code is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newTrainer = {
        name: `${formData.firstName} ${formData.secondName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pinCode: formData.pinCode,
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        clients: 0,
        paymentsCollected: 0,
        paymentsPending: 0,
        status: formData.status,
        specialization: formData.specialization,
        experience: parseInt(formData.experience),
      };

      addPersonalTrainer(newTrainer);

      toast.success("Personal Trainer created successfully!");

      // Navigate to Personal Trainers page
      navigate("/admin/personal-trainers");
    } catch (error) {
      console.error("Error creating trainer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost.",
      )
    ) {
      navigate("/admin/personal-trainers");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6" />

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* PT Details Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <User className="text-gray-400 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">PT Details</h2>
          </div>
          <p className="text-gray-600 text-sm mb-6">
            Confirm your details for our records
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter first name"
                className={errors.firstName ? "border-red-300" : ""}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Second Name *
              </label>
              <Input
                value={formData.secondName}
                onChange={(e) =>
                  handleInputChange("secondName", e.target.value)
                }
                placeholder="Enter second name"
                className={errors.secondName ? "border-red-300" : ""}
              />
              {errors.secondName && (
                <p className="text-red-500 text-xs mt-1">{errors.secondName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email ID *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                className={errors.email ? "border-red-300" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className={errors.phone ? "border-red-300" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization *
              </label>
              <Select
                value={formData.specialization}
                onValueChange={(value) =>
                  handleInputChange("specialization", value)
                }
              >
                <SelectTrigger
                  className={errors.specialization ? "border-red-300" : ""}
                >
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weight Training">
                    Weight Training
                  </SelectItem>
                  <SelectItem value="Cardio Training">
                    Cardio Training
                  </SelectItem>
                  <SelectItem value="Yoga">Yoga</SelectItem>
                  <SelectItem value="Strength Training">
                    Strength Training
                  </SelectItem>
                  <SelectItem value="CrossFit">CrossFit</SelectItem>
                  <SelectItem value="Nutrition">Nutrition</SelectItem>
                  <SelectItem value="Pilates">Pilates</SelectItem>
                  <SelectItem value="Sports Training">
                    Sports Training
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.specialization && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.specialization}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience (Years) *
              </label>
              <Input
                type="number"
                min="0"
                value={formData.experience}
                onChange={(e) =>
                  handleInputChange("experience", e.target.value)
                }
                placeholder="Enter years of experience"
                className={errors.experience ? "border-red-300" : ""}
              />
              {errors.experience && (
                <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <MapPin className="text-gray-400 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Address</h2>
          </div>
          <p className="text-gray-600 text-sm mb-6">
            Confirm your address for our records
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pin code *
              </label>
              <Input
                value={formData.pinCode}
                onChange={(e) => handleInputChange("pinCode", e.target.value)}
                placeholder="Enter pin code"
                className={errors.pinCode ? "border-red-300" : ""}
              />
              {errors.pinCode && (
                <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <Input
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter city"
                className={errors.city ? "border-red-300" : ""}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <Input
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="Enter state"
                className={errors.state ? "border-red-300" : ""}
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <Input
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="Enter country"
                className={errors.country ? "border-red-300" : ""}
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <Textarea
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter full address"
              rows={3}
              className={errors.address ? "border-red-300" : ""}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gray-800 hover:bg-gray-900 text-white px-8"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Submit
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-8"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePT;
