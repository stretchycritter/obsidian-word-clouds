jest.mock(
  "obsidian",
  () => ({
    moment: {
      locale: jest.fn()
    }
  }),
  { virtual: true }
);

import { moment } from "obsidian";
import { getActiveLocale, initI18n, setLocale, t } from "../index";

const mockedLocale = moment.locale as jest.MockedFunction<typeof moment.locale>;

describe("i18n index", () => {
  beforeEach(() => {
    mockedLocale.mockReset();
    setLocale("en");
  });

  test("initI18n uses Obsidian locale and resolves region variants", () => {
    mockedLocale.mockReturnValue("en-US");

    initI18n();

    expect(getActiveLocale()).toBe("en");
  });

  test("setLocale falls back to default for unsupported locales", () => {
    setLocale("fr-FR");

    expect(getActiveLocale()).toBe("en");
  });

  test("setLocale without argument uses Obsidian locale", () => {
    mockedLocale.mockReturnValue("en_GB");

    setLocale();

    expect(getActiveLocale()).toBe("en");
  });

  test("t returns translated value for known key", () => {
    expect(t("test")).toBe("this is a test translation");
  });

  test("t returns key when translation is missing", () => {
    expect(t("missing.translation.key")).toBe("missing.translation.key");
  });

  test("t accepts locale override and resolves unsupported values to english", () => {
    expect(t("commands.openVaultWordCloud", "en-US")).toBe("Open vault word cloud");
    expect(t("commands.openVaultWordCloud", "de-DE")).toBe("Open vault word cloud");
  });
});
