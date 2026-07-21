import { findTypeReferenceSites, validateReferenceSites } from "../scripts/lib/reference-sites.js";

describe("CountryCode reverse-reference coverage", () => {
  it("discovers and resolves every current consumer mapping", async () => {
    const sites = await findTypeReferenceSites(
      process.cwd(),
      "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/CountryCode.schema.json"
    );

    expect(sites.map((site) => `${site.sourceSchemaPath}:${site.propertyPath}`)).toEqual([
      "objects/Issuer.schema.json:country_of_formation",
      "types/Address.schema.json:country",
      "types/TaxID.schema.json:country",
    ]);
    expect(validateReferenceSites(sites)).toEqual([]);
  });
});
