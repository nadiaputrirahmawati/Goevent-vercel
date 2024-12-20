import React, { useState } from "react";
import api from "../../services/api";
import FormCard from "../components/FormCard";
import PasswordInput from "../components/PasswordInput";
import Button from "../components/ButtonProfile";
import axios from "axios";
import Swal from "sweetalert2";

const UbahSandi = () => {
  const [formData, setFormData] = useState({
    password: "",
    pwbaru: "",
    confirmpw: "",
  });

  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.pwbaru !== formData.confirmpw) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Kata sandi baru tidak cocok",
      });
      return;
    }

    try {
      setLoading(true);
      // setError(null);
      // setSuccess(null);

      const response = await api.put("/users/updatePassword", {
        password: formData.password,
        pwbaru: formData.pwbaru,
        confirmpw: formData.confirmpw,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Kata sandi berhasil diperbarui",
        });

        // Reset form setelah berhasil
        setFormData({
          password: "",
          pwbaru: "",
          confirmpw: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Gagal mengubah kata sandi",
        });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Terjadi kesalahan",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Terjadi kesalahan tidak terduga",
        });
      }
      console.error("Error updating password:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <FormCard title="UBAH SANDI">
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl space-y-6 md:space-y-8"
      >
        <PasswordInput
          label="Sandi Sekarang"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <PasswordInput
          label="Sandi Baru"
          name="pwbaru"
          value={formData.pwbaru}
          onChange={handleChange}
        />

        <PasswordInput
          label="Ulangi Kata Sandi"
          name="confirmpw"
          value={formData.confirmpw}
          onChange={handleChange}
        />

        <div className="flex justify-end pt-6 md:pt-8">
          <Button type="submit" disabled={loading}>
            {loading ? "Memperbarui..." : "PERBARUI"}
          </Button>
        </div>
      </form>
    </FormCard>
  );
};

export default UbahSandi;
