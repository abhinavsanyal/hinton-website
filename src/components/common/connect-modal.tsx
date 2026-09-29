"use client";
import { useEffect, useRef } from "react";
import { useUIStore } from "@/store/use-ui-store";
import { EnquiryForm } from "@/components/contact/enquiry-form";
import { WHATSAPP_CONTACT_URL } from "@/lib/whatsapp";

export const ConnectModal = () => {
  const { isConnectModalOpen, closeConnectModal } = useUIStore();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!isConnectModalOpen) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.current?.showModal(); document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; if (previousFocus instanceof HTMLElement) previousFocus.focus(); };
  }, [isConnectModalOpen]);
  return <dialog ref={dialog} className="enquiry-dialog" aria-labelledby="enquiry-dialog-title" onCancel={closeConnectModal} onClick={event => { if (event.target === event.currentTarget) closeConnectModal(); }}>
    <div className="enquiry-dialog-inner"><button type="button" className="quiet-button enquiry-close" aria-label="Close enquiry" onClick={closeConnectModal}>×</button>
      <p className="editorial-kicker">From your first idea to the final frame</p><h2 id="enquiry-dialog-title">Let’s make something<br />worth watching.</h2>
      <p className="editorial-lede">Tell us where you want to start. We’ll help shape the next step.</p>
      <EnquiryForm onSuccess={closeConnectModal} />
      <div className="enquiry-alternatives"><a href={WHATSAPP_CONTACT_URL} target="_blank" rel="noopener noreferrer">Chat on WhatsApp ↗</a><a href="https://cal.com/abhinava-sanyal-jdq1dz/30min" target="_blank" rel="noopener noreferrer" data-cta>Choose a time to talk ↗</a></div>
    </div>
  </dialog>;
};
