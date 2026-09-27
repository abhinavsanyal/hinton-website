import test from "node:test";
import assert from "node:assert/strict";
import { createConversionTracker, contactConversionMethod, ADS_CONVERSION_EVENT } from "../src/lib/google-conversions.ts";

test("only approved direct contact destinations count", () => {
  assert.equal(contactConversionMethod("tel:+919330226381"), "phone_click");
  assert.equal(contactConversionMethod("https://wa.me/919330226381?text=Hello"), "whatsapp_click");
  for (const href of ["mailto:test@example.com", "/work", "https://example.com/wa.me", "https://wa.me.example.com", "javascript:alert(1)"])
    assert.equal(contactConversionMethod(href), null);
});
test("consent and available tag are required; successful enquiries deduplicate by server ID", () => {
  const send = createConversionTracker();
  const calls: unknown[][] = [];
  const gtag = (...args: unknown[]) => { calls.push(args); };
  assert.equal(send(gtag, false, "contact_form", {eventId:"lead-1"}), false);
  assert.equal(send(undefined, true, "contact_form", {eventId:"lead-1"}), false);
  assert.equal(send(gtag, true, "contact_form", {eventId:"lead-1"}), true);
  assert.equal(send(gtag, true, "contact_form", {eventId:"lead-1"}), false);
  assert.deepEqual(calls, [["event", ADS_CONVERSION_EVENT, {method:"contact_form", transaction_id:"lead-1"}]]);
});
test("blocked tag cannot trap navigation; late and repeated callbacks navigate once", (t) => {
  t.mock.timers.enable({apis:["setTimeout"]});
  let navigations = 0;
  let callback: (() => void) | undefined;
  createConversionTracker()((...args) => { callback = (args[2] as {event_callback:()=>void}).event_callback; }, true, "phone_click", {navigate:()=>{navigations++;}});
  t.mock.timers.tick(1999);
  assert.equal(navigations, 0);
  t.mock.timers.tick(1);
  callback?.(); callback?.();
  assert.equal(navigations, 1);
});
test("prompt vendor callback completes navigation before timeout", (t) => {
  t.mock.timers.enable({apis:["setTimeout"]});
  let navigations = 0;
  createConversionTracker()((...args) => (args[2] as {event_callback:()=>void}).event_callback(), true, "whatsapp_click", {navigate:()=>{navigations++;}});
  assert.equal(navigations, 1);
  t.mock.timers.tick(2000);
  assert.equal(navigations, 1);
});
