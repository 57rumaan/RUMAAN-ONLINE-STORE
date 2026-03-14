import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Get in Touch</h1>
        <p className="text-muted-foreground text-lg">We're here to help and answer any question you might have.</p>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-[2rem] overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Info Side */}
          <div className="bg-primary p-10 text-primary-foreground">
            <h2 className="text-2xl font-display font-bold mb-6">Contact Information</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-primary-foreground/80">+92-313-1307143</p>
                  <p className="text-sm text-primary-foreground/60 mt-1">Mon-Fri from 9am to 12am</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-primary-foreground/80">57rumaan@gmail.com</p>
                  <p className="text-sm text-primary-foreground/60 mt-1">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Address</h4>
                  <p className="text-primary-foreground/80 leading-relaxed">
                    MULTAN<br/>
                   
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Minimal Map or Decor Side */}
          <div className="bg-muted p-10 flex items-center justify-center min-h-[300px]">
             <div className="text-center space-y-4">
               <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-display font-bold mx-auto shadow-xl">R</div>
               <h3 className="font-display font-bold text-xl">RUMAAN STORE</h3>
               <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">Your trusted tech partner in Pakistan.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
