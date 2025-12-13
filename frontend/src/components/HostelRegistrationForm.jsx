import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const HostelRegistrationForm = ({ adminData, onSubmitSuccess, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      hostel_name: '',
      hostel_address: '',
      hostel_city: '',
      hostel_state: '',
      hostel_country: '',
      hostel_zip_code: '',
      contact_phone: '',
      total_rooms: '',
      floors: '',
      business_hours: '',
      gst: '',
      fssai: '',
    },
  })

  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (data) => {
    setErrorMessage('')
    try {
      // Combine hostel data with admin data
      const payload = {
        ...data,
        adminData,
      }

      console.log('Submitting hostel registration:', payload)

      // TODO: Call API endpoint that creates hostel linked to the current user
      // const result = await CREATE_HOSTEL(payload)

      // On success, notify parent component
      if (onSubmitSuccess) {
        onSubmitSuccess(payload)
      }
    } catch (error) {
      setErrorMessage(error.message || 'Hostel registration failed')
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Your Hostel</h1>
        <p className="text-sm text-gray-600 mb-6">
          Now let's set up your hostel. Fill in the details below and we'll get it verified.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* ========== HOSTEL INFORMATION SECTION ========== */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hostel Information *</h2>
            <p className="text-sm text-gray-600 mb-4">
              Provide details about your hostel. You can add more hostels later.
            </p>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Hostel name *</span>
              <input
                type="text"
                placeholder="e.g. Green Valley Hostel"
                {...register('hostel_name', { required: 'Hostel name is required' })}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.hostel_name ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.hostel_name && <p className="mt-1 text-xs text-red-600">{errors.hostel_name.message}</p>}
            </label>

            <label className="block mt-4">
              <span className="text-sm font-medium text-gray-700">Address *</span>
              <input
                type="text"
                placeholder="123 Main Street"
                {...register('hostel_address', { required: 'Hostel address is required' })}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.hostel_address ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.hostel_address && <p className="mt-1 text-xs text-red-600">{errors.hostel_address.message}</p>}
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">City *</span>
                <input
                  type="text"
                  placeholder="New York"
                  {...register('hostel_city', { required: 'City is required' })}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.hostel_city ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.hostel_city && <p className="mt-1 text-xs text-red-600">{errors.hostel_city.message}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">State *</span>
                <input
                  type="text"
                  placeholder="NY"
                  {...register('hostel_state', { required: 'State is required' })}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.hostel_state ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.hostel_state && <p className="mt-1 text-xs text-red-600">{errors.hostel_state.message}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Zip Code *</span>
                <input
                  type="text"
                  placeholder="10001"
                  {...register('hostel_zip_code', { required: 'Zip code is required' })}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.hostel_zip_code ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.hostel_zip_code && <p className="mt-1 text-xs text-red-600">{errors.hostel_zip_code.message}</p>}
              </label>
            </div>

            <label className="block mt-4">
              <span className="text-sm font-medium text-gray-700">Country *</span>
              <input
                type="text"
                placeholder="United States"
                {...register('hostel_country', { required: 'Country is required' })}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.hostel_country ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.hostel_country && <p className="mt-1 text-xs text-red-600">{errors.hostel_country.message}</p>}
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Total rooms *</span>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 20"
                  {...register('total_rooms', { required: 'Number of rooms is required' })}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.total_rooms ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.total_rooms && <p className="mt-1 text-xs text-red-600">{errors.total_rooms.message}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Floors *</span>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 3"
                  {...register('floors', { required: 'Number of floors is required' })}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.floors ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.floors && <p className="mt-1 text-xs text-red-600">{errors.floors.message}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Business hours (optional)</span>
                <input
                  type="text"
                  placeholder="e.g. 9:00 - 21:00"
                  {...register('business_hours')}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-200"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Contact phone (optional)</span>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  {...register('contact_phone')}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-200"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">GST number (optional)</span>
                <input
                  type="text"
                  placeholder="GSTXXXXXXXXXXXXXXXX"
                  {...register('gst')}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-200"
                />
              </label>
            </div>

            <label className="block mt-4">
              <span className="text-sm font-medium text-gray-700">FSSAI number (optional)</span>
              <input
                type="text"
                placeholder="FSSAI License Number"
                {...register('fssai')}
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-200"
              />
            </label>
          </div>

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
                isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Creating hostel...' : 'Create Hostel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HostelRegistrationForm
