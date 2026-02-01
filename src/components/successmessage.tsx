import { CheckCircle2, Heart } from 'lucide-react';

export function SuccessMessage() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-2xl shadow-xl p-12 space-y-6" style={{ border: '2px solid #C53542' }}>
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse" style={{ backgroundColor: '#C5354240' }}></div>
            <CheckCircle2 className="w-24 h-24 relative" style={{ color: '#C53542' }} strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold" style={{ color: '#C53542', fontFamily: 'DM Sans', fontWeight: 700 }}>Registration Successful!</h2>
          <p className="text-lg leading-relaxed" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 300 }}>
            Thank you for your interest in volunteering with us. Your application has been received successfully.
          </p>
        </div>

        <div className="rounded-xl p-6 space-y-3" style={{ backgroundColor: '#C5354210', border: '1px solid #C53542' }}>
          <div className="flex items-center justify-center gap-2" style={{ color: '#9C242F' }}>
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-semibold" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>What happens next?</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#091B27', fontFamily: 'DM Sans' }}>
            Our team will review your application and contact you within 3-5 business days to discuss the next steps
            in the volunteer onboarding process. We're excited to have you join our mission to support children's education!
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 font-medium rounded-lg transition-all"
          style={{ backgroundColor: '#F3F2F2', color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500, border: '1px solid #AFAFAF' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#AFAFAF'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F3F2F2'}
        >
          Submit Another Registration
        </button>
      </div>
    </div>
  );
}
