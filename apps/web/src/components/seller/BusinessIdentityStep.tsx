"use client";

import React from "react";
import { Building } from "lucide-react";
import { EntityType } from "./types";

interface BusinessIdentityStepProps {
  businessName: string;
  setBusinessName: (val: string) => void;
  tradeName: string;
  setTradeName: (val: string) => void;
  entityType: EntityType;
  setEntityType: (val: EntityType) => void;
  category: string;
  setCategory: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  addressLine1: string;
  setAddressLine1: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  stateName: string;
  setStateName: (val: string) => void;
  pincode: string;
  setPincode: (val: string) => void;
}

export function BusinessIdentityStep({
  businessName,
  setBusinessName,
  tradeName,
  setTradeName,
  entityType,
  setEntityType,
  category,
  setCategory,
  phone,
  setPhone,
  addressLine1,
  setAddressLine1,
  city,
  setCity,
  stateName,
  setStateName,
  pincode,
  setPincode,
}: BusinessIdentityStepProps) {
  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Building className="w-4 h-4 text-indigo-600" /> 1. Business & Artisan Profile
        </h2>
        <p className="text-xs text-zinc-500">Provide official registered details as per government records.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
            Legal Entity / Business Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Royal Heritage Crafts Cooperative"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
            Brand / Trade Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Royal Heritage"
            value={tradeName}
            onChange={(e) => setTradeName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
            Entity Classification *
          </label>
          <select
            value={entityType}
            onChange={(e: any) => setEntityType(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="individual_craftsman">Individual Master Artisan / Craftsman</option>
            <option value="artisan_cooperative">Rural Artisan Cooperative / SHG</option>
            <option value="proprietorship">Sole Proprietorship</option>
            <option value="partnership">Partnership Firm / LLP</option>
            <option value="pvt_ltd">Private Limited Company</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
            Craft Specialization *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Handicrafts & Wooden Decor">Handicrafts & Wooden Decor</option>
            <option value="Crochet & Woolen Charms">Crochet & Woolen Charms</option>
            <option value="Pottery & Ceramic Works">Pottery & Ceramic Works</option>
            <option value="Handloom Textiles & Sarees">Handloom Textiles & Sarees</option>
            <option value="Brass & Metal Artwork">Brass & Metal Artwork</option>
            <option value="Ayurvedic Wellness & Teas">Ayurvedic Wellness & Teas</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
            Authorized Contact Phone *
          </label>
          <input
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
            Registered Address Line 1 *
          </label>
          <input
            type="text"
            required
            placeholder="Plot / Street / Village"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">City / District *</label>
          <input
            type="text"
            required
            placeholder="e.g. Jaipur"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">State *</label>
          <input
            type="text"
            required
            placeholder="e.g. Rajasthan"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">PIN Code *</label>
          <input
            type="text"
            maxLength={6}
            required
            placeholder="302001"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
