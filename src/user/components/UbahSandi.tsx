import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const UbahSandi: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your password update logic here
    console.log("Password update submitted:", formData);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-xl p-8 shadow-lg min-h-[calc(100vh-4rem)]">
        <h1 className="text-[#12496E] text-3xl font-bold mb-12">UBAH SANDI</h1>

        <form onSubmit={handleSubmit} className="max-w-6xl space-y-8">
          <div className="space-y-4">
            <label className="block text-[#12496E] text-xl font-semibold">
              Sandi Sekarang
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#30BFCA] focus:border-transparent bg-white"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-6 h-6" />
                ) : (
                  <Eye className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[#12496E] text-xl font-semibold">
              Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#30BFCA] focus:border-transparent bg-white"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-6 h-6" />
                ) : (
                  <Eye className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[#12496E] text-xl font-semibold">
              Ulangi Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#30BFCA] focus:border-transparent bg-white"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-6 h-6" />
                ) : (
                  <Eye className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <button
              type="submit"
              className="bg-[#12496E] hover:bg-[#0d3655] text-white text-xl font-semibold px-12 py-4 rounded-xl transition-colors"
            >
              PERBARUI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UbahSandi;
