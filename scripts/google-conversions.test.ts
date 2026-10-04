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
  const send = createConversionTracker("G-J75JY1GDPW");
  const calls: unknown[][] = [];
  const gtag = (...args: unknown[]) => { calls.push(args); };
  assert.equal(send(gtag, false, "contact_form", {eventId:"lead-1"}), false);
  assert.equal(send(undefined, true, "contact_form", {eventId:"lead-1"}), false);
  assert.equal(send(gtag, true, "contact_form", {eventId:"lead-1"}), true);
  assert.equal(send(gtag, true, "contact_form", {eventId:"lead-1"}), false);
  assert.deepEqual(calls, [["event", "manual_event_REQUEST_QUOTE", {method:"contact_form", send_to:"G-J75JY1GDPW", transaction_id:"lead-1"}]]);
});
test("all approved lead methods reach the existing imported campaign action, never purchase", () => {
  const calls: unknown[][] = [];
  const send = createConversionTracker("G-J75JY1GDPW");
  for (const method of ["contact_form", "contact_modal", "project_brief", "website_report", "whatsapp_click", "phone_click"]) {
    send((...args) => calls.push(args), true, method);
  }
  assert.equal(ADS_CONVERSION_EVENT, "manual_event_REQUEST_QUOTE");
  assert.equal(calls.length, 6);
  for (const [command, event, params] of calls) {
    assert.equal(command, "event");
    assert.equal(event, "manual_event_REQUEST_QUOTE");
    assert.equal((params as Record<string, unknown>).send_to, "G-J75JY1GDPW");
  }
});
test("blocked tag cannot trap navigation; late and repeated callbacks navigate once", (t) => {
  t.mock.timers.enable({apis:["setTimeout"]});
  let navigations = 0;
  let callback: (() => void) | undefined;
  createConversionTracker("G-J75JY1GDPW")((...args) => { callback = (args[2] as {event_callback:()=>void}).event_callback; }, true, "phone_click", {navigate:()=>{navigations++;}});
  t.mock.timers.tick(1999);
  assert.equal(navigations, 0);
  t.mock.timers.tick(1);
  callback?.(); callback?.();
  assert.equal(navigations, 1);
});
test("prompt vendor callback completes navigation before timeout", (t) => {
  t.mock.timers.enable({apis:["setTimeout"]});
  let navigations = 0;
  createConversionTracker("G-J75JY1GDPW")((...args) => (args[2] as {event_callback:()=>void}).event_callback(), true, "whatsapp_click", {navigate:()=>{navigations++;}});
  assert.equal(navigations, 1);
  t.mock.timers.tick(2000);
  assert.equal(navigations, 1);
});
