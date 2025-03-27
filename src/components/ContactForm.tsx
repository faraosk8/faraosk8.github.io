
import { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: ""
      });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="section-padding bg-clinic-cream relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-clinic-sage/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-clinic-rose/10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <span className="text-sm uppercase tracking-wider mb-2 text-clinic-brown inline-block">Get in Touch</span>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Schedule Your Consultation</h2>
            <p className="text-clinic-charcoal/80 mb-8">
              Take the first step toward enhancing your natural beauty. Fill out the form, and our team will contact you to schedule your personalized consultation.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="text-clinic-brown">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 10C20 14.4183 16.4183 18 12 18C7.58172 18 4 14.4183 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-1">Visit Us</h3>
                  <p className="text-clinic-charcoal/80 text-sm">
                    123 Beauty Lane, Suite 200<br/>
                    Los Angeles, CA 90210
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-clinic-brown">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5H21V19H3V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 5L12 14L21 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-1">Email Us</h3>
                  <p className="text-clinic-charcoal/80 text-sm">
                    info@auraclinic.com<br/>
                    appointments@auraclinic.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-clinic-brown">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22 20.4704 21.7893 20.9978 21.4142 21.3728C21.0391 21.7479 20.5117 21.9586 19.96 21.96C18.4536 21.9599 16.9685 21.6578 15.59 21.07C14.2899 20.5185 13.1259 19.7203 12.17 18.72C11.1678 17.7675 10.3694 16.6049 9.82 15.31C9.23072 13.9247 8.92985 12.4319 8.93 10.92C8.93088 10.3721 9.13934 9.84736 9.51161 9.47253C9.88388 9.09771 10.4096 8.8845 10.96 8.88H13.96C14.3845 8.87658 14.7952 9.03183 15.1187 9.32335C15.4421 9.61486 15.6536 10.0217 15.72 10.46C15.8365 11.2714 16.0565 12.0629 16.37 12.81C16.5245 13.1757 16.5737 13.5819 16.5117 13.9748C16.4497 14.3677 16.2792 14.7303 16.02 15.01L14.94 16.09C15.8805 17.9097 17.3108 19.3403 19.13 20.28L20.21 19.2C20.4897 18.9408 20.8523 18.7703 21.2452 18.7083C21.6381 18.6463 22.0443 18.6955 22.41 18.85C23.1571 19.1635 23.9486 19.3835 24.76 19.5C25.2034 19.5667 25.6126 19.7815 25.9033 20.1092C26.1941 20.437 26.3453 20.8517 26.34 21.28L22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-1">Call Us</h3>
                  <p className="text-clinic-charcoal/80 text-sm">
                    (555) 123-4567<br/>
                    Mon-Fri: 9am-7pm, Sat: 10am-4pm
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <div className="text-green-500 mb-4">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl mb-2">Thank You!</h3>
                  <p className="text-center text-clinic-charcoal/80">
                    Your message has been received. We'll contact you shortly to schedule your consultation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-clinic-beige rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-brown/30"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-clinic-beige rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-brown/30"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-clinic-beige rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-brown/30"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium mb-1">
                        Service of Interest
                      </label>
                      <select
                        id="service"
                        name="service"
                        required
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-clinic-beige rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-brown/30"
                      >
                        <option value="">Select a service</option>
                        <option value="facial-treatments">Facial Treatments</option>
                        <option value="hair-restoration">Hair Restoration</option>
                        <option value="skin-rejuvenation">Skin Rejuvenation</option>
                        <option value="consultation">General Consultation</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-clinic-beige rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-brown/30"
                    />
                  </div>
                  
                  <div className="mt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`btn-primary w-full ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? "Submitting..." : "Schedule Consultation"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
