import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { SUPPORTED_TRANSLATIONS } from "../supported-translations";

describe("SUPPORTED_TRANSLATIONS", () => {
  test("each supported translation has a matching i18n json file", () => {
    for (const locale of SUPPORTED_TRANSLATIONS) {
      const localeFile = resolve(__dirname, "..", `${locale}.json`);
      expect(existsSync(localeFile)).toBe(true);
    }
  });
});
