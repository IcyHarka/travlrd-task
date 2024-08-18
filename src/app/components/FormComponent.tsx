"use client";
import React, { useState } from "react";
import { Input, Select, SelectItem, Slider, Button } from "@nextui-org/react";
import supabase from "@/lib/supabaseClient";
import { Resend } from "resend";
import { EmailTemplate } from "./email-template";

interface FormData {
  name: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  visitors: string;
  conversion_rate: number;
  optimized_conversion?: number;
}

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default function FormComponent() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMesssage] = useState("");
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    visitors: "",
    conversion_rate: 1,
  });

  const industries = [
    { label: "Information Technology", percentage: 1.5 },
    { label: "Clothing & Fashion", percentage: 2.25 },
    { label: "Sports", percentage: 1.33 },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      industry: e.target.value,
    });
    setErrors({
      ...errors,
      industry: "",
    });
  };

  const handleSliderChange = (value: number | number[]) => {
    if (typeof value === "number") {
      setFormData({
        ...formData,
        conversion_rate: value,
      });
    }
  };

  const validateForm = () => {
    let newErrors: Partial<FormData> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is not valid";
    if (!formData.phone) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";
    if (!formData.industry) newErrors.industry = "Industry is required";
    if (!formData.visitors) newErrors.visitors = "Visitors field is required";
    else if (isNaN(Number(formData.visitors)))
      newErrors.visitors = "Visitors must be a number";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMesssage("");

    if (!validateForm()) return;

    setLoading(true);

    const parsedData = {
      ...formData,
      optimized_conversion:
        Number(formData.conversion_rate) * Number(formData.industry),
    };

    try {
      const { data, error } = await supabase
        .from("conversion_data")
        .insert([parsedData]);

      if (error) {
        throw error;
      }

      setSuccessMesssage(
        "Optimized conversion is: " +
          parsedData.optimized_conversion.toString() +
          "%"
      );
      const dataEmail = await resend.emails.send({
        from: "Travlrd <testtask@resend.dev>",
        to: [parsedData.email],
        subject: "Hello world",
        react: EmailTemplate(parsedData),
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        website: "",
        industry: "",
        visitors: "",
        conversion_rate: 1,
      });
    } catch (error) {
      console.log("Data Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white w-full p-20 rounded-md">
      <div className="flex flex-wrap items-end mb-10 gap-4">
        <Input
          label="Name"
          labelPlacement="outside"
          placeholder="Enter your name"
          className="max-w-md"
          isRequired
          name="name"
          onChange={handleInputChange}
          value={formData.name}
          errorMessage={errors.name}
          isInvalid={!!errors.name}
        />
        <Input
          label="Email"
          labelPlacement="outside"
          placeholder="Enter your email"
          className="max-w-md"
          type="email"
          isRequired
          name="email"
          onChange={handleInputChange}
          value={formData.email}
          errorMessage={errors.email}
          isInvalid={!!errors.email}
        />
        <Input
          label="Phone"
          labelPlacement="outside"
          placeholder="Enter your phone"
          className="max-w-md"
          type="text"
          isRequired
          name="phone"
          onChange={handleInputChange}
          value={formData.phone}
          errorMessage={errors.phone}
          isInvalid={!!errors.phone}
        />
        <Input
          label="Website"
          labelPlacement="outside"
          placeholder="Enter your website"
          className="max-w-md"
          name="website"
          onChange={handleInputChange}
          value={formData.website}
        />
        <Select
          labelPlacement="outside"
          label="Industry"
          className="max-w-md"
          isRequired
          name="industry"
          onChange={handleSelectChange}
          isInvalid={!!errors.industry}
          errorMessage={errors.industry}
        >
          {industries.map((industry) => (
            <SelectItem
              key={industry.percentage.toString()}
              value={industry.percentage.toString()}
            >
              {industry.label}
            </SelectItem>
          ))}
        </Select>
        <Input
          label="Monthly new visitors"
          labelPlacement="outside"
          placeholder="Enter your monthly new visitors"
          className="max-w-md"
          name="visitors"
          onChange={handleInputChange}
          value={formData.visitors}
          errorMessage={errors.visitors}
          isInvalid={!!errors.visitors}
        />
        <Slider
          label="Current conversion rate (%)"
          step={0.5}
          maxValue={10}
          minValue={1}
          defaultValue={1}
          className="max-w-md"
          onChange={handleSliderChange}
        />
      </div>
      <Button color="primary" type="submit" disabled={loading}>
        Calculate my optimized conversion rate
      </Button>
      {successMessage && <p>{successMessage}</p>}
    </form>
  );
}
