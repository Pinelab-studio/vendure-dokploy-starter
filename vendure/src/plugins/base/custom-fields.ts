import { CustomFields, LanguageCode } from "@vendure/core";
// Note: we are using a deep import here, rather than importing from `@vendure/core` due to
// a possible bug in TypeScript (https://github.com/microsoft/TypeScript/issues/46617) which
// causes issues when multiple plugins extend the same custom fields interface.
import { CustomProductVariantFields } from "@vendure/core/dist/entity/custom-entity-fields";

export const customFields: CustomFields = {
  ProductVariant: [
    {
      name: "volume",
      type: "int",
      label: [
        {
          languageCode: LanguageCode.en,
          value: "Volume",
        },
      ],
      ui: {
        tab: "Physical Properties",

        suffix: "ml",
      },
    },
  ],
};

declare module "@vendure/core/dist/entity/custom-entity-fields" {
  interface CustomProductVariantFields {
    volume?: number;
  }
}
