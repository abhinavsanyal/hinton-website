import test from "node:test";
import assert from "node:assert/strict";
import { configureGoogleTag, createGoogleTagState, GA_ID } from "../src/lib/google-tag.ts";

function harness() {
  const state = createGoogleTagState();
  const commands: unknown[][] = [];
  return { state, commands, configure: (analytics: boolean, marketing: boolean, adsId?: string) => configureGoogleTag(state, (...args) => commands.push(args), { analytics, marketing }, adsId) };
}
test("rejecting optional consent sends no Google initialization commands", () => {
  const h = harness();
  assert.equal(h.configure(false, false, "AW-18469066667"), false);
  assert.deepEqual(h.commands, []);
});
test("repeated route effects configure one tag without manual route page views", () => {
  const h = harness();
  for (let i = 0; i < 6; i++) h.configure(true, true, "AW-18469066667");
  assert.equal(h.commands.filter(command => command[0] === "js").length, 1);
  assert.deepEqual(h.commands.filter(command => command[0] === "config"), [["config", GA_ID, { send_page_view: true }]]);
  assert.equal(h.commands.filter(command => command[0] === "event").length, 0);
});
test("consent upgrades do not initialize the linked Google tag twice", () => {
  const h = harness();
  h.configure(false, true, "AW-18469066667");
  h.configure(false, true, "AW-18469066667");
  h.configure(true, true, "AW-18469066667");
  h.configure(true, true, "AW-18469066667");
  assert.equal(h.commands.filter(command => command[0] === "js").length, 1);
  assert.deepEqual(h.commands.filter(command => command[0] === "config"), [["config", GA_ID, { send_page_view: false }]]);
  assert.deepEqual(h.commands.filter(command => command[0] === "event"), [["event", "page_view", { send_to: GA_ID }]]);
});
test("a genuinely separate Ads target is configured once without extra page views", () => {
  const h = harness();
  h.configure(true, false, "AW-999999999");
  h.configure(true, true, "AW-999999999");
  h.configure(true, true, "AW-999999999");
  assert.deepEqual(h.commands.filter(command => command[0] === "config"), [["config", GA_ID, { send_page_view: true }], ["config", "AW-999999999", { send_page_view: false }]]);
});
