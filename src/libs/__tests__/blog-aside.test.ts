import { describe, it, expect } from "vitest";
import { getAsideMenuConfig } from "../blog-aside";

describe("getAsideMenuConfig", () => {
  it("devuelve la config del sección models en inglés", () => {
    const config = getAsideMenuConfig("models", "en");
    expect(config.title).toBe("Models");
    expect(Array.isArray(config.quickLinks)).toBe(true);
  });

  it("devuelve la config de modelos en español", () => {
    const config = getAsideMenuConfig("models", "es");
    expect(config.title).toBe("Modelos");
  });

  it("cae a config por defecto para sección desconocida", () => {
    const config = getAsideMenuConfig("unknown-section", "en");
    expect(config).toHaveProperty("title");
    expect(config).toHaveProperty("quickLinks");
  });
});
