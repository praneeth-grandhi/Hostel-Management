import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const HostelVerificationForm = ({ hostelData, onSubmitSuccess, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      hostel_type: '',
      food_provided: false,
      police_verification: false,
      police_verification_reference: '',
      gst_number: '',
      fssai_license: '',
    },
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [filePreview, setFilePreview] = useState({
    owner_id_proof: null,
    property_proof: null,
    trade_license: null,
  })

  const policeVerification = watch('police_verification')

  const handleFileChange = (fieldName, file) => {
    if (!file) {
      setFilePreview((prev) => ({
        ...prev,
        [fieldName]: null,
      }))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setFilePreview((prev) => ({
        ...prev,
        [fieldName]: {
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
        },
      }))
    }
    reader.readAsDataURL(file)
  }

  const onSubmit = async (data) => {
    setErrorMessage('')
    try {
      // Collect file objects from input elements
      const fileInputs = document.querySelectorAll('input[type="file"]')
      const files = {
        owner_id_proof: null,
        property_proof: null,
        trade_license: null,
      }

      fileInputs.forEach((input) => {
        const fieldName = input.getAttribute('name') || input.getAttribute('data-field')
        if (fieldName && input.files && input.files[0]) {
          files[fieldName] = input.files[0]
        }
      })

      // Prepare verification data with file objects
      const verificationPayload = {
        hostel_type: data.hostel_type,
        food_provided: data.food_provided,
        police_verification: data.police_verification,
        police_verification_reference: data.police_verification_reference,
        gst_number: data.gst_number || '',
        fssai_license: data.fssai_license || '',
        // Include file objects
        owner_id_proof: files.owner_id_proof,
        property_proof: files.property_proof,
        trade_license: files.trade_license,
      }

      console.log('Submitting hostel verification with files:', verificationPayload)

      // On success, notify parent component with all verification data including files
      if (onSubmitSuccess) {
        onSubmitSuccess(verificationPayload)
      }
    } catch (error) {
      setErrorMessage(error.message || 'Verification submission failed')
      console.error('Verification submission error:', error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Complete Hostel Verification</h1>
        <p className="text-sm text-gray-600 mb-6">
          Upload required documents and provide additional information for verification. This ensures we maintain high standards.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* ========== HOSTEL TYPE & AMENITIES ========== */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hostel Type & Services</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Hostel Type *</span>
                <select
                  {...register('hostel_type', { required: 'Hostel type is required' })}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.hostel_type ? 'border-red-400' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select hostel type</option>
                  <option value="pg">PG (Paying Guest)</option>
                  <option value="hostel">Hostel</option>
                  <option value="hotel">Hotel</option>
                </select>
                {errors.hostel_type && <p className="mt-1 text-xs text-red-600">{errors.hostel_type.message}</p>}
              </label>

              <label className="flex items-center gap-3 mt-8">
                <input
                  type="checkbox"
                  {...register('food_provided')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Food provided at hostel</span>
              </label>
            </div>
          </div>

          {/* ========== IDENTITY & PROPERTY DOCUMENTS ========== */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Identity & Property Documents</h2>
            <p className="text-sm text-gray-600 mb-4">Upload clear copies of your documents (PDF, JPG, PNG - max 5MB each)</p>

            {/* Owner Identity Proof */}
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Owner Identity Proof (Aadhaar/PAN) *</span>
              <p className="text-xs text-gray-500 mb-2">Government-issued ID proof</p>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    handleFileChange('owner_id_proof', e.target.files?.[0])
                  }}
                  className={`block w-full px-4 py-2 border rounded-lg text-sm ${
                    errors.owner_id_proof ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
              </div>
              {filePreview.owner_id_proof && (
                <p className="mt-2 text-xs text-green-600">
                  ✓ {filePreview.owner_id_proof.name} ({filePreview.owner_id_proof.size})
                </p>
              )}
              {errors.owner_id_proof && <p className="mt-1 text-xs text-red-600">{errors.owner_id_proof.message}</p>}
            </label>

            {/* Property Proof */}
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Property Proof (Electricity Bill / Lease Deed) *</span>
              <p className="text-xs text-gray-500 mb-2">Recent utility bill or property lease document</p>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    handleFileChange('property_proof', e.target.files?.[0])
                  }}
                  className={`block w-full px-4 py-2 border rounded-lg text-sm ${
                    errors.property_proof ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
              </div>
              {filePreview.property_proof && (
                <p className="mt-2 text-xs text-green-600">
                  ✓ {filePreview.property_proof.name} ({filePreview.property_proof.size})
                </p>
              )}
              {errors.property_proof && <p className="mt-1 text-xs text-red-600">{errors.property_proof.message}</p>}
            </label>

            {/* Trade License */}
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Trade License (if available)</span>
              <p className="text-xs text-gray-500 mb-2">Business registration or trade license</p>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    handleFileChange('trade_license', e.target.files?.[0])
                  }}
                  className="block w-full px-4 py-2 border rounded-lg text-sm border-gray-200"
                />
              </div>
              {filePreview.trade_license && (
                <p className="mt-2 text-xs text-green-600">
                  ✓ {filePreview.trade_license.name} ({filePreview.trade_license.size})
                </p>
              )}
            </label>
          </div>

          {/* ========== POLICE VERIFICATION ========== */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Police Verification</h2>

            <label className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                {...register('police_verification')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Property has police verification clearance
              </span>
            </label>

            {policeVerification && (
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Police Verification Reference *</span>
                <input
                  type="text"
                  placeholder="e.g. PV-2024-12345 or verification report number"
                  {...register('police_verification_reference', {
                    validate: (value) =>
                      !policeVerification || value.trim() !== ''
                        ? true
                        : 'Reference number is required when police verification is selected',
                  })}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.police_verification_reference ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.police_verification_reference && (
                  <p className="mt-1 text-xs text-red-600">{errors.police_verification_reference.message}</p>
                )}
              </label>
            )}
          </div>

          {/* ========== REGISTRATION NUMBERS ========== */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Registration Numbers</h2>
            <p className="text-sm text-gray-600 mb-4">
              If your hostel operates a food service or has business registration, provide these numbers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">GST Number (optional)</span>
                <input
                  type="text"
                  placeholder="GSTXXXXXXXXXXXXXXXX"
                  {...register('gst_number')}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-200"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">FSSAI License Number (optional)</span>
                <input
                  type="text"
                  placeholder="FSSAI License Number"
                  {...register('fssai_license')}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-200"
                />
              </label>
            </div>
          </div>

          {/* ========== INFORMATION BOX ========== */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Our team will review all submitted documents within 24-48 hours</li>
              <li>• We may request additional information if needed</li>
              <li>• You will receive an email with the verification status</li>
              <li>• Once approved, your hostel will be active and visible to customers</li>
            </ul>
          </div>

          {/* ========== BUTTONS ========== */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-lg text-white font-medium ${
                isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSubmitting ? 'Submitting documents...' : 'Complete Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HostelVerificationForm
