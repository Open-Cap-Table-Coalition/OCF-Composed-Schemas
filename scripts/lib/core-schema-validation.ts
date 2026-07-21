import Ajv from "ajv";
import addFormats from "ajv-formats";

/**
 * Compile every generated schema with Ajv's draft-07 meta-schema enabled.
 * Compilation validates the schema document itself; it does not validate an
 * instance. The generated package is intentionally self-contained, so one
 * Ajv instance can compile the complete map without external `$ref`s.
 */
export function validateSchemaPackage(schemas: Map<string, Record<string, unknown>>): string[] {
  const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: true });
  addFormats(ajv);
  const failures: string[] = [];
  for (const [rel, schema] of schemas) {
    try {
      ajv.compile(schema);
    } catch (error) {
      failures.push(`${rel}: ${(error as Error).message}`);
    }
  }
  return failures;
}
