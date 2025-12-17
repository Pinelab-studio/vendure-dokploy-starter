import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";

import { shopApiExtensions } from "./api/api-extensions";
import { ShopResolver } from "./api/shop.resolver";
import { BaseOrderCodeStrategy } from "./config/order-code-strategy";
import { BASE_PLUGIN_OPTIONS } from "./constants";
import { customFields } from "./custom-fields";
import { BasePriceService } from "./services/base-price-service";
import { BasePluginOptions } from "./types";

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [
    { provide: BASE_PLUGIN_OPTIONS, useFactory: () => BasePlugin.options },
    BasePriceService,
  ],
  configuration: (config) => {

    // Defining here is the same as defining in the vendure-config.ts file.

    // TODO enable during demo
    // config.orderOptions.orderCodeStrategy = new BaseOrderCodeStrategy();
    // config.customFields = {
    //     ...config.customFields,
    //     ...customFields,
    // }

    return config;
  },
  compatibility: "^3.0.0",
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [ShopResolver],
  },
})
export class BasePlugin {
  static options: BasePluginOptions;

  static init(options: BasePluginOptions): Type<BasePlugin> {
    this.options = options;
    return BasePlugin;
  }
}
