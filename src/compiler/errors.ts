// Based on https://github.com/jdiaz5513/capnp-ts (MIT - Julián Díaz)

export const GEN_EXPLICIT_DEFAULT_NON_PRIMITIVE =
  "ZAP-ES000 Don't know how to generate a %s field with an explicit default value.";

export const GEN_FIELD_NON_INLINE_STRUCT_LIST =
  "ZAP-ES001 Don't know how to generate non-inline struct lists.";

export const GEN_NODE_LOOKUP_FAIL = "ZAP-ES002 Failed to look up node id %s.";

export const GEN_NODE_UNKNOWN_TYPE =
  'ZAP-ES003 Don\'t know how to generate a "%s" node.';

export const GEN_SERIALIZE_UNKNOWN_VALUE =
  "ZAP-ES004 Don't know how to serialize a value of kind %s.";

export const GEN_UNKNOWN_STRUCT_FIELD =
  "ZAP-ES005 Don't know how to generate a struct field of kind %d.";

export const GEN_UNKNOWN_TYPE = "ZAP-ES006 Unknown slot type encountered: %d";

export const GEN_UNSUPPORTED_LIST_ELEMENT_TYPE =
  "ZAP-ES007 Encountered an unsupported list element type: %d";

export const GEN_ZAP_TS_IMPORT_CORRUPT =
  "ZAP-ES008 Was able to import ts.zap but could not locate the importPath annotation definition.";

export const GEN_TS_EMIT_FAILED =
  "ZAP-ES009 Failed to transpile emitted schema source code; see above for error messages.";

export const GEN_UNKNOWN_DEFAULT =
  "ZAP-ES010 Don't know how to generate a default value for %s fields.";
