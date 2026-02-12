import { Layout } from "@/components/layout/Layout";
import { MapPin, Send, User, Mail, FileText, MessageSquare, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";

interface KeyContact {
  id: number;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  phone: string;
  email: string;
  imageUrl: string;
  sortOrder: number;
  visible: boolean;
}

export default function Contact() {
  const { t, lang } = useLanguage();

  const { data: keyContacts = [] } = useQuery<KeyContact[]>({
    queryKey: ["/api/key-contacts"],
    queryFn: async () => {
      const res = await fetch("/api/key-contacts");
      if (!res.ok) return [];
      return res.json();
    },
  });

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-neutral-50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{t("send_message")}</h1>
          <p className="text-neutral-500 text-sm mb-10">{t("get_in_touch")}</p>

          <div className="bg-white rounded-2xl shadow-lg shadow-neutral-200/50 border border-neutral-100 p-6 md:p-8">
            <form className="space-y-6 text-left">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-neutral-300 flex-shrink-0" />
                  <label className="text-sm font-semibold text-neutral-500 whitespace-nowrap min-w-[90px]">{t("full_name")}</label>
                  <input
                    data-testid="input-contact-name"
                    type="text"
                    className="w-full border-b-2 border-neutral-200 py-3 focus:border-primary outline-none transition-colors bg-transparent text-neutral-800"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-neutral-300 flex-shrink-0" />
                  <label className="text-sm font-semibold text-neutral-500 whitespace-nowrap min-w-[110px]">{t("email_addr")}</label>
                  <input
                    data-testid="input-contact-email"
                    type="email"
                    className="w-full border-b-2 border-neutral-200 py-3 focus:border-primary outline-none transition-colors bg-transparent text-neutral-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText size={16} className="text-neutral-300 flex-shrink-0" />
                <label className="text-sm font-semibold text-neutral-500 whitespace-nowrap min-w-[90px]">{t("subject")}</label>
                <input
                  data-testid="input-contact-subject"
                  type="text"
                  className="w-full border-b-2 border-neutral-200 py-3 focus:border-primary outline-none transition-colors bg-transparent text-neutral-800"
                />
              </div>

              <div className="flex gap-3">
                <MessageSquare size={16} className="text-neutral-300 flex-shrink-0 mt-3" />
                <label className="text-sm font-semibold text-neutral-500 whitespace-nowrap min-w-[90px] pt-3">{t("message")}</label>
                <textarea
                  data-testid="input-contact-message"
                  rows={5}
                  className="w-full border-2 border-neutral-200 rounded-lg py-3 px-3 focus:border-primary outline-none transition-colors bg-neutral-50/50 text-neutral-800 resize-none"
                />
              </div>

              <div className="text-center pt-2">
                <button data-testid="button-contact-submit" className="inline-flex items-center gap-3 bg-primary text-white px-14 py-4 rounded-lg uppercase text-xs font-bold tracking-widest hover:bg-black transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                  <Send size={16} />
                  {t("submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8 text-primary">{t("our_locations")}</h2>
              <div className="space-y-8">
                {[
                  { 
                    city: t("amman"), 
                    addr: "Wahet Ammoun Building, No. 185, 2nd floor, Amman, Jordan", 
                    mobile: "+962 79 0484745",
                    email: "sales@theexpertsjo.com",
                    mapUrl: "https://maps.app.goo.gl/q9S4aYVrdxUaR2YX7?g_st=iw"
                  }
                ].map((loc, i) => (
                  <div key={i} className="flex gap-6 group">
                    <a 
                      href={loc.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors flex-shrink-0"
                    >
                      <MapPin size={20} className="group-hover:text-white" />
                    </a>
                    <div>
                      <h4 className="font-serif font-bold text-lg">
                        <a href={loc.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                          {loc.city}
                        </a>
                      </h4>
                      <p className="text-neutral-500 text-sm mt-1">{loc.addr}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-primary text-sm font-bold">Mob: {loc.mobile}</p>
                        <p className="text-neutral-600 text-sm italic">{loc.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {keyContacts.length > 0 && (
              <div>
                <h2 data-testid="text-key-contacts" className="text-3xl font-serif font-bold mb-8 text-primary">
                  {lang === "AR" ? "جهات الاتصال الرئيسية" : "Key Contacts"}
                </h2>
                <div className="grid gap-8">
                  {keyContacts.map((contact) => (
                    <div key={contact.id} data-testid={`contact-keycontact-${contact.id}`} className="space-y-2">
                      <h4 className="font-serif font-bold text-xl text-neutral-900">
                        {lang === "AR" && contact.nameAr ? contact.nameAr : contact.nameEn}
                      </h4>
                      <p className="text-primary text-xs uppercase tracking-widest font-bold">
                        {lang === "AR" && contact.roleAr ? contact.roleAr : contact.roleEn}
                      </p>
                      <div className="text-sm text-neutral-600 space-y-1">
                        {contact.phone && (
                          <p className="flex items-center gap-2">
                            <Phone size={14} className="text-neutral-400" />
                            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">
                              {contact.phone}
                            </a>
                          </p>
                        )}
                        {contact.email && (
                          <p className="flex items-center gap-2">
                            <Mail size={14} className="text-neutral-400" />
                            <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                              {contact.email}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
