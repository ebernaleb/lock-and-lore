'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import SignaturePad from '@/components/signature-pad';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormData {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  isMinor: boolean;
  guardianName: string;
  guardianPhone: string;
  liabilityRelease: boolean;
  participantSignature: string;
  guardianSignature: string;
}

const initialFormData: FormData = {
  fullName: '',
  dateOfBirth: '',
  email: '',
  phone: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  isMinor: false,
  guardianName: '',
  guardianPhone: '',
  liabilityRelease: false,
  participantSignature: '',
  guardianSignature: '',
};

export default function WaiverPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (name: keyof FormData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
    if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Emergency contact phone is required';

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.isMinor) {
      if (!formData.guardianName.trim()) newErrors.guardianName = 'Guardian name is required';
      if (!formData.guardianPhone.trim()) newErrors.guardianPhone = 'Guardian phone is required';
      if (!formData.guardianSignature) newErrors.guardianSignature = 'Guardian signature is required';
    }

    if (!formData.liabilityRelease) newErrors.liabilityRelease = 'You must agree to the waiver terms';
    if (!formData.participantSignature) newErrors.participantSignature = 'Signature is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />

        <div className="min-h-screen flex items-center justify-center px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full text-center"
          >
            <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </motion.div>

              <h1
                className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight uppercase"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                Waiver Submitted
              </h1>

              <p className="text-lg text-white/60 mb-8">
                Thank you for completing the waiver. You&apos;re all set for your escape room adventure.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  href="/"
                  className="bg-white text-black hover:bg-primary hover:text-white rounded-full px-8 py-6"
                >
                  Return Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData(initialFormData);
                  }}
                  className="rounded-full px-8 py-6"
                >
                  Submit Another
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 border-b border-white/5">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight leading-[0.9] uppercase"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              Participant Waiver
            </h1>

            <p className="text-lg text-white/60 max-w-xl mx-auto">
              Required for all participants before your escape room experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Participant Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/40 border border-white/10 rounded-lg p-6 md:p-8"
            >
              <h2
                className="text-xl md:text-2xl font-bold text-white mb-6 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                Participant Information
              </h2>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="fullName" required>Full Legal Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? 'border-primary' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-primary text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="dateOfBirth" required>Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={errors.dateOfBirth ? 'border-primary' : ''}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-primary text-sm mt-1">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" required>Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'border-primary' : ''}
                    />
                    {errors.phone && (
                      <p className="text-primary text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" required>Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'border-primary' : ''}
                  />
                  {errors.email && (
                    <p className="text-primary text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-zinc-900/40 border border-white/10 rounded-lg p-6 md:p-8"
            >
              <h2
                className="text-xl md:text-2xl font-bold text-white mb-6 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                Emergency Contact
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="emergencyContactName" required>Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    className={errors.emergencyContactName ? 'border-primary' : ''}
                  />
                  {errors.emergencyContactName && (
                    <p className="text-primary text-sm mt-1">{errors.emergencyContactName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyContactPhone" required>Contact Phone</Label>
                  <Input
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    className={errors.emergencyContactPhone ? 'border-primary' : ''}
                  />
                  {errors.emergencyContactPhone && (
                    <p className="text-primary text-sm mt-1">{errors.emergencyContactPhone}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Minor Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/40 border border-white/10 rounded-lg p-6 md:p-8"
            >
              <Checkbox
                id="isMinor"
                checked={formData.isMinor}
                onChange={(e) => handleCheckboxChange('isMinor', e.target.checked)}
                label="Participant is under 18 years of age"
              />

              {formData.isMinor && (
                <div className="mt-6 pt-6 border-t border-white/10 space-y-5">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                    Parent/Guardian Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="guardianName" required>Guardian Name</Label>
                      <Input
                        id="guardianName"
                        name="guardianName"
                        value={formData.guardianName}
                        onChange={handleInputChange}
                        className={errors.guardianName ? 'border-primary' : ''}
                      />
                      {errors.guardianName && (
                        <p className="text-primary text-sm mt-1">{errors.guardianName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="guardianPhone" required>Guardian Phone</Label>
                      <Input
                        id="guardianPhone"
                        name="guardianPhone"
                        type="tel"
                        value={formData.guardianPhone}
                        onChange={handleInputChange}
                        className={errors.guardianPhone ? 'border-primary' : ''}
                      />
                      {errors.guardianPhone && (
                        <p className="text-primary text-sm mt-1">{errors.guardianPhone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Waiver Agreement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-zinc-900/40 border border-white/10 rounded-lg p-6 md:p-8"
            >
              <h2
                className="text-xl md:text-2xl font-bold text-white mb-6 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                Waiver & Release
              </h2>

              <div className="text-sm text-white/70 mb-6 leading-relaxed space-y-4">
                <p>
                  I understand that participation in escape room activities involves inherent risks including physical exertion,
                  navigating in dim lighting, confined spaces, fog effects, strobe lights, and loud sounds. I voluntarily assume
                  all risks associated with participation.
                </p>
                <p>
                  In consideration for being permitted to participate, I hereby release, waive, and discharge Lock & Lore, its
                  owners, employees, and agents from any and all liability, claims, and causes of action arising out of or related
                  to any loss, damage, or injury that may be sustained while participating.
                </p>
                <p>
                  I agree to follow all rules and staff instructions, and understand that violation may result in removal without refund.
                </p>
              </div>

              <Checkbox
                id="liabilityRelease"
                checked={formData.liabilityRelease}
                onChange={(e) => handleCheckboxChange('liabilityRelease', e.target.checked)}
                label="I have read, understand, and agree to the waiver terms above"
              />
              {errors.liabilityRelease && (
                <p className="text-primary text-sm mt-2">{errors.liabilityRelease}</p>
              )}
            </motion.div>

            {/* Signatures */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900/40 border border-white/10 rounded-lg p-6 md:p-8"
            >
              <h2
                className="text-xl md:text-2xl font-bold text-white mb-6 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                Signature
              </h2>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="participantSignature" required>
                    {formData.isMinor ? 'Participant Signature' : 'Your Signature'}
                  </Label>
                  <SignaturePad
                    value={formData.participantSignature}
                    onChange={(signature) => {
                      setFormData(prev => ({ ...prev, participantSignature: signature }));
                      if (errors.participantSignature) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.participantSignature;
                          return newErrors;
                        });
                      }
                    }}
                    className={errors.participantSignature ? 'border-primary' : ''}
                  />
                  {errors.participantSignature && (
                    <p className="text-primary text-sm mt-2">{errors.participantSignature}</p>
                  )}
                </div>

                {formData.isMinor && (
                  <div className="pt-6 border-t border-white/10">
                    <Label htmlFor="guardianSignature" required>
                      Parent/Guardian Signature
                    </Label>
                    <p className="text-xs text-white/50 mb-3">
                      Required for participants under 18
                    </p>
                    <SignaturePad
                      value={formData.guardianSignature}
                      onChange={(signature) => {
                        setFormData(prev => ({ ...prev, guardianSignature: signature }));
                        if (errors.guardianSignature) {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.guardianSignature;
                            return newErrors;
                          });
                        }
                      }}
                      className={errors.guardianSignature ? 'border-primary' : ''}
                    />
                    {errors.guardianSignature && (
                      <p className="text-primary text-sm mt-2">{errors.guardianSignature}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex justify-center pt-4"
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-black hover:bg-primary hover:text-white rounded-full px-12 py-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Waiver'}
              </Button>
            </motion.div>

            {/* Error Summary */}
            {Object.keys(errors).length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary/10 border border-primary/20 rounded-lg p-5"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-bold mb-2">Please correct the following:</h3>
                    <ul className="text-sm text-white/70 space-y-1">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
