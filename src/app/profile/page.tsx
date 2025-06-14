"use client";
import GeneralInfoForm from "@/components/profile/GeneralInfoForm";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-gray-600 text-sm">Manage your account settings and preferences.</p>
      </div>

      <ProfileHeader />
      <ProfileTabs onSelect={setActiveTab} />

      {activeTab === "General" && <GeneralInfoForm />}
      {activeTab === "Security" && <div>Security form goes here</div>}
      {activeTab === "Privacy" && <div>Privacy settings go here</div>}
      {activeTab === "Notifications" && <div>Notification preferences go here</div>}

      {/* {activeTab === "General" && <DangerZone />} */}
    </div>
  );
}
