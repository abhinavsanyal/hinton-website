import { WHATSAPP_CONTACT_URL } from "@/lib/whatsapp";
export function FormFeedback({ error }: { error: string }) {
  if (!error) return null;
  return <div className="form-feedback" role="alert"><p>{error}</p><div className="action-row"><a className="quiet-button" href={WHATSAPP_CONTACT_URL} target="_blank" rel="noopener noreferrer">Continue on WhatsApp ↗</a><a className="quiet-button" href="mailto:abhinava@hintonstudios.com">Email the studio ↗</a></div></div>;
}
