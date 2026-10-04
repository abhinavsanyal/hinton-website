import test from "node:test";
import assert from "node:assert/strict";
import { trackMetaContact } from "../src/lib/meta-contact.ts";
test("Meta contact events respect consent and distinguish intent from received leads", () => {
  const calls: unknown[][] = [];
  const pixel = (...args: unknown[]) => calls.push(args);
  assert.equal(trackMetaContact(pixel, false, "whatsapp_click"), false);
  assert.equal(trackMetaContact(undefined, true, "phone_click"), false);
  assert.deepEqual(calls, []);
  assert.equal(trackMetaContact(pixel, true, "whatsapp_click"), true);
  assert.equal(trackMetaContact(pixel, true, "phone_click"), true);
  assert.deepEqual(calls, [["track", "Contact", { content_name: "whatsapp_click" }], ["track", "Contact", { content_name: "phone_click" }]]);
});
test("pixel failures cannot block contact navigation", () => {
  assert.equal(trackMetaContact(() => { throw new Error("blocked"); }, true, "phone_click"), false);
});
